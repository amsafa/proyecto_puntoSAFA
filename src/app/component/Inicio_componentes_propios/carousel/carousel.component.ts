import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { LibroService } from '../../../service/libro.service';
import { Libro } from '../../../interface/libro';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [NgFor],
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;

  private destroy$ = new Subject<void>();
  private autoScrollInterval!: number;
  private continuousScrollInterval!: number;

  books: Libro[] = [];
  loading = true;
  errorMessage = '';

  constructor(private apiService: LibroService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Libro[]) => {
          this.books = data;
          this.loading = false;
          setTimeout(() => this.startAutoScroll(), 500); // Iniciar el desplazamiento automático después de 500ms
          this.books = this.getRandomBooks(data, 10);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'Error al cargar los libros. Inténtalo de nuevo.';
          this.loading = false;
        }
      });
  }

  ngAfterViewInit(): void {
    this.setupScrollLoop();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.autoScrollInterval);
    clearInterval(this.continuousScrollInterval);
  }

  scroll(direction: 'left' | 'right'): void {
    const carouselElement = this.carousel.nativeElement;
    const itemWidth = carouselElement.querySelector('div')?.offsetWidth || 300;
    const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;

    carouselElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    setTimeout(() => this.checkLoopPosition(direction), 400);
  }

  startAutoScroll(): void {
    // Detener el intervalo existente si ya está activo
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }

    const scrollInterval = 3000;  // Intervalo en milisegundos para cada scroll
    this.autoScrollInterval = window.setInterval(() => {
      this.scroll('right');
    }, scrollInterval);
  }

  setupScrollLoop(): void {
    const carouselElement = this.carousel.nativeElement;

    carouselElement.addEventListener('scroll', () => {
      this.checkLoopPosition();
    });
  }

  checkLoopPosition(direction?: 'left' | 'right'): void {
    const carouselElement = this.carousel.nativeElement;
    const itemWidth = carouselElement.querySelector('div')?.offsetWidth || 300;

    // Si llegamos al final, movemos el primer libro al final
    if (carouselElement.scrollLeft + carouselElement.offsetWidth >= carouselElement.scrollWidth - itemWidth) {
      const firstBook = this.books.shift();
      if (firstBook) {
        this.books.push(firstBook);
      }
      carouselElement.scrollLeft -= itemWidth; // Ajustamos para que el scroll sea fluido
    }

    // Si llegamos al inicio, movemos el último libro al principio
    if (carouselElement.scrollLeft <= 0) {
      const lastBook = this.books.pop();
      if (lastBook) {
        this.books.unshift(lastBook);
      }
      carouselElement.scrollLeft += itemWidth;
    }
  }

  verDetallesLibro(idLibro: number): void {
    this.router.navigate(['/detalle-libro', idLibro]);
  }

  onMouseDown(event: MouseEvent): void {
    if (event.target instanceof HTMLElement && event.target.tagName === 'BUTTON') {
      const direction = event.target.textContent?.trim() === '‹' ? 'left' : 'right';
      this.scrollContinuously(direction);
    }
  }

  onMouseUp(): void {
    clearInterval(this.continuousScrollInterval);
  }

  scrollContinuously(direction: 'left' | 'right'): void {
    this.continuousScrollInterval = window.setInterval(() => {
      this.scroll(direction);
    }, 100);
  }

  onMouseEnter(): void {
    clearInterval(this.autoScrollInterval); // Detener el desplazamiento automático
  }

  onMouseLeave(): void {
    this.startAutoScroll(); // Reanudar el desplazamiento automático
  }

  // Obtiene libros aleatorios
  getRandomBooks(data: Libro[], count: number): Libro[] {
    return data.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}

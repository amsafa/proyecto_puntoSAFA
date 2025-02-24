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
  private animationFrameId!: number;
  private scrollSpeed = 2; // Ajusta la velocidad de desplazamiento

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
          this.books = this.getRandomBooks(data, 10);
          this.startContinuousScroll();
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
    this.stopContinuousScroll();
  }

  startContinuousScroll(): void {
    const scroll = () => {
      this.carousel.nativeElement.scrollBy({ left: this.scrollSpeed, behavior: 'auto' });
      this.checkLoopPosition();
      this.animationFrameId = requestAnimationFrame(scroll);
    };
    this.animationFrameId = requestAnimationFrame(scroll);
  }

  stopContinuousScroll(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  setupScrollLoop(): void {
    const carouselElement = this.carousel.nativeElement;

    carouselElement.addEventListener('scroll', () => {
      this.checkLoopPosition();
    });
  }

  checkLoopPosition(): void {
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

  onMouseEnter(): void {
    this.stopContinuousScroll(); // Detener el desplazamiento continuo
  }

  onMouseLeave(): void {
    this.startContinuousScroll(); // Reanudar el desplazamiento continuo
  }

  getRandomBooks(data: Libro[], count: number): Libro[] {
    return data.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}

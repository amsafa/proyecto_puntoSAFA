import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { NgForOf } from '@angular/common';
import { LibroService } from '../../../service/libro.service';
import { Libro } from '../../../interface/libro';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [BookCardComponent, NgForOf],
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;
  autoScrollInterval!: any;

  books: Libro[] = [];
  loading = true;
  errorMessage = '';

  constructor(private apiService: LibroService) {}

  ngOnInit() {
    console.log('CarouselComponent cargado');
    this.apiService.getBooks().subscribe({
      next: (data: Libro[]) => {
        this.books = data;
        console.log('Libros cargados:', this.books);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
        this.errorMessage = 'Error al cargar los libros. Inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    if (this.books.length && this.carousel) {
      this.startAutoScroll();
    }
  }

  ngOnDestroy() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      const carouselElement = this.carousel.nativeElement;

      if (carouselElement.scrollLeft + carouselElement.offsetWidth >= carouselElement.scrollWidth - 10) {
        setTimeout(() => {
          carouselElement.scrollTo({ left: 0, behavior: 'smooth' });
        }, 1000); // Pausa de 1 segundo antes de reiniciar
      } else {
        this.scrollRight();
      }
    }, 3000);
  }
}

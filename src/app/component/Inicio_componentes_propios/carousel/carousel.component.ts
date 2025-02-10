import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { NgForOf } from '@angular/common';
import {LibroService} from '../../../service/libro.service';
import {Libro} from '../../../interface/./libro';
import {data} from 'autoprefixer';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [BookCardComponent, NgForOf],
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;
  autoScrollInterval!: any;

  books: Libro[] = [];
  loading = true;
  errorMessage = '';

  constructor(private apiService: LibroService) {}

  // Esto es lo que se ejecuta al cargar la página
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



  // Esto es lo que se ejecuta después de cargar la página
  ngAfterViewInit() {
    if (this.books.length) {
      this.startAutoScroll();
    }
  }

  // Esto es lo que se ejecuta al salir de la página
  ngOnDestroy() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  // Funciones para mover el carrusel a la izquierda o a la derecha
  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  // Funciones para mover el carrusel a la izquierda o a la derecha
  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // Función para iniciar el carrusel automático
  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      const carouselElement = this.carousel.nativeElement;
      if (carouselElement.scrollLeft + carouselElement.offsetWidth >= carouselElement.scrollWidth) {
        carouselElement.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        this.scrollRight();
      }
    }, 3000);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { LibroService } from '../../../service/libro.service';
import { Libro } from '../../../interface/libro';
import { NgForOf, NgIf } from '@angular/common';
import { BookCardCategoriaComponent } from '../book-card-categoria/book-card-categoria.component';



@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',

  imports: [
    NgIf,
    NgForOf,
    BookCardCategoriaComponent
  ],
  styleUrls: ['./book-list.component.css'],
  standalone: true // Asegúrate de que este componente sea standalone si estás usando Angular 14+
})
export class BookListComponent implements OnInit {
  @Input() categoryId!: number; // Recibe categoría desde CajasCategoriaInicio
  books: Libro[] = [];
  loading = true;
  errorMessage = '';

  constructor(private apiService: LibroService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  // Carga los libros de la categoría seleccionada
  loadBooks(): void {
    this.apiService.getBooksByCategory(this.categoryId).subscribe({
      next: (data: Libro[]) => {
        this.books = this.getRandomBooks(data, 3); // Filtra 3 libros aleatorios
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar los libros:', error);
        this.errorMessage = 'Error al cargar los libros. Por favor, inténtelo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  // Obtener libros aleatorios. Esto es solo para mostrar cómo se pueden mostrar libros aleatorios
  getRandomBooks(books: Libro[], count: number): Libro[] {
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Esto es para que Angular sepa cómo rastrear los libros por su ID
  trackByBookId(index: number, book: Libro): number {
    return book.id;
  }
}

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LibroService} from '../../../service/libro.service';
import {Libro} from '../../../interface/./libro';
import {BookCardComponent} from '../book-card/book-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {data} from 'autoprefixer';
import {count} from 'rxjs';



@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',

  imports: [
    BookCardComponent,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnChanges {
  @Input() categoryId!: number; // Recibe categoría desde CajasCategoriaInicio
  books: Libro[] = [];
  loading = true;
  errorMessage = '';

  constructor(private apiService: LibroService) {}

  ngOnInit(): void {
    this.apiService.getBooksByCategory(this.categoryId).subscribe({
      next: (data) => {
        this.books = this.getRandomBooks(data, 3); // Filtra 3 libros aleatorios
        this.loading = false;
        //this.books = data;
        console.log('Libros cargados en book-list:', this.books);
      },
      error: (error) => {
        console.error('Error al cargar los libros:', error);
        this.errorMessage = 'Error al cargar los libros';
        this.loading = false;
      }
    });
  }

  getRandomBooks(books: Libro[], count: number): Libro[] {
    return books.sort(() => 0.5 - Math.random()).slice(0, count);
  }


  ngOnChanges(changes: SimpleChanges): void {
  }
}

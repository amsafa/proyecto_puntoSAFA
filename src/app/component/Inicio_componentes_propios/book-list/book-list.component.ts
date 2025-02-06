import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from '../../../service/api.service';
import {Book} from '../../../interface/book';
import {BookCardComponent} from '../book-card/book-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {data} from 'autoprefixer';
import {book} from 'ionicons/icons';


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
  books: Book[] = [];
  loading = true;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (this.categoryId) {
      this.apiService.getBooksByCategory(this.categoryId).subscribe({
        next: (data) => {
          this.books = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar los libros:', error);
          this.errorMessage = 'Error al cargar los libros';
          this.loading = false;
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import {NgForOf, NgIf} from '@angular/common';
import {BookCardComponent} from '../book-card/book-card.component';
import {Book} from '../../../interface/book';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [
    NgIf,
    BookCardComponent,
    NgForOf
  ]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  //Esta función se ejecuta al cargar la página
  ngOnInit(): void {
    this.apiService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Error al cargar los libros';
        this.loading = false;
      }
    });
  }
}

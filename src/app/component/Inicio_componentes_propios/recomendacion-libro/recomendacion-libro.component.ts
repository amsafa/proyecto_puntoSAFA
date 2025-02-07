import {Component, Input, OnInit} from '@angular/core';
import {BookCardComponent} from '../book-card/book-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {BookCardCategoriaComponent} from '../book-card-categoria/book-card-categoria.component';
import {Libro} from '../../../interface/libro';
import {book} from 'ionicons/icons';
import {LibroService} from '../../../service/libro.service';

@Component({
  selector: 'app-recomendacion-libro',
  templateUrl: './recomendacion-libro.component.html',
  styleUrls: ['./recomendacion-libro.component.css'],
  standalone: true,
  imports: [

    NgForOf
  ]
})
export class RecomendacionLibroComponent implements OnInit {
  libros: Libro[] = [];

  constructor(private apiService: LibroService) {}

  ngOnInit(): void {
    this.loadRandomBooks();
    setInterval(() => {
      this.loadRandomBooks();
    }, 300000); // 300000 ms = 5 minutes
  }

  private loadRandomBooks(): void {
    this.apiService.getBooks().subscribe((books: Libro[]) => {
      if (books.length > 0) {
        const randomIndex = Math.floor(Math.random() * books.length);
        this.libros = [books[randomIndex]];
      }
    });
  }
}





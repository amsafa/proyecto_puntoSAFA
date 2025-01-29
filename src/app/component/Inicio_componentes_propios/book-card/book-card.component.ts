import { Component, Input, OnInit } from '@angular/core'; // Importamos Input para recibir datos externos
import { CurrencyPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    CurrencyPipe,
  ],
})
export class BookCardComponent implements OnInit {
  // Datos recibidos desde el componente padre (opcional)
  @Input() books: { title: string; author: string; price: number; image: string }[] | null = null;

  // Datos por defecto si no se recibe `@Input`
  defaultBooks = [
    {
      title: 'La huella del verdugo',
      author: 'Stephen King',
      price: 18.95,
      image: 'https://imgv2-2-f.scribdassets.com/img/document/710958426/original/9183498569/1711766544?v=1',
    },
    {
      title: 'Juego de Tronos',
      author: 'George R. R. Martin',
      price: 25.99,
      image: 'https://gigamesh.com/wp-content/uploads/2023/05/Juego-de-tronos.jpg',
    },
    {
      title: 'Sombra y Huesos',
      author: 'Leigh Bardugo',
      price: 13.95,
      image: 'https://www.popularlibros.com/imagenes-webp-grandes/9788418/978841800249.webp',
    },
  ];

  constructor() {}

  ngOnInit() {}

  // Obtener libros (desde `@Input` o usar `defaultBooks`)
  @Input() book!: any;
  get displayedBooks() {
    return this.books || this.defaultBooks;
  }
}

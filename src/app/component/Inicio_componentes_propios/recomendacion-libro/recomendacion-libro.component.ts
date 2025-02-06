import { Component, OnInit } from '@angular/core';
import {BookCardComponent} from '../book-card/book-card.component';

@Component({
  selector: 'app-recomendacion-libro',
  templateUrl: './recomendacion-libro.component.html',
  styleUrls: ['./recomendacion-libro.component.css'],
  standalone: true,
  imports: [
    BookCardComponent
  ]
})
export class RecomendacionLibroComponent  implements OnInit {
  books = [
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

  randomBook: any = null;

  ngOnInit() {
    this.selectRandomBook();
  }



  selectRandomBook() {
    // Obtiene el índice basado en el día actual
    const currentDay = new Date().getDay();
    console.log('Current Day:', currentDay);
    const randomIndex = currentDay % this.books.length; // Elige un índice basado en el día
    console.log('Random Index:', randomIndex);
    this.randomBook = this.books[randomIndex];
    console.log('Random Libro:', this.randomBook);
  }
}

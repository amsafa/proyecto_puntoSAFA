import { Component, Input } from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {Libro} from '../../../interface/libro';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
  standalone: true,
  imports: [
    CurrencyPipe
  ]
})
export class BookCardComponent {
  // Significa que el componente espera un input de tipo Libro y se llama book
  @Input() book!: Libro; // Tipa book como Libro
}

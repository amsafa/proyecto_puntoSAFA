import {Component, Input} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {Libro} from '../../../interface/libro';

@Component({
  selector: 'app-book-card-categoria',
    imports: [
        CurrencyPipe
    ],
  templateUrl: './book-card-categoria.component.html',
  styleUrl: './book-card-categoria.component.css'
})
export class BookCardCategoriaComponent {
  @Input() book!: Libro; // Tipa book como Libro


}

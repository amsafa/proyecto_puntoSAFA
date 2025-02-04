import { Component, Input } from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {Book} from '../../../interface/book';

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
  @Input() book!: Book;
}

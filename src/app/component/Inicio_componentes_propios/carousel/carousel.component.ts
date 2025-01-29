import {Component, NgIterable, OnInit} from '@angular/core';
import {BookCardComponent} from '../book-card/book-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [
    BookCardComponent,
    NgForOf
  ]
})
export class CarouselComponent  implements OnInit {
  books: (NgIterable<unknown> & NgIterable<any>) | undefined | null;

  constructor() { }

  ngOnInit() {}

}

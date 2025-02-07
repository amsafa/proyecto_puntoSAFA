import { Component, OnInit } from '@angular/core';
import { BookListComponent } from '../book-list/book-list.component';

@Component({
  selector: 'app-cajas-categoria-inicio',
  templateUrl: './cajas-categoria-inicio.component.html',
  styleUrls: ['./cajas-categoria-inicio.component.css'],
  standalone: true,
  imports: [
    BookListComponent
  ]
})
export class CajasCategoriaInicioComponent implements OnInit {
  categories = ['fiction', 'nonFiction'];

  constructor() {}

  ngOnInit(): void {}
}

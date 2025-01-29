import { Component, OnInit } from '@angular/core';
import {BookCardComponent} from '../book-card/book-card.component';

@Component({
  selector: 'app-cajas-categoria-inicio',
  templateUrl: './cajas-categoria-inicio.component.html',
  styleUrls: ['./cajas-categoria-inicio.component.css'],
  standalone: true,
  imports: [
    BookCardComponent
  ]
})
export class CajasCategoriaInicioComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}

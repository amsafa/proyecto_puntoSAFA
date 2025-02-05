import {Component, Input, OnInit} from '@angular/core';
import {HeaderComponent} from '../../../component/header/header.component';
import {FooterComponent} from '../../../component/footer/footer.component';
import {HeroSecccionesComponent} from '../../../component/hero-secciones/hero-seccciones/hero-seccciones.component';
import {BuscadorInicioComponent} from '../../../component/buscador-inicio/buscador-inicio.component';
import {FiltroCatalogoComponent} from '../../../component/filtro-catalogo/filtro-catalogo/filtro-catalogo.component';
import {CurrencyPipe, NgForOf} from '@angular/common';


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  imports: [

    HeroSecccionesComponent,
    BuscadorInicioComponent,
    HeaderComponent,
    FooterComponent,
    FiltroCatalogoComponent,
    CurrencyPipe,
    NgForOf,

  ]
})
export class CatalogoComponent  implements OnInit {
  @Input() books: { title: string; author: string; price: number; image: string }[] | null = null;

  constructor() { }

  ngOnInit() {}

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
      title: 'It',
      author: 'S. King',
      price: 16.95,
      image: 'https://es.naufragia.com/wp-content/uploads/2021/04/71z7OGtw8wL-1347x2048.jpg',
    },
    {
      title: 'Fray Perico',
      author: 'S. King',
      price: 16.95,
      image: 'https://es.naufragia.com/wp-content/uploads/2021/04/71z7OGtw8wL-1347x2048.jpg',
    },



  ];

  @Input() book!: any;
  get displayedBooks() {
    return this.books || this.defaultBooks;
  }
}

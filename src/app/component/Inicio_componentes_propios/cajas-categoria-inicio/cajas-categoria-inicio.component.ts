import { Component } from '@angular/core';
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
export class CajasCategoriaInicioComponent {
  // Constantes para los nombres e IDs de las categorías
  readonly category1Name = 'Ciencia y Divulgación';
  readonly category1Id = 1;

  readonly category2Name = 'Literatura y Clásicos';
  readonly category2Id = 2;


}

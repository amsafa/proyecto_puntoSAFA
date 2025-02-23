import { Component, OnInit } from '@angular/core';
import { BookListComponent } from '../book-list/book-list.component';
import {Router} from '@angular/router';

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

  // Inyecta el Router en el constructor de tu componente
  constructor(private router: Router) {}

  // Constantes para los nombres e IDs de las categorías
  readonly category1Name = 'Ciencia y Divulgación';
  readonly category1Id: number = 1;

  readonly category2Name = 'Literatura y Clásicos';
  readonly category2Id = 2;

  readonly category3Name = 'Infantil y Juvenil';
  readonly category3Id: number = 3;

  // Implementa la función redirectToCatalog
  redirectToCatalog(categoryId: number): void {
    this.router.navigate(['/catalogo'], { queryParams: { categoryId: categoryId } });
  }


}

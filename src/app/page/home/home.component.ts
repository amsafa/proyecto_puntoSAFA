import { Component, OnInit } from '@angular/core';
import {HeroSectionInicioComponent } from '../../component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';
import { CajasCategoriaInicioComponent } from '../../component/Inicio_componentes_propios/cajas-categoria-inicio/cajas-categoria-inicio.component';
import {CarouselComponent} from "../../component/Inicio_componentes_propios/carousel/carousel.component";
import {
  RecomendacionLibroComponent
} from "../../component/Inicio_componentes_propios/recomendacion-libro/recomendacion-libro.component";
import {Libro} from '../../interface/libro';

import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    HeroSectionInicioComponent,
    CajasCategoriaInicioComponent,
    CarouselComponent,
    RecomendacionLibroComponent,
    FormsModule
  ]
})
export class HomeComponent  implements OnInit {


  constructor(private  router:Router) {}

  //Esta función se ejecuta al cargar la página
  ngOnInit() {

  }


  libros: Libro[] = [];
  filteredBooks: Libro[] = [];
  filter: string = '';


  searchBooks(): void {
    const searchTerm = this.filter.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredBooks = this.libros;
    } else {
      this.filteredBooks = this.libros.filter(libro =>
        libro.titulo?.toLowerCase().includes(searchTerm) ||
        libro.autor?.apellidos?.toLowerCase().includes(searchTerm) ||
        libro.autor?.nombre?.toLowerCase().includes(searchTerm)
      );
    }

    // Redirect with query params
    this.router.navigate(['/catalogo'], { queryParams: { search: searchTerm } });
  }
  clearSearch(): void {
    this.filter = '';
    this.filteredBooks = this.libros;
  }
}

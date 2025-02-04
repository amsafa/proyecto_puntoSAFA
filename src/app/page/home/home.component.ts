import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from '../../component/header/header.component';
import {HeroSectionInicioComponent } from '../../component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';
import {BuscadorInicioComponent} from '../../component/buscador-inicio/buscador-inicio.component';
import { CajasCategoriaInicioComponent } from '../../component/Inicio_componentes_propios/cajas-categoria-inicio/cajas-categoria-inicio.component';
import {FooterComponent} from "../../component/footer/footer.component";
import {CarouselComponent} from "../../component/Inicio_componentes_propios/carousel/carousel.component";
import {
  RecomendacionLibroComponent
} from "../../component/Inicio_componentes_propios/recomendacion-libro/recomendacion-libro.component";
import {Book} from '../../interface/book';
import {ApiService} from '../../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    HeroSectionInicioComponent,
    BuscadorInicioComponent,
    CajasCategoriaInicioComponent,
    FooterComponent,
    CarouselComponent,
    RecomendacionLibroComponent
  ]
})
export class HomeComponent  implements OnInit {
  books: Book[] = [];
  loading = true;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  //Esta función se ejecuta al cargar la página
  ngOnInit() {
    this.apiService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
        this.errorMessage = 'Error al cargar los libros. Inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }
}

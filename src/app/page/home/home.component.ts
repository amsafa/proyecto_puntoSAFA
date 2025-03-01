import {Component, OnInit} from '@angular/core';
import {HeroSectionInicioComponent } from '../../component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';
import { CajasCategoriaInicioComponent } from '../../component/Inicio_componentes_propios/cajas-categoria-inicio/cajas-categoria-inicio.component';
import {CarouselComponent} from "../../component/Inicio_componentes_propios/carousel/carousel.component";
import {
  RecomendacionLibroComponent
} from "../../component/Inicio_componentes_propios/recomendacion-libro/recomendacion-libro.component";
import {Libro} from '../../interface/libro';

import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LibroService} from '../../service/libro.service';

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

  limit: number = 9;
  libros: Libro[] = [];
  filteredBooks: Libro[] = [];
  searchTerm: string = '';
  noResults: boolean = false;
  filterB: string = '';



  constructor(private  router:Router, private route:ActivatedRoute, private libroService:LibroService) {}

  //Esta función se ejecuta al cargar la página
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filterB = params['search'] || '';
      console.log('Search term from query params:', this.filterB);
      if (this.filterB) {
        this.onSearch();
      }
    });

    }




  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return; // Prevents navigation if search term is empty
    }
    const trimmedSearchTerm = this.searchTerm.trim(); // Ensure searchTerm is trimmed
    console.log('Search term:', trimmedSearchTerm);
    this.router.navigate(['/catalogo'], { queryParams: { search: trimmedSearchTerm } });
  }

  searchLibros(): void {
    const busqueda = this.filterB.toLowerCase().trim();
    console.log('Filtered term:', busqueda);
    if (!busqueda) {
      this.filteredBooks = this.libros;
      this.noResults = false;
      console.log('No search term, showing all books');
      return;
    }

    this.filteredBooks = this.libros.filter(book =>
      book.titulo?.toLowerCase().includes(busqueda) ||
      book.autorNombre.toLowerCase().includes(busqueda) ||
      book.autorApellidos.toLowerCase().includes(busqueda)
    );

    this.noResults = this.filteredBooks.length === 0;
    console.log('Filtered books:', this.filteredBooks); // Debugging statement
    console.log('No results:', this.noResults);

  }

  clearSearch(): void {
    this.filterB = '';
    this.filteredBooks = this.libros;
  }
}

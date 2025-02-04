import {Component, Input, OnInit} from '@angular/core';
import {HeaderComponent} from '../../../component/header/header.component';
import {FooterComponent} from '../../../component/footer/footer.component';
import {HeroSecccionesComponent} from '../../../component/hero-secciones/hero-seccciones/hero-seccciones.component';
import {BuscadorInicioComponent} from '../../../component/buscador-inicio/buscador-inicio.component';
import {FiltroCatalogoComponent} from '../../../component/filtro-catalogo/filtro-catalogo/filtro-catalogo.component';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {Libro} from '../../../interface/libro';
import {LibroService} from '../../../service/libro.service';



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
export class CatalogoComponent implements OnInit {
  query: string = '';
  libros: Libro[] = [];

 constructor(private libroService: LibroService) {
 }

  ngOnInit(): void {
    this.cargarLibros().then(libros => {
      this.libros = libros; // Assuming 'users' is the property where you store the fetched users
    }).catch(error => {
      console.error('Error fetching books:', error); // Handle any errors that occur during the fetch
    });

  }

  async cargarLibros(): Promise<any> {
    try {
      return await this.libroService.getLibros(); // Call the service to fetch users
    } catch (error) {
      console.error('Error in cargarLibros:', error);
      throw error; // Rethrow the error to be caught in ngOnInit

    }
 }

  async searchLibros(): Promise<void> {

    if (this.query) {

      this.libros = await this.libroService.searchLibros(this.query);

    } else {

      this.libros = []; // Clear results if search term is empty
    }
  }



}

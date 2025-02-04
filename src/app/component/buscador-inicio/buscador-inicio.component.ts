import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LibroService} from '../../service/libro.service';
import {Libro} from '../../interface/libro';

@Component({
  selector: 'app-buscador-inicio',
  templateUrl: './buscador-inicio.component.html',
  styleUrls: ['./buscador-inicio.component.css'],
  standalone: true,
})
export class BuscadorInicioComponent {

  constructor(private libroService: LibroService) {
  }

  // @Output() resultadoBusqueda: EventEmitter<Libro[]> = new EventEmitter<Libro[]>();
  //
  query: string = '';
  libros: Libro[] = [];


  // async searchLibros(): Promise<void> {
  //   if(this.query){
  //     const libros = await this.libroService.searchLibros(this.query);
  //     this.resultadoBusqueda.emit(libros);
  //   }else {
  //     this.resultadoBusqueda.emit([]);
  //   }

  // }

  async searchLibros(): Promise<void> {

    if (this.query) {

      this.libros = await this.libroService.searchLibros(this.query);

    } else {

      this.libros = []; // Clear results if search term is empty
    }
  }

}

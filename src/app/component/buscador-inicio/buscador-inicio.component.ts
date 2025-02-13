import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Libro} from '../../interface/libro';

@Component({
  selector: 'app-buscador-inicio',
  templateUrl: './buscador-inicio.component.html',
  styleUrls: ['./buscador-inicio.component.css'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class BuscadorInicioComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

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

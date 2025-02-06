import {Component, Input, input, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Libro} from '../../interface/libro';
import {LibroService} from '../../service/libro.service';
import {FormsModule} from '@angular/forms';
import {data} from 'autoprefixer';


@Component({
  selector: 'app-catalogo',
  templateUrl: '/catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  imports: [
    CurrencyPipe,
    NgForOf,
    FormsModule,
    NgIf

  ]
})
export class CatalogoComponent  implements OnInit {
  libros: Libro[] = [];
  filteredBooks: Libro[] = [];
  filter: string = '';

  constructor(private libroService: LibroService) {}

 @Input() categoriaId!: number;

  ngOnInit(): void {
    this.cargarLibros().then(libros => {
      this.libros = libros;
      this.filteredBooks = libros; //
      // Initialize with all books
      console.log("Estos son los libros de catalogo", this.libros);
    }).catch(error => {
      console.error('Error fetching books:', error);
    });


  }

  async cargarLibros(): Promise<Libro[]> {
    try {
      return await this.libroService.getLibros();
    } catch (error) {
      console.error('Error in cargarLibros:', error);
      throw error;
    }
  }

  searchBooks(): void {
    const searchTerm = this.filter?.toLowerCase().trim() || '';

    if (!searchTerm) {
      this.filteredBooks = this.libros; // Reset filter if empty
      return;
    }

    this.filteredBooks = this.libros.filter(libro =>
      (libro.titulo?.toLowerCase().includes(searchTerm) ||'') ||
      (libro.autor?.apellidos?.toLowerCase().includes(searchTerm) || '') ||
      (libro.autor?.nombre?.toLowerCase().includes(searchTerm) || '')
    );
  }

  clearSearch(): void {
    this.filter = '';
    this.filteredBooks = this.libros;
  }




}

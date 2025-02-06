import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {Libro} from '../../interface/libro';
import {LibroService} from '../../service/libro.service';
import {FormsModule} from '@angular/forms';



@Component({
  selector: 'app-catalogo',
  templateUrl: '/catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  imports: [
    CurrencyPipe,
    NgForOf,
    FormsModule

  ]
})
export class CatalogoComponent  implements OnInit {
  libros: Libro[] = [];

  constructor(private libroService: LibroService) {
  }

  ngOnInit(): void {
    this.cargarLibros().then(libros => {
      this.libros = libros;
      this.filteredBooks = libros;// Assuming 'users' is the property where you store the fetched users
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

  filteredBooks: Libro[] = []; // Stores filtered results
  filter: string = '';


  searchBooks() {
    debugger;
    this.filteredBooks = this.libros.filter(libro => {
      const matchesTitle = libro.titulo.toLowerCase().includes(this.filter.toLowerCase());
      const matchesAuthor = libro.autor.toLowerCase().includes(this.filter.toLowerCase());
      return matchesTitle || matchesAuthor;
    });
  }


}

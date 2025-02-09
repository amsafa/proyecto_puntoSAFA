import {Component, Input, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Libro} from '../../interface/libro';
import {LibroService} from '../../service/libro.service';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';



@Component({
  selector: 'app-catalogo',
  templateUrl: '/catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  imports: [
    CurrencyPipe,
    NgForOf,
    FormsModule,
    NgIf,
    HttpClientModule

  ]
})
export class CatalogoComponent  implements OnInit {
  libros: Libro[] = [];
  filteredBooks: Libro[] = [];
  filter: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  ordenaPor:string= 'titulo';

  constructor(private libroService: LibroService) {}

 @Input() categoriaId!: number;

  ngOnInit(): void {
    this.cargarLibros();


  }

  cargarLibros(): void {
    const params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      ordenar:this.ordenaPor
    };

    this.libroService.getLibros(params.page, params.limit).subscribe({
      next: (libros) => {
        this.libros = libros;
        this.filteredBooks = libros; // Initialize with all books
        console.log("Estos son los libros del catálogo:", this.libros);
      },
      error: (error) => {
        console.error('Error fetching books:', error);
      }
    });
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

  selectedPriceRange: string | null = null;
  filterByPrice(range: string): void{
    if (this.selectedPriceRange === range){
      this.selectedPriceRange = null;
      this.filteredBooks = this.libros;
    }else{
      this.selectedPriceRange = range;
      this.libroService.getLibrosByPrecio(range).subscribe(libros => {
        this.filteredBooks = libros;
      },error => {
        console.error('Error fetching books by price:', error);
        }
      )
    }

  }
  showCart = false;
  toggleCart() {
    this.showCart = !this.showCart;
  }

  cambiarPagina(delta: number): void {
    this.currentPage += delta;
    this.cargarLibros();
  }



}

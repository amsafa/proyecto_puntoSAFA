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
    HttpClientModule,
    ReactiveFormsModule

  ]
})
export class CatalogoComponent  implements OnInit {
  libros: Libro[] = [];
  filteredBooks: Libro[] = [];
  categories: Categoria[] = [];
  filter: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPagesArray: number[] = [];
  selectedCategoryId: number | null = null;

  ordenarPor = 'titulo';  // Default sorting option

  constructor(private libroService: LibroService) {}

 @Input() categoriaId!: number;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['search'] || '';
      this.cargarLibros().then(() => {
        if (this.filter) {
          this.searchBooks();
        }
      });
    });


  }

  async cargarLibros(): Promise<void> {
    try {
      // const params = { ordenarPor: this.ordernarPor  };
      // this.libros = await this.libroService.sortLibros(params);
      // this.libroService.sortLibros({ordenarPor: this.ordernarPor}).then(
      //   libros => {
      //     this.libros = libros;
      //   }
      // )

      const params = { page: this.currentPage, limit: this.itemsPerPage };
      this.libros = await this.libroService.getLibrosCatalogo(params);
      this.filteredBooks = [...this.libros];
      this.setupPagination();
      console.error(this.libros);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }

  searchBooks(): void {
    const searchTerm = this.filter.trim();

    if (!searchTerm) {
      this.filteredBooks = this.libros; // Reset if no search term
      return;
    }

    this.http.get<Libro[]>(`http://127.0.0.1:8000/libro/search?q=${searchTerm}`).subscribe((response: Libro[]) => {
      this.filteredBooks = response; // Use the API response
    });
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

  filterByCategory(categoryId:number):void{
    if(this.selectedCategoryId === categoryId){
      this.selectedCategoryId = null;
      this.filteredBooks = this.libros;

    }else{
      this.selectedCategoryId = categoryId;
      this.libroService.getBooksByCategory(categoryId).subscribe(books => {
        this.filteredBooks = books;
      },
        error => {
        console.error('Error fetching books by category:', error);
        })
    }
  }




  showCart = false;
  toggleCart() {
    this.showCart = !this.showCart;
  }

  verDetallesLibro(idLibro: number): void {
    debugger;
    this.router.navigate(['/detalle-libro', idLibro]);
  }








  changePage(page: number): void {
    this.currentPage = page;
    this.cargarLibros();
  }

  setupPagination(): void {
    const totalBooks = this.libros.length; // This should ideally come from the API
    const totalPages = Math.ceil(totalBooks / this.itemsPerPage);
    this.totalPagesArray = Array(totalPages).fill(0).map((_, i) => i + 1);
  }

  // applyFilters(): void {
  //   this.currentPage = 1; // Reset to first page on filter change
  //   this.cargarLibros();
  // }

  verDetallesLibro(idLibro: number): void {
    debugger;
    this.router.navigate(['/detalle-libro', idLibro]);
  }


}

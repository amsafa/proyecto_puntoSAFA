import {Component, Input, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Libro} from '../../interface/libro';
import {LibroService} from '../../service/libro.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
 import {Categoria} from '../../interface/categoria';
 import {ActivatedRoute, Router} from '@angular/router';
 import {CategoriaService} from '../../service/categoria.service';



@Component({
  selector: 'app-catalogo',
  templateUrl: '/catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  imports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    CurrencyPipe

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

  constructor(private libroService: LibroService, private http:HttpClient,
              private router:Router, private route:ActivatedRoute,
              private categoriaService:CategoriaService,) {}

 @Input() categoriaId!: number;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['search'] || ''; // Get search parameter from query params
      const page = params['page'] ? parseInt(params['page'], 10) : 1;
      const limit = params['limit'] ? parseInt(params['limit'], 10) : 9;

      this.cargarLibros(page, limit).then(() => {
        if (this.filter) {
          this.searchBooks();
        }
      });
    });

    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categories = categorias;
    });

  }

  cargarLibros(page: number = 1, limit: number = 9): Promise<void> {
    return new Promise((resolve, reject) => {
      this.libroService.getBooks(page, limit).subscribe(
        (data: Libro[]) => {
          this.libros = data;
          this.filteredBooks = [...this.libros]; // Ensure filtered list updates
          resolve(); // Resolve the promise once books are loaded
        },
        (error) => {
          console.error('Error fetching books:', error);
          reject(error);
        }
      );
    });
  }

  noResults: boolean = false;

  searchBooks(): void {
    const searchTerm = this.filter.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredBooks = this.libros;
      this.noResults = false;
    } else {
      this.filteredBooks = this.libros.filter(libro => {
        const { nombre, apellidos } = libro.autor || {}; // Destructure author object
        return (
          libro.titulo?.toLowerCase().includes(searchTerm) ||
          (apellidos && apellidos.toLowerCase().includes(searchTerm)) || // Check surname
          (nombre && nombre.toLowerCase().includes(searchTerm)) // Check name
        );
      });
      this.noResults = this.filteredBooks.length === 0;
    }
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
    this.router.navigate(['/detalle-libro', idLibro]);
  }


}

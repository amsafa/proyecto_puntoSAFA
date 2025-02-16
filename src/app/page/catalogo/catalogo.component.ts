import {Component, Input, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Libro} from '../../interface/libro';
import {LibroService} from '../../service/libro.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Categoria} from '../../interface/categoria';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriaService} from '../../service/categoria.service';
import {CarritoService} from '../../service/carrito.service';
import {LibroCarrito} from '../../interface/libro-carrito';
import {Observable} from 'rxjs';
import {AuthService} from '../../service/auth.service';




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
    CurrencyPipe,
      ]
})
export class CatalogoComponent  implements OnInit {
  // libros: Libro[] = [];
  // filteredBooks: Libro[] = [];
  // categories: Categoria[] = [];
  // filter: string = '';
  // currentPage: number = 1;
  // itemsPerPage: number = 9;
  // totalPagesArray: number[] = [];
  // selectedCategoryId: number | null = null;

  libros: Libro[] = [];
  filteredBooks: Libro[] = [];
  filter: string = '';
  categories: Categoria[] = [];
  selectedCategoryId: number | null = null;
  currentPage: number = 1;
  totalPages: number = 1; // Placeholder, will be set dynamically
  limit: number = 12;
  isLoggedIn: boolean = false;
  showAlert: boolean = false;






  ordenarPor = 'titulo';  // Default sorting option

  constructor(private libroService: LibroService, private http:HttpClient,
              private router:Router, private route:ActivatedRoute,
              private categoriaService:CategoriaService, private carritoService:CarritoService, private authService:AuthService) {}

  @Input() categoriaId!: number;




  // ngOnInit(): void {
  //   this.route.queryParams.subscribe(params => {
  //     this.filter = params['search'] || ''; // Get search parameter from query params
  //     const page = params['page'] ? parseInt(params['page'], 10) : 1;
  //     const limit = params['limit'] ? parseInt(params['limit'], 10) : 9;
  //
  //     this.cargarLibros(page, limit).then(() => {
  //       if (this.filter) {
  //         this.searchBooks();
  //       }
  //     });
  //   });
  //
  //   this.categoriaService.getCategorias().subscribe(categorias => {
  //     this.categories = categorias;
  //   });
  //
  // }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['search'] || '';
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 1;
      this.limit = params['limit'] ? parseInt(params['limit'], 10) : 9;

      this.cargarLibros(this.currentPage, this.limit);
    });
    this.categoriaService.getCategorias().subscribe(categorias => {
          this.categories = categorias;
        });
    this.authService.getAuthState().subscribe(state => {
      this.isLoggedIn = state;
    });
  }





  // cargarLibros(page: number = 1, limit: number = 9): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.libroService.getBooks(page, limit).subscribe(
  //       (data: Libro[]) => {
  //         this.libros = data;
  //         this.filteredBooks = [...this.libros]; // Ensure filtered list updates
  //         resolve(); // Resolve the promise once books are loaded
  //       },
  //       (error) => {
  //         console.error('Error fetching books:', error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  // cargarLibros(page: number = 1, limit: number = 9): void {
  //   this.libroService.getBooks(page, limit).subscribe({
  //     next: (data) => {
  //       this.libros = data;
  //       this.filteredBooks = [...this.libros]; // Preserve filtered state
  //       this.totalPages = Math.ceil(50 / this.limit); // Example: Assume total books are 50 (adjust based on API)
  //     },
  //     error: (error) => {
  //       console.error('Error fetching books:', error);
  //     }
  //   });
  // }

  cargarLibros(page: number = 1, limit: number = 9): void {
    this.currentPage = page;

    if (this.selectedPriceRange) {
      this.filterByPrice(this.selectedPriceRange, page, limit);
    } else if (this.selectedCategoryId) {
      this.filterByCategory(this.selectedCategoryId, page, limit);
    } else {
      this.libroService.getBooks(page, limit).subscribe({
        next: (data) => {
          this.libros = data;
          this.filteredBooks = [...this.libros];
          this.totalPages = Math.ceil(50 / limit); // Update based on backend response
        },
        error: (error) => console.error(error)
      });
    }
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
  // filterByPrice(range: string): void{
  //   if (this.selectedPriceRange === range){
  //     this.selectedPriceRange = null;
  //     this.filteredBooks = this.libros;
  //   }else{
  //     this.selectedPriceRange = range;
  //     this.libroService.getLibrosByPrecio(range).subscribe(libros => {
  //         this.filteredBooks = libros;
  //       },error => {
  //         console.error('Error fetching books by price:', error);
  //       }
  //     )
  //   }

  filterByPrice(range: string, page: number = 1, limit: number = 9): void {
    if (this.selectedPriceRange === range) {
      this.selectedPriceRange = null;
      this.filteredBooks = this.libros;
    } else {
      this.selectedPriceRange = range;
      this.libroService.getLibrosByPrecio(range, page, limit).subscribe({
        next: (libros) => {
          this.filteredBooks = libros;
          this.totalPages = Math.ceil(libros.length / limit); // Update total pages
          this.currentPage = page;
        },
        error: (error) => console.error(error)
      });
    }
  }




  // filterByCategory(categoryId:number):void{
  //   if(this.selectedCategoryId === categoryId){
  //     this.selectedCategoryId = null;
  //     this.filteredBooks = this.libros;
  //
  //   }else{
  //     this.selectedCategoryId = categoryId;
  //     this.libroService.getBooksByCategory(categoryId).subscribe(books => {
  //         this.filteredBooks = books;
  //       },
  //       error => {
  //         console.error('Error fetching books by category:', error);
  //       })
  //   }
  // }

  filterByCategory(categoryId: number, page: number = 1, limit: number = 9): void {
    if (this.selectedCategoryId === categoryId) {
      this.selectedCategoryId = null;
      this.filteredBooks = this.libros;
    } else {
      this.selectedCategoryId = categoryId;
      this.libroService.getBooksByCategory(categoryId, page, limit).subscribe({
        next: (books) => {
          this.filteredBooks = books;
          this.totalPages = Math.ceil(books.length / limit);
          this.currentPage = page;
        },
        error: (error) => console.error(error)
      });
    }
  }






  showCart = false;
  toggleCart() {
    this.carritoService.toggleCart();
  }
  // loadCart(): void {
  //   this.carritoService.getCartItems().subscribe(cartItems => {
  //     this.cartItems = cartItems; // ✅ Assign the resolved array
  //     this.emptyCart = this.cartItems.length === 0; // ✅ Update emptyCart
  //   });
  // }

  addToCart(libro: Libro) {
    if (!this.isLoggedIn) {
      this.showLoginAlert();
      return;
    }
      this.carritoService.addToCart(libro);

  }



  showLoginAlert() {
    this.showAlert = true;

    // Hide the alert after 3 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  verDetallesLibro(idLibro: number): void {
    this.router.navigate(['/detalle-libro', idLibro]);
  }


}

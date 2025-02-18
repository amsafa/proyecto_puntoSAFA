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

  libros: Libro[] = [];
  filteredBooks: Libro[] = [];
  filter: string = '';
  categories: Categoria[] = [];
  selectedCategoryId: number | null = null;
  currentPage: number = 1;
  totalPages: number = 1; // Placeholder, will be set dynamically
  limit: number = 12;
  cartItems: LibroCarrito[] = [];

  selectedPriceRanges: string[] = [];







  constructor(private libroService: LibroService, private http:HttpClient,
              private router:Router, private route:ActivatedRoute,
              private categoriaService:CategoriaService, private carritoService:CarritoService) {}

  @Input() categoriaId!: number;






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
  }


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

  filterByPrice(range: string, page: number = 1, limit: number = 9): void {
    if (this.selectedPriceRanges.includes(range)) {
      // Si ya está seleccionado, lo quitamos
      this.selectedPriceRanges = this.selectedPriceRanges.filter(p => p !== range);
    } else {
      // Si no está seleccionado, lo agregamos
      this.selectedPriceRanges.push(range);
    }
    this.applyFilters(page, limit);
  }

  filterByCategory(categoryId: number, page: number = 1, limit: number = 9): void {
    // Si la categoría ya está seleccionada, la deseleccionamos
    this.selectedCategoryId = this.selectedCategoryId === categoryId ? null : categoryId;
    this.applyFilters(page, limit);
  }

  applyFilters(page: number = 1, limit: number = 9): void {
    this.libroService.getFilteredBooks(this.selectedPriceRanges, this.selectedCategoryId, page, limit).subscribe({
      next: (books) => {
        this.filteredBooks = books;
        this.totalPages = Math.ceil(books.length / limit);
        this.currentPage = page;
      },
      error: (error) => console.error(error)
    });
  }






  addToCart(libro: Libro) {
    this.carritoService.addToCart(libro);
  }

  increaseQuantity(item: LibroCarrito) {
    this.carritoService.increaseQuantity(item);
  }

  decreaseQuantity(item: LibroCarrito) {
    this.carritoService.decreaseQuantity(item);
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  verDetallesLibro(idLibro: number): void {
    this.router.navigate(['/detalle-libro', idLibro]);
  }


}

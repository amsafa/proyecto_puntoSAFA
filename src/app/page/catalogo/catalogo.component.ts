import {Component, Input, LOCALE_ID, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Libro} from '../../interface/libro';
import {LibroService} from '../../service/libro.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {HttpClientModule} from '@angular/common/http';
import {Categoria} from '../../interface/categoria';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriaService} from '../../service/categoria.service';
import {CarritoService} from '../../service/carrito.service';
import {AuthService} from '../../service/auth.service';




@Component({
  selector: 'app-catalogo',
  templateUrl: '/catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    CurrencyPipe,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class CatalogoComponent  implements OnInit {
  libros: Libro[] = [];
  filteredBooks: Libro[] = [];
  searchTerm: string = '';
  categories: Categoria[] = [];
  selectedCategoryId: number | null = null
  selectedPriceRanges: string[] = [];
  currentPage: number = 1;
  totalPages: number = 1; // Placeholder, will be set dynamically
  limit: number = 12;
  isLoggedIn: boolean = false;
  showAlert: boolean = false;
  noResults: boolean = false;
  filtersApplied: boolean = false;
  totalResults: number = 0;
  priceRanges = [
    { label: 'Menos de 5 euros', value: 'menor5' },
    { label: 'De 5 a 10 euros', value: '5-10' },
    { label: 'De 10 a 15 euros', value: '10-15' },
    { label: 'De 15 a 40 euros', value: '15-40' },
    { label: 'Más de 40 euros', value: 'mayor40' },

  ];


  constructor(private libroService: LibroService,
              private router:Router, private route:ActivatedRoute,
              private categoriaService:CategoriaService, private carritoService:CarritoService, private authService:AuthService) {}

  @Input() categoriaId!: number;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      this.searchTerm = params['search'] || '';
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 1;
      this.limit = params['limit'] ? parseInt(params['limit'], 10) : 8;
      this.selectedCategoryId = params['categoryId'] ? parseInt(params['categoryId'], 10) : null; // Captura el categoryId
      this.cargarLibros(this.currentPage, this.limit);
    });

    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categories = categorias;
    });

    this.authService.getAuthState().subscribe(state => {
      this.isLoggedIn = state;
    });
  }

  // Cargar libros con paginación.
  cargarLibros(page: number = 1, limit: number = 8): void {
    this.currentPage = page;
    this.applyFilters(page, limit);
  }

  // Buscar libros por nombre, autor o categoría.
  searchBooks(): void {
    if (!this.filteredBooks || this.filteredBooks.length === 0) {
      console.warn('No books available for searching.');
      return;
    }
    const searchTerm = this.searchTerm.toLowerCase().trim();
    console.log('Filtered term in catalogue component:', searchTerm);
    if (!searchTerm) {
      this.noResults = false;
      return;
    }
    this.filteredBooks = this.libros.filter(libro => {
      const { nombre, apellidos } = libro.autor || {}; // Ensure autor exists
      return (
        libro.titulo?.toLowerCase().includes(searchTerm) ||
        (apellidos && apellidos.toLowerCase().includes(searchTerm)) ||
        (nombre && nombre.toLowerCase().includes(searchTerm))
      );
    });
    this.noResults = this.filteredBooks.length === 0;
    console.log('Filtered books:', this.filteredBooks);
    console.log('No results:', this.noResults);
  }

  // Limpiar la búsqueda.
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredBooks = this.libros;
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
    location.reload();
  }

  // Limpiar los filtros.
  clearFilters(): void {
    this.selectedCategoryId = null;
    this.selectedPriceRanges = [];
    this.searchTerm = '';
    this.noResults = false;
    this.currentPage = 1;
    this.router.navigate([], {
      queryParams: {},
      queryParamsHandling: 'merge',
    });
    this.cargarLibros();
  }

  // Filtrar por rango de precios.
  filterByPrice(priceRange: string): void {
    console.log("Filtro aplicado:", priceRange);
    this.selectedPriceRanges = [priceRange]; // Limpiar y aplicar el nuevo filtro
    this.applyFilters();
  }

  // Filtrar por categoría.
  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = this.selectedCategoryId === categoryId ? null : categoryId; // Update the selected category
    this.applyFilters();  // Apply filters with the new selection
  }

  // Aplicar los filtros.
  applyFilters(page: number = 1, limit: number = 8): void {
    console.log("Aplicar filtros::");
    console.log("Categorías:", this.selectedCategoryId);
    console.log("Rango de precios:", this.selectedPriceRanges);
    this.filtersApplied = !!(this.selectedCategoryId || this.selectedPriceRanges.length > 0);

    this.libroService.getFilteredBooks(
      this.selectedCategoryId,
      this.selectedPriceRanges,
      page,
      limit
    ).subscribe({
      next: (data) => {
        console.log("Filtered books received:", data);
        this.libros = data;
        this.totalResults = data.length;
        this.totalPages = Math.ceil(this.totalResults / limit);
        const startIdx = (page - 1) * limit;
        const endIdx = startIdx + limit;
        this.filteredBooks = this.libros.slice(startIdx, endIdx);
        this.noResults = this.filteredBooks.length === 0 && this.filtersApplied; // No results only if filters were applied
        // Apply search filtering AFTER pagination
        this.searchBooks();
      },
      error: (error) => console.error(error)
    });
  }

  // Navegar a la página seleccionada
  goToPage(page: number): void {
    this.router.navigate([], {
      queryParams: {
        page,
        limit: this.limit,
        search: this.searchTerm || null,
        price: this.selectedPriceRanges || null,
        category: this.selectedCategoryId || null
      },
      queryParamsHandling: 'merge',
    });
  }

  // Añadir al carrito.
  addToCart(libro: Libro) {
    if (!this.isLoggedIn) {
      this.showLoginAlert();
      return;
    }
    this.carritoService.addToCart(libro);
  }

  // Mostrar alerta de inicio de sesión.
  showLoginAlert() {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  // Navegar a la página de detalles del libro.
  verDetallesLibro(idLibro: number): void {
    this.router.navigate(['/detalle-libro', idLibro]);
  }

}

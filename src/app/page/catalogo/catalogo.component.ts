import {Component, Input, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Libro} from '../../interface/libro';
import {LibroService} from '../../service/libro.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriaService} from '../../service/categoria.service';
import {Categoria} from '../../interface/categoria';
import {CarritoService} from '../../service/carrito.service';






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
  categories: Categoria[] = [];
  filter: string = '';
  currentPage: number = 1;
  totalPages: number = 1; // Placeholder, will be set dynamically
  limit: number = 9;
  selectedCategoryId: number | null = null;
  @Input() categoriaId!: number;

  constructor(private libroService: LibroService,
              private router:Router, private route:ActivatedRoute,
              private categoriaService:CategoriaService) {}



  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['search'] || ''; // Get search parameter from query params
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 1;
      this.limit = params['limit'] ? parseInt(params['limit'], 10) : 9;

      this.cargarLibros(this.currentPage, this.limit);
    });

    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categories = categorias;
    });

  }

  cargarLibros(page: number = 1, limit: number = 9): void {
      this.libroService.getBooks(page, limit).subscribe({
        next:(data) =>{
          console.error("cargarLibros", data);
          this.libros = data;
          this.filteredBooks = [...this.libros];
          this.totalPages = Math.ceil(50 / limit);
        }
      })
  }

  cambiarPagina(pagina:number):void{
    if(pagina >=1 && pagina <= this.totalPages){
      this.router.navigate([], {
        queryParams: {page: pagina, limit: this.limit, search: this.filter || null},
        queryParamsHandling: 'merge'
      })
    }

  }

  // addToCart(libro: Libro) {
  //   this.carritoService.addToCart(libro);
  // }


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
  filterByPrice(range: string, page:number=1, limit:number=9): void{
    if (this.selectedPriceRange === range){
      this.selectedPriceRange = null;
      this.filteredBooks = this.libros;
    }else{
      this.selectedPriceRange = range;
      this.libroService.getLibrosByPrecio(range).subscribe(libros => {
          this.filteredBooks = libros;
        },error => {
          console.error(error);
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
          console.error(error);
        })
    }
  }




  showCart = false;
  toggleCart() {
    this.showCart = !this.showCart;
  }



  // applyFilters(): void {
  //   this.currentPage = 1; // Reset to first page on filter change
  //   this.cargarLibros();
  // }

  verDetallesLibro(idLibro: number): void {
    this.router.navigate(['/detalle-libro', idLibro]);
  }





}

import {ChangeDetectorRef, Component} from '@angular/core';
import {Libro} from '../../interface/libro';
import {Resena} from '../../interface/resena';
import {ActivatedRoute} from '@angular/router';
import {LibroService} from '../../service/libro.service';
import {ResenaService} from '../../service/resena.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-detalle-de-libro',
  imports: [
    CurrencyPipe,
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './detalle-de-libro.component.html',
  styleUrl: './detalle-de-libro.component.css'
})
export class DetalleDeLibroComponent {
  libro?: Libro   // Variable para almacenar los detalles del libro
  quantity: number = 1; // Variable para la cantidad
  resenas: Resena[] = []; // Variable para las reseñas
  media_calificacion: number | null = null; // Variable para la calificación media
  starsArray: number[] = [];
  hasHalfStar: boolean = false;

  constructor(
    private route: ActivatedRoute, // Para obtener el ID de la ruta
    private libroService: LibroService, // Para obtener los detalles del libro
    private resenaService: ResenaService, // Para obtener las reseñas
    private cdr: ChangeDetectorRef // Agregado
  ) {}

  // Método para inicializar el componente
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.obtenerLibro(id);
      this.obtenerResenas(id);
      this.obtenerMediaCalificacion(id);
      console.log('ID del libro:', id);
    }
  }

  // Método para obtener los detalles del libro
  obtenerLibro(id: number): void {
    this.libroService.getLibroById(id).subscribe({
      next: (data) => {
        this.libro = data;
        console.log('Libro obtenido:', this.libro);
      },
      error: (error) => {
        console.error('Error al obtener el libro:', error);
      }
    });
  }


  // Método para obtener las reseñas
  obtenerResenas(id: number): void {
    this.resenaService.obtenerResenasPorLibro(id).subscribe({
      next: (data) => {
        this.resenas = data;
        console.log('Resenas obtenidas:', this.resenas);
        this.cdr.detectChanges(); // Asegurar actualización

      },
      error: (error) => {
        console.error('Error al obtener las reseñas:', error);
        this.resenas = []; // Para que el frontend no muestre las reseñas si hay un error
        this.cdr.detectChanges(); // Asegurar actualización

      }
    });
  }

  //Método para obtener la calificación media
  obtenerMediaCalificacion(id: number): void {
    this.resenaService.obtenerMediaCalificacion(id).subscribe({
      next: (data) => {
        this.media_calificacion = Number(data) || 0;
        this.actualizarEstrellas(); // Llamar al método para actualizar las estrellas
      },
      error: (error) => {
        console.error('Error al obtener la calificación media:', error);
        this.media_calificacion = null;
      }
    });
  }




  // Método para disminuir la cantidad
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      console.log('Cantidad:', this.quantity);
    }
  }

  // Método para aumentar la cantidad
  increaseQuantity(): void {
    this.quantity++;
    console.log('Cantidad:', this.quantity);
  }

  // Método para agregar al carrito
  addToCart(): void {
    if (this.libro) {
      console.log('Libro agregado al carrito:', {
        ...this.libro,
        quantity: this.quantity
      });
    }
  }


  protected readonly isNaN = isNaN;

  actualizarEstrellas(): void {
    if (this.media_calificacion !== null) {
      const rating = this.media_calificacion;
      this.starsArray = Array(Math.floor(rating)).fill(0); // Crear array con el número entero de estrellas
      this.hasHalfStar = rating % 1 >= 0.5; // Determinar si hay media estrella
    }
  }

}

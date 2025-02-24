import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Libro} from '../../interface/libro';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LibroService} from '../../service/libro.service';
import {ActivatedRoute} from '@angular/router';
import {Resena} from '../../interface/resena';
import {ResenaService} from '../../service/resena.service';
import { AuthService } from '../../service/auth.service';
import { CarritoService } from '../../service/carrito.service';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-detalle-de-libro',
  imports: [FormsModule, NgForOf, NgIf, CurrencyPipe],
  standalone: true,
  templateUrl: './detalle-de-libro.component.html',
  styleUrl: './detalle-de-libro.component.css',
})
export class DetalleDeLibroComponent {
  libro?: Libro; // Variable para almacenar los detalles del libro
  quantity: number = 1; // Variable para la cantidad
  resenas: Resena[] = []; // Variable para las reseñas
  media_calificacion: number | null = null; // Variable para la calificación media
  starsArray: number[] = [];
  hasHalfStar: boolean = false;
  usuarioLogueado: boolean = false; // Verifica si el usuario está logueado
  calificacionSeleccionada: number = 0; // Calificación seleccionada por el usuario
  comentario: string = ''; // Comentario de la reseña
  libroId: number; // ID del libro
  mostrarErrorCompra: boolean = false; // Controla si se muestra el mensaje de error
  mostrarNotificacionExito: boolean = false; // Controla si se muestra la notificación de éxito
  mostrarNotificacionError: boolean = false; // Controla si se muestra la notificación de error
  mensajeNotificacion: string = ''; // Mensaje de la notificación


  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService,
    private resenaService: ResenaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef, // Agregado
    private carritoService:CarritoService) {
    this.libroId = Number(this.route.snapshot.paramMap.get('id')); // Obtener el ID del libro desde la ruta
  }


  // Método para inicializar el componente
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.obtenerLibro(id);
      this.obtenerResenas(id);
      this.obtenerMediaCalificacion(id);
      console.log('ID del libro:', id);
    }
    this.usuarioLogueado = this.authService.isLoggedIn();
  }



  /**
   * Obtener las reseñas de un libro.
   */
  obtenerResenas(id: number): void {
    this.resenaService.obtenerResenasPorLibro(id).subscribe({
      next: (data) => {
        console.log('Datos recibidos del servicio:', data);
        if (data && Array.isArray(data)) {
          this.resenas = data;
        } else {
          this.resenas = [];
        }
        console.log('Resenas después de la asignación:', this.resenas);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener las reseñas:', error);
        this.resenas = [];
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Obtener la calificación media de un libro.
   */
  obtenerMediaCalificacion(id: number): void {
    this.resenaService.obtenerMediaCalificacion(id).subscribe({
      next: (data) => {
        console.log('Respuesta del backend:', data); // Verificar la estructura de data
        console.log('Tipo de data:', typeof data); // Verificar el tipo de data

        // Verificar si data es un objeto y tiene la propiedad mediaCalificacion
        if (data && typeof data === 'object' && 'mediaCalificacion' in data) {
          this.media_calificacion = Number(data.mediaCalificacion) || 0;
          console.log('media_calificacion:', this.media_calificacion); // Verificar el valor de media_calificacion
        } else {
          console.error('La respuesta del backend no tiene la estructura esperada:', data);
          this.media_calificacion = 0; // Asignar un valor por defecto
        }

        this.actualizarEstrellas();
      },
      error: (error) => {
        console.error('Error al obtener la calificación media:', error);
        this.media_calificacion = null;
        this.actualizarEstrellas(); // Actualizar estrellas incluso si hay un error
      },
    });
  }

  /**
   * Seleccionar la calificación para una nueva reseña.
   */
  seleccionarCalificacion(calificacion: number): void {
    this.calificacionSeleccionada = calificacion;
  }

  // Método para mostrar una notificación
  mostrarNotificacion(mensaje: string, tipo: 'exito' | 'error'): void {
    this.mensajeNotificacion = mensaje;

    if (tipo === 'exito') {
      this.mostrarNotificacionExito = true;
    } else {
      this.mostrarNotificacionError = true;
    }

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      this.mostrarNotificacionExito = false;
      this.mostrarNotificacionError = false;
    }, 6000);
  }

  /**
   * Enviar una nueva reseña.
   * La verificación de compra se realiza automáticamente en el backend.
   */
  // Método enviarResena
  enviarResena(): void {
    if (this.calificacionSeleccionada > 0 && this.comentario.trim()) {
      const nuevaResena = {
        libro: this.libro?.id,
        calificacion: this.calificacionSeleccionada,
        comentario: this.comentario,
      };

      this.resenaService.enviarResena(nuevaResena).subscribe({
        next: (response) => {
          this.mostrarErrorCompra = false; // Ocultar el mensaje de error
          this.mostrarNotificacion('Reseña enviada con éxito', 'exito'); // Mostrar notificación de éxito
          this.comentario = ''; // Limpiar el campo de comentario
          this.calificacionSeleccionada = 0; // Reiniciar la calificación
          this.obtenerResenas(this.libroId); // Actualizar la lista de reseñas
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al enviar la reseña:', error);
          if (error.status === 403) {
            this.mostrarErrorCompra = true; // Mostrar el mensaje de error
            this.mostrarNotificacion('Para poder valorar este libro, tienes que comprarlo.', 'error'); // Mostrar notificación de error
          } else {
            this.mostrarNotificacion('Error al enviar la reseña', 'error'); // Mostrar notificación de error
          }
          if (error.status === 401) {
            this.mostrarNotificacion('Debes de tener el libro comprado y entregado para poder escribir una reseña.', 'error'); // Mostrar notificación de error
          }

        },
      });
    } else {
      this.mostrarNotificacion('Por favor, selecciona una calificación y escribe un comentario.', 'error'); // Mostrar notificación de error
    }
  }

  /**
   * Obtener los detalles de un libro.
   */
  obtenerLibro(id: number): void {
    this.libroService.getLibroById(id).subscribe({
      next: (data) => {
        this.libro = data;
        console.log('Libro obtenido:', this.libro);
      },
      error: (error) => {
        console.error(error);
      },
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

  /**
   * Agregar un libro al carrito.
   */
  addToCart(): void {
    if (this.libro) {
      console.log('Libro agregado al carrito:', {
        ...this.libro,
        quantity: this.quantity,
      });
    }
    this.carritoService.addToCart(this.libro, this.quantity);

  }




  protected readonly isNaN = isNaN;

  actualizarEstrellas(): void {
    if (this.media_calificacion !== null) {
      const rating = this.media_calificacion;
      this.starsArray = Array(Math.floor(rating)).fill(0); // Llenar el array con estrellas completas
      this.hasHalfStar = rating % 1 >= 0.5; // Verificar si hay media estrella
      console.log('starsArray:', this.starsArray); // Verificar el array de estrellas
      console.log('hasHalfStar:', this.hasHalfStar); // Verificar si hay media estrella
    } else {
      this.starsArray = []; // Limpiar el array si no hay calificación
      this.hasHalfStar = false;
    }
  }
}

import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Libro} from '../../interface/libro';
import {FormsModule} from '@angular/forms';
import {LibroService} from '../../service/libro.service';
import {ActivatedRoute} from '@angular/router';
import {Resena} from '../../interface/resena';
import {ResenaService} from '../../service/resena.service';
import { AuthService } from '../../service/auth.service';
import { CarritoService } from '../../service/carrito.service';
import {HttpErrorResponse} from '@angular/common/http';
import Swal from 'sweetalert2';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';


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
          // Ordenar las reseñas por fecha (la más reciente primero)
          this.resenas = data.sort((a, b) => {
            const fechaA = new Date(a.fecha).getTime(); // Convertir a timestamp
            const fechaB = new Date(b.fecha).getTime(); // Convertir a timestamp
            return fechaB - fechaA; // Orden descendente (más reciente primero)
          });
        } else {
          this.resenas = [];
        }

        console.log('Resenas después de la asignación:', this.resenas);
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener las reseñas:', error);
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

  /**
   * Mostrar una notificación con SweetAlert2.
   * @param mensaje Mensaje a mostrar en la notificación.
   * @param tipo Tipo de notificación: 'exito' o 'error'.
   */
  mostrarNotificacion(mensaje: string, tipo: 'exito' | 'error'): void {
    Swal.fire({
      icon: tipo === 'exito' ? 'success' : 'error',
      title: tipo === 'exito' ? 'Éxito' : 'Error',
      text: mensaje,
      showConfirmButton: false,
      timer: 3000, // Ocultar automáticamente después de 3 segundos
    });
  }

  /**
   * Enviar una nueva reseña.
   * La verificación de compra se realiza automáticamente en el backend.
   */
  enviarResena(): void {
    // Validar que la calificación y el comentario estén completos
    if (this.calificacionSeleccionada > 0 && this.comentario.trim()) {
      const nuevaResena = {
        libro: this.libro?.id,
        calificacion: this.calificacionSeleccionada,
        comentario: this.comentario,
      };

      this.resenaService.enviarResena(nuevaResena).subscribe({
        next: (response) => {
          // Éxito: Ocultar mensajes de error y mostrar notificación de éxito
          this.mostrarErrorCompra = false;
          this.mostrarNotificacion('Reseña enviada con éxito', 'exito');
          this.limpiarFormulario();
          this.obtenerResenas(this.libroId); // Actualizar la lista de reseñas
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error completo:', error);
          console.log('Tipo de error:', typeof error);
          console.log('Propiedades del error:', Object.keys(error));

          // Verificar si el error es una instancia de HttpErrorResponse
          console.log('El error es de tipo HttpErrorResponse');
          console.error('Error al enviar la reseña:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error, // Detalles adicionales del error
          });
          const status = Number(error.status);
          if (status === 403) {
            this.mostrarErrorCompra = true;
            this.mostrarNotificacion('Para poder valorar este libro, tienes que comprarlo.', 'error');
          } else if (status === 401) {
            this.mostrarNotificacion('Debes iniciar sesión para escribir una reseña.', 'error');
          } else if (status === 409) {
            this.mostrarNotificacion('Ya has escrito una reseña para este libro.', 'error');
          } else {
            this.mostrarNotificacion('Error al enviar la reseña. Por favor, inténtalo de nuevo.', 'error');
          }
        },
      });
    } else {
      this.mostrarNotificacion('Por favor, selecciona una calificación y escribe un comentario.', 'error');
    }
  }

  /**
   * Limpiar el formulario después de enviar la reseña.
   */
  limpiarFormulario(): void {
    this.comentario = '';
    this.calificacionSeleccionada = 0;
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

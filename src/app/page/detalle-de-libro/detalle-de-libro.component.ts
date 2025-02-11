import {Component, Input} from '@angular/core';
import {Libro} from '../../interface/libro';
import {CurrencyPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LibroService} from '../../service/libro.service';
import {HttpClientModule} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Categoria} from '../../interface/categoria';
import {Autor} from '../../interface/autor';


@Component({
  selector: 'app-detalle-de-libro',
  imports: [
    CurrencyPipe,
    FormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './detalle-de-libro.component.html',
  styleUrl: './detalle-de-libro.component.css'
})
export class DetalleDeLibroComponent {
  libro?: Libro   // Variable para almacenar los detalles del libro
  quantity: number = 1; // Variable para la cantidad


  constructor(
    private route: ActivatedRoute, // Para obtener el ID de la ruta
    private libroService: LibroService // Para obtener los detalles del libro

  ) {}

  // Método para inicializar el componente
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.obtenerLibro(id);
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
}






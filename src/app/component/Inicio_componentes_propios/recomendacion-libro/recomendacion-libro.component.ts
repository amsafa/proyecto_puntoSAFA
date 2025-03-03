import { Component, OnInit } from '@angular/core';
import { Libro } from '../../../interface/libro';
import { Router } from '@angular/router';
import { ResenaService } from '../../../service/resena.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-recomendacion-libro',
  templateUrl: './recomendacion-libro.component.html',
  styleUrls: ['./recomendacion-libro.component.css'],
  standalone: true,
  imports: [
    NgIf

  ]
})
export class RecomendacionLibroComponent implements OnInit {
  libros: Libro[] = []; // Aquí se almacenarán los tres libros

  constructor(private router: Router, private apiServiceCalificacion: ResenaService) {}

  ngOnInit(): void {
    this.loadTopBooks(); // Cargar los libros al iniciar el componente
    setInterval(() => {
      this.loadTopBooks(); // Actualizar los libros cada 5 minutos
    }, 300000); // 300000 ms = 5 minutes
  }

  private loadTopBooks(): void {
    this.apiServiceCalificacion.obtener3topLibros().subscribe((topBooks: Libro[]) => {
      if (topBooks.length === 3) {
        // Asignar los tres libros directamente
        this.libros = topBooks;
        console.log('Libros recomendados:', this.libros);
      } else {
        console.error('No se obtuvieron 3 libros.');
      }
    });
  }

  // Redirigir a la página de detalles del libro
  verDetallesLibro(idLibro: number | undefined): void {
    this.router.navigate(['/detalle-libro', idLibro]);
  }
}

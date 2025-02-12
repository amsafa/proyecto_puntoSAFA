import {Component, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Libro} from '../../../interface/libro';
import {Router} from '@angular/router';
import {ResenaService} from '../../../service/resena.service';

@Component({
  selector: 'app-recomendacion-libro',
  templateUrl: './recomendacion-libro.component.html',
  styleUrls: ['./recomendacion-libro.component.css'],
  standalone: true,
  imports: [

    NgForOf
  ]
})
export class RecomendacionLibroComponent implements OnInit {
  libros: Libro[] = [];

  constructor(private router: Router, private apiServiceCalificacion: ResenaService) {}

  ngOnInit(): void {
    this.loadRandomBooks();
    setInterval(() => {
      this.loadRandomBooks();
    }, 5000); // 300000 ms = 5 minutes
  }

  private loadRandomBooks(): void {
    this.apiServiceCalificacion.obtener3topLibros().subscribe((topBooks: Libro[]) => {
      if (topBooks.length === 3) {
        // Seleccionar un libro aleatorio de los 3 mejores
        const randomIndex = Math.floor(Math.random() * topBooks.length);
        this.libros = [topBooks[randomIndex]];
        console.log('Libros recomendados:', this.libros);
      } else {
        console.error('No hay suficientes libros para recomendar.');
      }
    });
  }

  verDetallesLibro(idLibro: number): void {
    this.router.navigate(['/detalle-libro', idLibro]);
  }
}





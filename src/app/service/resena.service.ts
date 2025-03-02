import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import {Observable, throwError} from 'rxjs';
import { Resena } from '../interface/resena';
import { environment } from '../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResenaService {
  private apiUrl: string = `${environment.apiUrl}/resena`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las reseñas de un libro.
   */
  obtenerResenasPorLibro(idLibro: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/resenas/${idLibro}`);
  }

  /**
   * Obtener la media de calificación de un libro.
   */
  // En resena.service.ts
  obtenerMediaCalificacion(id: number): Observable<{ mediaCalificacion: number }> {
    return this.http.get<{ mediaCalificacion: number }>(`${this.apiUrl}/media-calificacion/${id}`);
  }
  /**
   * Obtener los 3 libros mejor calificados.
   */
  obtener3topLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/top-libros`);
  }

  /**
   * Enviar una nueva reseña.
   * La verificación de compra se realiza automáticamente en el backend.
   */
  enviarResena(resena: { libro: number | undefined; calificacion: number; comentario: string }): Observable<Resena> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('Token JWT no encontrado.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'

    });

    return this.http.post<Resena>(`${this.apiUrl}/nueva`, resena, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al enviar la reseña:', error);
        // Deja que el error original se propague al componente
        return throwError(() => error);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import {Observable, throwError} from 'rxjs';
import { Resena } from '../interface/resena';
import { environment } from '../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResenaService {
  private baseUrlResena: string = `${environment.apiUrl}/resena`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las reseñas de un libro.
   */
  obtenerResenasPorLibro(idLibro: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.baseUrlResena}/resenas/${idLibro}`);
  }

  /**
   * Obtener la media de calificación de un libro.
   */
  // En resena.service.ts
  obtenerMediaCalificacion(id: number): Observable<{ mediaCalificacion: number }> {
    return this.http.get<{ mediaCalificacion: number }>(`${this.baseUrlResena}/media-calificacion/${id}`);
  }
  /**
   * Obtener los 3 libros mejor calificados.
   */
  obtener3topLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrlResena}/top-libros`);
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
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Resena>(`${this.baseUrlResena}/nueva`, resena, { headers }).pipe(
      catchError((error) => {
        console.error('Error al enviar la reseña:', error);
        return throwError(() => new Error('Error al enviar la reseña.'));
      })
    );
  }
}

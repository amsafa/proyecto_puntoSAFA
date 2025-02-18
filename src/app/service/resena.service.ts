import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import {Observable} from 'rxjs';
import { Resena } from '../interface/resena';
import {environment} from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})

export class ResenaService {
  private baseUrlResena:string =  `${environment.apiUrl}/resena`;

  constructor(private http: HttpClient) { }

  obtenerResenasPorLibro(idLibro: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.baseUrlResena}/resenas/${idLibro}`);
  }

  obtenerMediaCalificacion(idLibro: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrlResena}/media-calificacion/${idLibro}`);

  }

  obtener3topLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrlResena}/top-libros`);
  }
}

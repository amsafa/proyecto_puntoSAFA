import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import { Categoria } from '../interface/categoria'; // Importar la interfaz de categoría
import {Observable} from 'rxjs';
import { Resena } from '../interface/resena';



@Injectable({
  providedIn: 'root'
})

export class ResenaService {
  private baseUrlResena: string = "http://127.0.0.1:8000/resena";

  constructor(private http: HttpClient) { }

  obtenerResenasPorLibro(idLibro: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.baseUrlResena}/${idLibro}`);
  }

  }

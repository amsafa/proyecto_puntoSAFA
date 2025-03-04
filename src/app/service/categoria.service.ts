import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categoria} from '../interface/categoria';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las categorias.
   * @returns Observable<Categoria[]>
   */
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categoria/all`);
  }
}

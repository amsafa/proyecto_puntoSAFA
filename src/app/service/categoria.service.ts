import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categoria} from '../interface/categoria';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
  private baseUrl: string = "api/categoria";

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/all`);
  }
}

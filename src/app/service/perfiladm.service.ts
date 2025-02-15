import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { RegistroCliente } from '../interface/RegistroCliente';
import { environment } from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {adm} from '../interface/adm';

@Injectable({
  providedIn: 'root'
})
export class PerfiladmService {
  private apiUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  getAllUsuario(): Observable<adm[]> {
    return this.http.get<adm[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}${id}`);
  }


  editarUsuario(id: number, usuario: adm): Observable<adm> {
    return this.http.put<adm>(`${this.apiUrl}/editar/${id}`, usuario);
  }

  crearUsuario(usuario: adm): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerUsuarioAutenticado(): Observable<adm | null> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<adm>(`${this.apiUrl}/api/cliente/auth/user`, { headers }).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }

}

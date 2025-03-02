import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { RegistroCliente } from '../interface/RegistroCliente';
import { environment } from '../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllClientes(): Observable<RegistroCliente[]> {
    return this.http.get<RegistroCliente[]>(`${this.apiUrl}/api/cliente/all`);
  }

  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/cliente/${id}`);

  }


  editarCliente(id: number, cliente: RegistroCliente): Observable<RegistroCliente> {
    return this.http.put<RegistroCliente>(`${this.apiUrl}/api/cliente/editar/${id}`, cliente);
  }

  crearCliente(cliente: RegistroCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/cliente/guardar`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/cliente/eliminar/${id}`);
  }


  obtenerUsuarioAutenticado(): Observable<RegistroCliente | null> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<RegistroCliente>(`${this.apiUrl}/api/cliente/auth/user`, { headers }).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }
}

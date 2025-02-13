import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroCliente } from '../interface/RegistroCliente';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = `${environment.apiUrl}/cliente`;

  constructor(private http: HttpClient) {}

  getAllClientes(): Observable<RegistroCliente[]> {
    return this.http.get<RegistroCliente[]>(`${this.apiUrl}/all`);
  }

  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}${id}`);
  }


  editarCliente(id: number, cliente: RegistroCliente): Observable<RegistroCliente> {
    return this.http.put<RegistroCliente>(`${this.apiUrl}/editar/${id}`, cliente);
  }

  crearCliente(cliente: RegistroCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerUsuarioAutenticado(): Observable<RegistroCliente | null> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<RegistroCliente>(`${this.apiUrl}/api/cliente/auth/user`, { headers }).pipe(
      catchError(error => {
        console.error('Error obteniendo usuario autenticado:', error);
        return of(null);
      })
    );
  }

}

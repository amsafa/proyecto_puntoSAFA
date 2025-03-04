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

  /**
   * Obtiene todos los clientes
   * @returns Observable<RegistroCliente[]>
   */
  getAllClientes(): Observable<RegistroCliente[]> {
    return this.http.get<RegistroCliente[]>(`${this.apiUrl}/api/cliente/all`);
  }

  /**
   * Obtiene un cliente por su id
   * @param id id del cliente
   * @returns Observable<any>
   */
  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/cliente/${id}`);

  }

  /**
   * Edita un cliente
   * @param id
   * @param cliente
   */
  editarCliente(id: number, cliente: RegistroCliente): Observable<RegistroCliente> {
    return this.http.put<RegistroCliente>(`${this.apiUrl}/api/cliente/editar/${id}`, cliente);
  }

  /**
   * Crea un cliente
   * @param cliente
   */

  crearCliente(cliente: RegistroCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/cliente/guardar`, cliente);
  }

  /**
   * Elimina un cliente
   * @param id
   */

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/cliente/eliminar/${id}`);
  }

  /**
   * Obtiene el usuario autenticado
   * @returns Observable<RegistroCliente | null>
   */

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

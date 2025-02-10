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

  getClienteById(id: number): Observable<RegistroCliente> {
    return this.http.get<RegistroCliente>(`${this.apiUrl}/${id}`);
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
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { RegistroCliente } from '../interface/RegistroCliente';
import { environment } from '../../environments/environment';
import {catchError} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    private apiUrl = environment.apiUrl + '/cliente'; // 🔥 Asegura que todas las rutas usen `/cliente`


    constructor(private http: HttpClient) { }


    // Método para obtener todos los perfiles
    getAllClientes(): Observable<RegistroCliente[]> {
        return this.http.get<RegistroCliente[]>(`${this.apiUrl}/all`);
    }


    // Método para obtener un perfil por ID
    getClienteById(id: number): Observable<RegistroCliente> {
        return this.http.get<RegistroCliente>(`${this.apiUrl}/${id}`);
    }


    // Método para actualizar un perfil
    editarCliente(id: number, cliente: RegistroCliente): Observable<RegistroCliente> {
        return this.http.put<RegistroCliente>(`${this.apiUrl}/editar/${id}`, cliente);
    }


    // Método para crear un perfil
    crearCliente(cliente: RegistroCliente): Observable<any> {
        return this.http.post(`${this.apiUrl}/guardar`, cliente);
    }


    // Método para eliminar un perfil por ID
    eliminarCliente(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }


    // src/app/service/perfil.service.ts
    obtenerUsuarioAutenticado(): Observable<RegistroCliente | null> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);


        return this.http.get<RegistroCliente>(`${this.apiUrl}/auth/user`, { headers }).pipe(
            catchError(error => {
                console.error('Error obteniendo usuario autenticado:', error);
                return of(null);
            })
        );
    }


}

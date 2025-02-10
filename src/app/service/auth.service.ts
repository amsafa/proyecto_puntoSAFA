import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../interface/RegistroCliente';
import { Login } from '../interface/Login';
import { ActualizarService } from './actualizar.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  private userData = new BehaviorSubject<RegistroCliente | null>(null);
  private apiUrl = 'http://127.0.0.1:8000/api';


  constructor(
    private http: HttpClient,
    private router: Router,
    private actualizar: ActualizarService
  ) {}


  // Iniciar sesión
  login(credentials: Login): Observable<any> {
    localStorage.removeItem('token');
    return this.http.post<{ token: string }>(`${this.apiUrl}/login_check`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.authState.next(true);
        this.fetchUserData(); // Cargar datos del usuario autenticado
      }),
      catchError(this.handleError)
    );
  }


  // Obtener datos del usuario autenticado
  fetchUserData(): void {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<RegistroCliente>(`${this.apiUrl}/cliente/all`, { headers }).subscribe({
        next: user => {
          console.log('Datos recibidos:', user);  // 👈 Verifica si se imprimen datos en la consola
          this.userData.next(user);
        },
        error: err => {
          console.error('Error obteniendo datos:', err);
          this.userData.next(null);
        }
      });
    }
  }




  // Obtener datos del usuario autenticado como Observable
  getUserData(): Observable<RegistroCliente | null> {
    return this.userData.asObservable();
  }


  // Obtener el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  // Registrar un nuevo usuario
  registro(userData: RegistroCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, userData).pipe(catchError(this.handleError));
  }


  // Cerrar sesión
  logout(): void {
    localStorage.clear();
    this.authState.next(false);
    this.router.navigate(['login']).then(() => {
      Swal.fire({
        title: 'Sesión cerrada correctamente',
        text: 'Se ha cerrado sesión correctamente. Nos vemos pronto.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => this.actualizar.triggerRefreshHeader());
    });
  }


  // Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  // Obtener el estado de autenticación como Observable
  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }


  // Manejo de errores en peticiones HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos para acceder a esta información.';
    }
    Swal.fire('Error', errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }
}

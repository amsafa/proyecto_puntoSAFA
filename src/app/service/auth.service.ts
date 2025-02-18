import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../interface/RegistroCliente';
import { Login } from '../interface/Login';
import { ActualizarService } from './actualizar.service';

@Injectable({
  providedIn: 'root',
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
  // Iniciar sesión
  login(credentials: Login): void {
    localStorage.removeItem('token'); // Limpiar token anterior

    console.log("Credenciales enviadas:", credentials); // Depuración

    this.http
      .post<{ token: string }>(`${this.apiUrl}/login_check`, {
        username: credentials.username, // Envía el username
        password: credentials.password  // Envía el password
      }, { withCredentials: true })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token); // Guardar el token
          this.authState.next(true); // Actualizar el estado de autenticación
        }),
        switchMap(() => this.fetchUserData()), // Obtener datos del usuario
        catchError((error) => {
          console.error("Respuesta del servidor:", error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (user) => {
          console.log("Datos de usuario obtenidos:", user); // Depuración

          if (user && user.usuario) {
            localStorage.setItem('userData', JSON.stringify(user)); // Guardar datos del usuario

            // Redirigir según el rol
            if (user.usuario.rol === 'admin') {
              this.router.navigate(['/perfil-adm']);
            } else if (user.usuario.rol === 'cliente') {
              this.router.navigate(['/home']);
            }
          }
        },
        error: (error) => {
          console.error("Error en login:", error);
          this.handleError(error); // Manejar el error
        },
      });
  }

  // Obtener datos del usuario autenticado
  fetchUserData(): Observable<RegistroCliente | null> {
    const token = this.getToken();
    if (!token) return throwError(() => new Error('No token available'));

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<RegistroCliente>(`${this.apiUrl}/cliente/auth/user`, { headers }).pipe(
      tap((userData) => this.userData.next(userData)), // Actualizar BehaviorSubject
      catchError((err) => {
        console.error('Error al obtener datos del usuario:', err);
        this.userData.next(null); // Limpiar datos del usuario
        return throwError(() => err);
      })
    );
  }

  // Obtener datos del usuario como Observable
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
        confirmButtonText: 'OK',
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

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.error.message || 'Error desconocido'}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}

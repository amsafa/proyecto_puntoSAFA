import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../interface/RegistroCliente';
import { Login } from '../interface/Login';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  private userData = new BehaviorSubject<RegistroCliente | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: Login): Observable<any> {
    localStorage.removeItem('token');
    return this.http.post<{ token: string }>(`${this.apiUrl}/login_check`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.authState.next(true);
        this.fetchUserData();
      }),
      catchError(this.handleError)
    );
  }

  fetchUserData(): void {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<RegistroCliente>(`${this.apiUrl}/cliente/auth/user`, { headers }).subscribe({
        next: user => {
          console.log('Usuario autenticado:', user);
          this.userData.next(user);
        },
        error: err => {
          console.error('Error obteniendo usuario:', err);
          this.userData.next(null);
        }
      });
    }
  }

  getUserData(): Observable<RegistroCliente | null> {
    return this.userData.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
    this.authState.next(false);
    this.router.navigate(['login']).then(() => {
      Swal.fire('Sesión cerrada', 'Se ha cerrado sesión correctamente.', 'success');
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales incorrectas.';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos.';
    }
    Swal.fire('Error', errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }
}

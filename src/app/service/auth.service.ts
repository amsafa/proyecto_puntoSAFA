import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../interface/RegistroCliente';
import { Login } from '../interface/Login';
import { ActualizarService } from './actualizar.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  private userData = new BehaviorSubject<RegistroCliente | null>(null);
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private actualizar: ActualizarService
  ) {}

  async login(credentials: Login): Promise<void> {
    sessionStorage.removeItem('token'); // Clear previous token
    try {
      const response = await lastValueFrom(
        this.http.post<{ token: string }>(`${this.apiUrl}/login_check`, credentials)
      );
      if (!response.token) throw new Error("Token not received");

      sessionStorage.setItem('token', response.token);
      this.authState.next(true);

      const user = await this.fetchUserData();
      if (user?.usuario?.rol) {
        sessionStorage.setItem('userData', JSON.stringify(user));
        this.redirectBasedOnRole(user.usuario.rol);
      } else {
        await this.router.navigate(['/login']);
      }
    } catch (error: any) {
      this.handleLoginError(error);
    }
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/perfil-adm']);
        break;
      case 'cliente':
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  private handleLoginError(error: any): void {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      Swal.fire("Error", "Invalid username or password.", "error");
    } else {
      Swal.fire("Error", "Login failed. Please try again later.", "error");
    }
    sessionStorage.removeItem('token');
    this.authState.next(false);
  }

  fetchUserData(): Promise<RegistroCliente | null> {
    const token = this.getToken();
    if (!token) {
      console.error("No se encontró un token de autenticación.");
      return Promise.resolve(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return lastValueFrom(
      this.http.get<RegistroCliente>(`/api/api/cliente/auth/user`, { headers })
    ).then(userData => {
      this.userData.next(userData);
      return userData;
    }).catch(err => {
      this.handleUserDataError(err);
      return null;
    });
  }

  private handleUserDataError(err: any): void {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        console.error(`HTTP Error ${err.status}: ${err.message}`);
      }
    } else {
      console.error("Unexpected error:", err);
    }
    this.userData.next(null);
  }

  getUserData(): Observable<RegistroCliente | null> {
    return this.userData.asObservable();
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  registro(userData: RegistroCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, userData).pipe(catchError(this.handleError));
  }

  logout(): void {
    sessionStorage.clear();
    this.authState.next(false);
    this.router.navigate(['login']).then(() => this.actualizar.triggerRefreshHeader());
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales inválidas. Por favor, intente de nuevo.';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permiso para realizar esta acción.';
    }
    Swal.fire('Error', errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }

  actualizarUsuario(usuarioEditado: RegistroCliente): Observable<any> {
    // Implement the logic to update user data
    return this.http.put(`${this.apiUrl}/usuario`, usuarioEditado).pipe(catchError(this.handleError));
  }
}

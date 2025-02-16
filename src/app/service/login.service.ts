import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Login } from '../interface/Login';
import { RegistroCliente } from '../interface/RegistroCliente';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginForm: FormGroup;
  errorMessage = '';
  login: Login = new Login();  // Se inicializa el objeto Login

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {}

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      this.login = { ...this.login, ...this.loginForm.value };

      try {
        await this.authService.login(this.login);
        console.log("Login exitoso"); // ✅ Depuración
      } catch (error) {
        this.errorMessage = 'Error en el inicio de sesión. Verifica tus credenciales.';
      }
    } else {
      this.errorMessage = 'Formulario inválido. Verifica los datos.';
    }
  }

}

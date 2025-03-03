import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Login } from '../../interface/Login';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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

  // Método asíncrono para iniciar sesión
  async onLogin(): Promise<void> {
    if (this.loginForm.valid || true) {
      this.login = { ...this.login, ...this.loginForm.value };

    //  console.log("Iniciando sesión con:", this.login); // ✅ Depuración
      this.authService.login(this.login);
      try {

      } catch (error) {
        this.errorMessage = 'Error en el inicio de sesión. Verifica tus credenciales.';
      }
    } else {
      this.errorMessage = 'Formulario inválido. Verifica los datos.';
    }
  }


}

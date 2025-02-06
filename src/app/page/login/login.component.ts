import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../component/footer/footer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Login } from '../../interface/Login';
import {HeaderComponent} from '../../component/header/header.component';

@Component({
  selector: 'app-login',
  imports: [
    HeaderComponent,
    FooterComponent,
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

  onLogin(): void {
    if (this.loginForm.valid) {
      this.login = { ...this.login, ...this.loginForm.value };
      this.authService.login(this.login).subscribe({
        next: (respuesta) => {
          const token = respuesta.token;
          sessionStorage.setItem("authToken", token);
          this.authService.getToken();
          this.router.navigate(['/home']);
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = 'Error en el inicio de sesión. Verifica tus credenciales.';
        }
      });
    } else {
      this.errorMessage = 'Formulario inválido. Verifica los datos.';
    }
  }
}

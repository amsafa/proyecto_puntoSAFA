import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {CommonModule} from '@angular/common';
import {AuthService} from '../../service/auth.service';
import {RegistroCliente} from '../../interface/RegistroCliente';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-registro',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  errorMessage = '';
  registroCliente: RegistroCliente = new RegistroCliente();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // ✅ Capturar parámetros de la URL
  ) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+(com|es)$')]],
      nick: ['', [Validators.required, Validators.minLength(4)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZÀ-ÿ ]+$')]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZÀ-ÿ ]+$')]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}[A-Z]$')]],
      foto: ['', [Validators.required, Validators.pattern('^(https?:\\/\\/)?([\\w.-]+)\\.([a-z]{2,6}\\.?)(\\/.*)?$')]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[67][0-9]{8}$')]],
      contrasena: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$')]],
      repetircontrasena: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    console.log(this.registroForm);
  }


  passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const contrasena = formGroup.get('contrasena')?.value;
    const repetircontrasena = formGroup.get('repetircontrasena')?.value;
    return contrasena === repetircontrasena ? null : { passwordMismatch: true };
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.confirmarVerificacion(token).subscribe({
          next: () => {
            Swal.fire('¡Cuenta verificada!', 'Tu cuenta ha sido activada. Ahora puedes iniciar sesión.', 'success');
            this.router.navigate(['/login']);
          },
          error: () => {
            Swal.fire('Error', 'El enlace de verificación no es válido o ha expirado.', 'error');
          }
        });
      }
    });
  }




  onRegister() {
    if (this.registroForm.valid) {
      this.rellenarDatos();
      this.authService.registro(this.registroCliente).subscribe({
        next: () => {
          this.authService.verificarEmail(this.registroCliente.email).subscribe({
            next: () => {
              Swal.fire({
                title: '¡Registro Exitoso!',
                text: 'Te hemos enviado un correo para verificar tu cuenta. Por favor revisa tu bandeja de entrada.',
                icon: 'success',
                confirmButtonColor: '#009688',
                confirmButtonText: 'Aceptar'
              });
            },
            error: () => {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo enviar el correo de verificación.',
                icon: 'error'
              });
            }
          });
        },
        error: () => {
          this.errorMessage = 'Error en el registro. Intenta nuevamente.';
        }
      });
    } else {
      this.errorMessage = 'Verifica los datos ingresados.';
    }
  }



  // Función para rellenar el objeto con los datos del formulario
  rellenarDatos() {
    this.registroCliente.email = this.registroForm.get('email')?.value;
    this.registroCliente.nick = this.registroForm.get('nick')?.value;
    this.registroCliente.contrasena = this.registroForm.get('contrasena')?.value;
    this.registroCliente.dni = this.registroForm.get('dni')?.value;
    this.registroCliente.nombre = this.registroForm.get('nombre')?.value;
    this.registroCliente.apellidos = this.registroForm.get('apellidos')?.value;
    this.registroCliente.foto = this.registroForm.get('foto')?.value;
    this.registroCliente.direccion = this.registroForm.get('direccion')?.value;
    this.registroCliente.telefono = this.registroForm.get('telefono')?.value;
  }

  // Alerta de éxito usando SweetAlert2
  selectedFileName: string | undefined
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name; // Guardamos el nombre del archivo
    }
  }

  mostrarAlertaExito() {
    Swal.fire({
      title: '¡Registro Exitoso!',
      text: 'Tu cuenta ha sido creada correctamente.',
      icon: 'success',
      confirmButtonColor: '#009688',
      confirmButtonText: 'Ir al Login',
      timer: 3000,
      timerProgressBar: true
    }).then(() => {
      this.registroForm.reset();  // Limpia el formulario
      this.selectedFileName = ''; // Limpia el nombre del archivo seleccionado
    });
  }

}

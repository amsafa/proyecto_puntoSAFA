import {Component, OnInit} from '@angular/core';

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
import {Router, RouterLink} from '@angular/router';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-registro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  errorMessage = '';
  registroCliente: RegistroCliente = new RegistroCliente();

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registroForm = this.fb.group({
      nick: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}[A-Za-z]$')]],
      foto: ['', [Validators.required, Validators.pattern('https?://.+')]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      repetircontrasena: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup; // Hace casting a FormGroup
    const contrasena = formGroup.get('contrasena')?.value;
    const repetircontrasena = formGroup.get('repetircontrasena')?.value;
    return contrasena === repetircontrasena ? null : { passwordMismatch: true };
  };


  onRegister() {
    if (this.registroForm.valid) {
      this.rellenarDatos();
      console.log('Datos enviados:', this.registroCliente); // Depuración: Imprime el payload
      localStorage.removeItem('token');
      this.authService.registro(this.registroCliente).subscribe({
        next: () => {
          this.mostrarAlertaExito();  // Muestra alerta de éxito
          this.errorMessage = '';     // Limpia errores anteriores
        },
        error: (error) => {
          this.errorMessage = 'Error en el registro. Intenta nuevamente.';
          console.error('Error en el registro:', error); // Depuración: Imprime el error
        },
        complete: () => {
          if (!this.errorMessage) {
            console.log('Registro completado'); // Depuración: Mensaje de éxito
          }
        }
      });
    } else {
      this.errorMessage = 'Verifica los datos ingresados.';
      console.log('Verifica los datos ingresados'); // Depuración: Formulario inválido
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

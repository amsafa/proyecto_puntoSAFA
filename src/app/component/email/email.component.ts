import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmailService } from '../../service/emailService';
import { UsuarioService } from '../../service/usuario.service';
import { UsuarioResponse } from '../../models/usuario-response.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  FormContacto: FormGroup;
  selectedFileName: string | undefined;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private emailService: EmailService
  ) {
    this.FormContacto = this.fb.group({
      nombre: [''],
      correo: [''],
      mensaje: ['']
    });
  }

  ngOnInit(): void {
    this.detectarNombre();
  }

  detectarNombre() {
    this.FormContacto.get('nombre')?.valueChanges.subscribe(nombre => {
      if (nombre) {
        this.buscarCorreo(nombre);
      } else {
        this.FormContacto.patchValue({ correo: '' });
      }
    });
  }

  buscarCorreo(nombre: string) {
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      console.warn("Nombre vacío, no se realiza la petición");
      this.FormContacto.patchValue({ correo: '' });
      return;
    }

    this.usuarioService.obtenerCorreoPorNick(nombreLimpio).subscribe({
      next: (data: UsuarioResponse) => {
        this.FormContacto.patchValue({ correo: data.email ?? '' });
      },
      error: (error: any) => {
        console.error('Usuario no encontrado', error);
        this.FormContacto.patchValue({ correo: '' });
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name; // Guardamos el nombre del archivo
    }
  }

  EnviarEmail() {
    if (this.FormContacto.valid) {
      console.log("Enviando datos:", this.FormContacto.value);

      const formData = {
        nombre: this.FormContacto.get('nombre')?.value,
        correo: this.FormContacto.get('correo')?.value,
        mensaje: this.FormContacto.get('mensaje')?.value
      };

      this.emailService.enviarCorreo(formData).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Mensaje enviado!',
            text: 'Tu correo ha sido enviado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          this.FormContacto.reset(); // Limpiar el formulario
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al enviar el correo. Inténtalo nuevamente.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos antes de enviar.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
}

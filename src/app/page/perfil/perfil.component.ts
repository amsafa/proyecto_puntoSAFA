import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../../interface/RegistroCliente';
import { PerfilService } from '../../service/perfil.service';
import { NgIf } from '@angular/common';
import {AuthService} from '../../service/auth.service';
import {distinctUntilChanged, filter, switchMap} from 'rxjs';




@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  imports: [NgIf, ReactiveFormsModule, FormsModule],
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  cliente: RegistroCliente | null = null;
  errorMessage: string = '';
  clienteId: number | null | undefined = null;
  userData: any | string;
  isLoggedIn = false;
  usuario: RegistroCliente | null = null;
  mostrandoFormulario: any;
  usuarioEditado: any;
  successMessage: string | null = null;



  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,

  ) {
    this.perfilForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nick: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      foto: [''],
      direccion: [''],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
    });
  }


  ngOnInit(): void {
    this.authService.getAuthState().pipe(
      filter(authState => authState), // Asegurar que está autenticado
      switchMap(() => this.authService.getUserData()), // Obtener datos del usuariodistinctUntilChanged() // Evitar que emita datos repetidos
      distinctUntilChanged() // Evitar que emita datos repetidos
    ).subscribe(userData => {
      if (userData) {
        console.log('Datos únicos obtenidos:', userData);
        this.userData = userData;
        this.isLoggedIn = true;
        this.cargarCliente(this.userData.id);
      }
    });
  }


  cargarCliente(id: number): void {
    // Llama al servicio para obtener los datos del cliente
    this.perfilService.getClienteById(id).subscribe({
      next: (data) => {
        this.cliente = data; // Asigna los datos del cliente
        this.perfilForm.patchValue(data); // Carga los datos en el formulario

        // Deshabilitar los campos que no se desean editar
        this.perfilForm.get('email')?.disable();
        this.perfilForm.get('nick')?.disable();
        this.perfilForm.get('nombre')?.disable();
        this.perfilForm.get('apellidos')?.disable();
        this.perfilForm.get('dni')?.disable();

        //Hay que habilitar los campos que se desean editar
        this.perfilForm.get('telefono')?.enable();
        this.perfilForm.get('direccion')?.enable();
        this.perfilForm.get('foto')?.enable();
      },
      error: () => {
        this.errorMessage = 'Error al cargar los datos del perfil.';
      }
    });
  }


  guardarCambios(): void {
    console.log('Método guardarCambios ejecutado');

    if (!this.userData?.id) {
      console.error("❌ No se encontró el ID del usuario.");
      return;
    }

    const usuarioActualizado = this.perfilForm.value;
    console.log('Datos del formulario:', usuarioActualizado);

    this.perfilService.editarCliente(this.userData.id, usuarioActualizado).subscribe(

      (respuesta) => {
        console.log("Respuesta del backend:", respuesta);
        console.log("Datos recibidos después de actualizar:", respuesta);
        Swal.fire('Éxito', 'Los datos del perfil se han actualizado correctamente', 'success');

        // Recargar los datos del usuario actualizado
        this.cargarCliente(this.userData.id);
      },
      (error) => {
        console.error("❌ Error en la actualización:", error);
        Swal.fire('Error', 'Hubo un problema al actualizar el perfil', 'error');
      }
    );
  }



  eliminarCliente(): void {
    if (this.clienteId) {
      this.perfilService.eliminarCliente(this.clienteId).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Perfil Eliminado!',
            text: 'El perfil se ha eliminado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/clientes']);
          });
        },
        error: () => {
          this.errorMessage = 'Error al eliminar el perfil.';
        }
      });
    }
  }


  // Método para abrir el formulario
  abrirFormulario(): void {
    if (this.userData) {
      // Clonar los datos del usuario sin modificar el original
      this.usuarioEditado = { ...this.userData, contrasena: '' }; // Dejar la contraseña vacía
      this.mostrandoFormulario = true;
    }
  }

  // Método para cerrar el formulario
  mostrandoEdicionContrasena: any;
  cerrarFormulario(): void {
    this.mostrandoFormulario = false;
  }


  abrirEdicionUsuario(): void {
    if (this.cliente) {
      this.usuarioEditado = { ...this.cliente }; // Clonar el usuario actual para edición
      this.mostrandoEdicionContrasena = true;
    }
  }


  guardarEdicionContrasena() {

  }

  cerrarEdicionUsuario(): void {
    this.mostrandoEdicionContrasena = false;
  }

}

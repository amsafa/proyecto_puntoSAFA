import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../../interface/RegistroCliente';
import { PerfilService } from '../../service/perfil.service';
import { NgIf } from '@angular/common';
import {AuthService} from '../../service/auth.service';
import {distinctUntilChanged, filter, switchMap} from 'rxjs';
import { UsuarioService } from '../../service/usuario.service';






@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  imports: [NgIf, ReactiveFormsModule, FormsModule, FormsModule],
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
    private miServicioUsuario: UsuarioService

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
    ).subscribe(userData => {
      if (userData) {
        console.log('Datos únicos obtenidos:', userData);
        this.userData = userData;
        this.isLoggedIn = true;
      }
    });
  }


  cargarCliente(id: number): void {
    // Llama al servicio para obtener los datos del cliente
    this.perfilService.getClienteById(id).subscribe({
      next: (data) => {
        this.cliente = data; // Asigna los datos del cliente
        this.perfilForm.patchValue(data); // Carga los datos en el formulario
      },
      error: () => {
        this.errorMessage = 'Error al cargar los datos del perfil.';
      }
    });
  }

  cargarUsuarioAutenticado(): void {
    this.perfilService.obtenerUsuarioAutenticado().subscribe({
      next: (data) => {
        console.log('Datos obtenidos:', data); // Verifica los datos en la consola

        if (Array.isArray(data)) {
          console.error();
        }
        this.cliente = data;
        this.userData = data;
        this.clienteId = data?.id;
        // @ts-ignore
        this.perfilForm.patchValue(data);
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los datos del usuario autenticado.';
      }
    });
  }

  guardarCambios() {
    if (!this.userData?.id) {
      console.error("❌ No se encontró el ID del usuario.");
      return;
    }

    this.miServicioUsuario.actualizarUsuario(this.userData.id, this.userData).subscribe(
      (respuesta) => {
        console.log("✅ Usuario actualizado correctamente:", respuesta);
        this.mostrandoFormulario = false; // Cerrar modal
      },
      (error) => {
        console.error("❌ Error en la actualización:", error);
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


  abrirFormulario(): void {
    if (this.userData) {
      // Clonar los datos del usuario sin modificar el original
      this.usuarioEditado = { ...this.userData, contrasena: '' }; // Dejar la contraseña vacía
      this.mostrandoFormulario = true;
    }
  }

  cerrarFormulario(): void {
    this.mostrandoFormulario = false;
  }


}

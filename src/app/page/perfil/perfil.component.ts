import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../../interface/RegistroCliente';
import { PerfilService } from '../../service/perfil.service';
import { AuthService } from '../../service/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
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
    private authService: AuthService
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
    // Suscribirse al estado de autenticación
    this.authService.getAuthState().subscribe((state) => {
      this.isLoggedIn = state;
      if (this.isLoggedIn) {
        this.authService.fetchUserData(); // 🔹 Obtener los datos si ya está logueado
      }
    });

    // Suscribirse a los datos del usuario
    this.authService.getUserData().subscribe(user => {
      this.userData = user; // 🔹 Guardar los datos del usuario
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
      next: (data: RegistroCliente | null) => {
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
      error: () => {
        this.errorMessage = 'Error al cargar los datos del usuario autenticado.';
      }
    });
  }




  guardarCambios(): void {
    let successMessage;
    let errorMessage;
    if (this.perfilForm.valid && this.clienteId) {
      const clienteActualizado: RegistroCliente = {
        ...this.perfilForm.value,
        id: this.clienteId
      };



      this.perfilService.editarCliente(this.clienteId, clienteActualizado).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Perfil Actualizado!',
            text: 'Los datos del perfil se han actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.successMessage = '¡Datos actualizados correctamente!';
        },
        error: () => {
          this.errorMessage = 'Error al guardar los cambios.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, verifica los datos ingresados.';
    }
  }


  crearCliente(): void {
    if (this.perfilForm.valid) {
      this.perfilService.crearCliente(this.perfilForm.value).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Cliente Creado!',
            text: 'El perfil se ha creado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/clientes']);
          });
        },
        error: () => {
          this.errorMessage = 'Error al crear el perfil.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, verifica los datos ingresados.';
    }
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

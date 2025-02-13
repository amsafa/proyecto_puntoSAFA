import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {RegistroCliente} from '../../interface/RegistroCliente';
import {PerfilService} from '../../service/perfil.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import Swal from 'sweetalert2';
import {adm} from '../../interface/adm';

@Component({
  selector: 'app-perfil-adm',
    imports: [
        FormsModule,
        NgIf
    ],
  templateUrl: './perfil-adm.component.html',
  styleUrl: './perfil-adm.component.css'
})
export class PerfilAdmComponent {
  perfilForm: FormGroup;
  admin: adm | null = null;
  errorMessage: string = '';
  admId: number | null | undefined = null;
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
    // Llama al servicio para obtener los datos
    this.perfilService.getClienteById(id).subscribe({
      next: (data) => {
        this.admin = data; // Asigna los datos
        this.perfilForm.patchValue(data); // Carga los datos en el formulario
      },
      error: (err) => {
        console.error("Error al cargar perfil:", err);
        this.errorMessage = 'No se pudo cargar el perfil. Intente nuevamente.';
      }
    });
  }
  cargarUsuarioAutenticado(): void {
    this.perfilService.obtenerUsuarioAutenticado().subscribe({
      next: (data) => {
        console.log('Datos obtenidos:', data); // Verifica los datos en la consola

        if (Array.isArray(data)) {
          console.error('⚠️ Error: Se recibió un array en lugar de un objeto.');
        }
        this.admin = data;
        this.userData = data;
        this.admId = data?.id;
        // @ts-ignore
        this.perfilForm.patchValue(data);
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los datos del usuario autenticado.';
      }
    });
  }




  guardarCambios(): void {
    let successMessage;
    let errorMessage;
    if (this.perfilForm.valid && this.admId) {
      const clienteActualizado: RegistroCliente = {
        ...this.perfilForm.value,
        id: this.admId
      };



      this.perfilService.editarCliente(this.admId, clienteActualizado).subscribe({
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
    if (this.admId) {
      this.perfilService.eliminarCliente(this.admId).subscribe({
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

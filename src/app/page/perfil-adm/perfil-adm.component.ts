import {Component, LOCALE_ID, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import { adm } from '../../interface/adm';
import {RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import {Pedido} from '../../interface/pedido';
import {PedidoService} from '../../service/pedido.service';
import {Cliente} from '../../interface/cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-adm',
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    NgForOf,
    DatePipe,
    NgClass
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './perfil-adm.component.html',
  styleUrls: ['./perfil-adm.component.css']
})
export class PerfilAdmComponent implements OnInit {
  perfilForm: FormGroup;
  admin: adm | null = null;
  errorMessage: string = '';
  admId: number | null | undefined = null;
  userData: any;
  isLoggedIn = false;
  mostrandoFormulario: boolean = false;
  usuarioEditado: any;
  successMessage: string | null = null;
  pedidos:Pedido[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private pedidoservice: PedidoService,
  ) {
    this.perfilForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nick: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    // Recuperar el estado del formulario si se guardó previamente
    const storedFormState = localStorage.getItem('mostrandoFormulario');
    if (storedFormState) {
      this.mostrandoFormulario = JSON.parse(storedFormState);
    }

    // Suscribirse al estado de autenticación y obtener datos del usuario
    this.authService.getAuthState().subscribe((state) => {
      this.isLoggedIn = state;
      if (this.isLoggedIn) {
        this.authService.fetchUserData();
      }
    });

    this.authService.getUserData().subscribe(user => {
      this.userData = user;
    });

    this.loadPedidos();

  }





  // Abrir el formulario de edición
  abrirFormulario(): void {
    if (this.userData) {
      this.usuarioEditado = { ...this.userData, contrasena: '' }; // Copiar datos y añadir campo de contraseña
      this.mostrandoFormulario = true;
      localStorage.setItem('mostrandoFormulario', JSON.stringify(true));
    }
  }




  // Cerrar el formulario de edición
  cerrarFormulario(): void {
    this.mostrandoFormulario = false;
    localStorage.removeItem('mostrandoFormulario');
  }

  validarFormulario(): boolean {
    if (!this.usuarioEditado.nick || !this.usuarioEditado.email ) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return false;
    }

    if (!this.validarEmail(this.usuarioEditado.email)) {
      Swal.fire('Error', 'El correo electrónico no es válido', 'error');
      return false;
    }

    return true;
  }

  // Validar un correo electrónico
  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Guardar los cambios realizados en el formulario
  guardarCambios(): void {
    if (this.usuarioEditado) {
      const idUsuario = this.userData.usuario.id; // Obtener el ID del usuario

      // Llamar al servicio para actualizar el usuario
      this.authService.actualizarUsuario(idUsuario, this.usuarioEditado).subscribe({
        next: (usuarioActualizado) => {
          console.log('Usuario actualizado:', usuarioActualizado);
          this.successMessage = 'Los cambios se han guardado correctamente';
          this.cerrarFormulario(); // Cerrar el formulario
          this.userData = { ...this.userData, ...usuarioActualizado }; // Actualizar los datos del usuario en el componente
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
          this.errorMessage = 'No se pudieron guardar los cambios';
        }
      });
    }
  }






  isAdmin(): boolean {
    const user = this.userData.value; // Obtener los datos del usuario

    if (!user || !user.usuario) {
      console.log('%c⚠️ No hay datos de usuario', 'color: orange; font-weight: bold;');
      return false;
    }

    console.log('%c🔍 Usuario detectado:', 'color: blue; font-weight: bold;', user);

    const roles = user.usuario.roles; // Acceder a los roles correctamente

    if (roles && roles.includes('ROLE_ADMIN')) {
      console.log('%c✅ Usuario ES ADMIN', 'color: green; font-weight: bold;');
      return true;
    } else {
      console.log('%c❌ Usuario NO es ADMIN', 'color: red; font-weight: bold;');
      return false;
    }
  }

  isCliente(cliente: Cliente | number): cliente is Cliente {
    return (cliente as Cliente).nombre !== undefined;
  }

  loadPedidos(): void {
    this.pedidoservice.getPendingPedidos().subscribe({
      next: (data) => {
        // Iterate over the data and check the type of cliente for each pedido
        data.forEach((pedido) => {
          if (this.isCliente(pedido.cliente)) {
            // Now TypeScript knows that pedido.cliente is a Cliente
            console.log("Client Name:", pedido.cliente.nombre, pedido.cliente.apellidos);
          } else {
            // pedido.cliente is a number (ID)
            console.log("Client ID:", pedido.cliente);
          }
        });

        // Assign the data to the pedidos array after logging cliente info
        this.pedidos = data;
      },
      error: (err) => {
        console.error('Error fetching pedidos:', err);
      }
    });
  }

  updatePedidoEstado(pedidoId: number | undefined, newEstado: string): void {
    console.log("Calling updateEstado with:");
    console.log("Pedido ID:", pedidoId);
    console.log("New Estado:", newEstado);
    this.pedidoservice.updateEstado(pedidoId, newEstado).subscribe({
      next: (updatedPedido) => {
        console.log('Pedido updated:', updatedPedido);
        // Optionally, update the local pedidos array with the updated pedido
        this.pedidos = this.pedidos.map((pedido) =>
          pedido.id === updatedPedido.id ? updatedPedido : pedido
        );
      },
      error: (err) => {
        console.error('Error updating estado:', err);
      }
    });
  }



}

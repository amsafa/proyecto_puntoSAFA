import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from "@angular/forms";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import { adm } from '../../interface/adm';
import { PerfiladmService } from '../../service/perfiladm.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import {Pedido} from '../../interface/pedido';
import {PedidoService} from '../../service/pedido.service';
import {Cliente} from '../../interface/cliente';

@Component({
  selector: 'app-perfil-adm',
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    NgForOf,
    DatePipe
  ],
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
    private perfiladmService: PerfiladmService,
    private route: ActivatedRoute,
    private router: Router,
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





  abrirFormulario(): void {
    if (this.userData) {
      this.usuarioEditado = { ...this.userData, contrasena: '' };
      this.mostrandoFormulario = true;
      localStorage.setItem('mostrandoFormulario', 'true');
    }
  }

  cerrarFormulario(): void {
    this.mostrandoFormulario = false;
    localStorage.setItem('mostrandoFormulario', 'false');
  }

  guardarCambios() {

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

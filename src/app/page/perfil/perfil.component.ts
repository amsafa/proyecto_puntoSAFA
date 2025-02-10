import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    ReactiveFormsModule
  ],
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  cliente: RegistroCliente | null = null;
  errorMessage: string = '';
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
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
    this.cargarUsuarioAutenticado();
    this.clienteId = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.clienteId) {
      this.cargarCliente(this.clienteId);
    }
  }

  cargarCliente(id: number): void {
    this.perfilService.getClienteById(id).subscribe({
      next: (data) => {
        this.cliente = data;
        this.perfilForm.patchValue(data);
      },
      error: () => {
        this.errorMessage = 'Error al cargar los datos del perfil.';
      }
    });
  }

  guardarCambios(): void {
    if (this.perfilForm.valid && this.clienteId) {
      const clienteActualizado: RegistroCliente = {
        ...this.perfilForm.value,
        id: this.clienteId
      };

      this.perfilService.editarCliente(this.clienteId, clienteActualizado).subscribe({
        next: () => {
          Swal.fire('¡Perfil Actualizado!', 'Los datos del perfil se han actualizado correctamente.', 'success');
        },
        error: () => {
          this.errorMessage = 'Error al guardar los cambios.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, verifica los datos ingresados.';
    }
  }

  cargarUsuarioAutenticado(): void {
    this.authService.getUserData().subscribe({
      next: (usuario) => {
        if (usuario) {
          console.log('Usuario autenticado en perfil:', usuario);
          this.cliente = usuario;
          this.perfilForm.patchValue(usuario);
        } else {
          console.warn('⚠️ No se recibió usuario autenticado.');
        }
      },
      error: (err) => {
        console.error('Error obteniendo usuario autenticado:', err);
        this.errorMessage = 'Error al cargar los datos del usuario.';
      }
    });
  }
}

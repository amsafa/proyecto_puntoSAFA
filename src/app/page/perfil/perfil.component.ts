import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../../interface/RegistroCliente';
import { NgIf } from '@angular/common';
import {PerfilService} from '../../service/perfil.service';




@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  imports: [NgIf, ReactiveFormsModule],
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
          Swal.fire({
            title: '¡Perfil Actualizado!',
            text: 'Los datos del perfil se han actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
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


  cargarUsuarioAutenticado(): void {
    this.perfilService.obtenerUsuarioAutenticado().subscribe({
      next: (data) => {
        console.log('Datos recibidos en cargarUsuarioAutenticado:', data);  // 🔎 Verifica si data es un objeto o un array
        if (Array.isArray(data)) {
          console.error('⚠️ Error: Se recibió un array en lugar de un objeto.');
        }
        this.cliente = data;
        // @ts-ignore
        this.perfilForm.patchValue(data);
      },
      error: (err) => {
        console.error('Error obteniendo usuario autenticado:', err);
        this.errorMessage = 'Error al cargar los datos del usuario.';
      }
    });
  }



}

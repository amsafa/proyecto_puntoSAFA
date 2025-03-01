import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LibroService } from '../../service/libro.service';
import { LibroCrea } from '../../interface/libro-crea';  // Importando desde libro-crea.ts
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-registro-libro',
  templateUrl: './registro-libro.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./registro-libro.component.css']
})
export class RegistroLibroComponent implements OnInit {
  libroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private router: Router
  ) {}

  ngOnInit() {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      resumen: ['', Validators.required],
      anioPublicacion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      ISBN: ['', Validators.required],
      editorial: ['', Validators.required],
      imagen: [''],
      idioma: ['', Validators.required],
      numPaginas: ['', [Validators.required, Validators.min(1)]],
      autor: this.fb.group({
        id: ['', Validators.required]  // ✅ Definir bien el FormGroup
      }),
      categoria: this.fb.group({
        id: ['', Validators.required]  // ✅ Asegurar que está bien definido
      })
    });
  }

  guardarLibro(): void {
    if (this.libroForm.invalid) {
      alert("El formulario no es válido. Revisa los campos.");
      return;
    }

    const libroCrea: LibroCrea = {
      id: 0,
      titulo: this.libroForm.value.titulo,
      resumen: this.libroForm.value.resumen,
      anioPublicacion: this.libroForm.value.anio_publicacion,
      precio: this.libroForm.value.precio,
      ISBN: this.libroForm.value.ISBN,
      editorial: this.libroForm.value.editorial,
      imagen: this.libroForm.value.imagen,
      idioma: this.libroForm.value.idioma,
      numPaginas: this.libroForm.value.num_paginas,
      autor:this.libroForm.value.autor?.id,
      categoria: this.libroForm.value.categoria?.id,
    };



    // Llamar al servicio con el libro transformado
    this.libroService.crearLibro(libroCrea).subscribe(
      () => {
        alert("📚 ¡Libro creado!");
        this.crearNuevoLibro();
      },
      error => {
        console.error("❌ Error al registrar el libro:", error);
        alert("Hubo un error al registrar el libro.");
      }
    );
  }


  private crearNuevoLibro() {
    this.libroForm.reset();
  }

  private fechaFormateada(anioPublicacion: string | number): string {
    if (!anioPublicacion) return '';
    if (typeof anioPublicacion === 'number') {
      return new Date(anioPublicacion, 0, 1).toISOString().split('T')[0];
    }
    return new Date(anioPublicacion).toISOString().split('T')[0];
  }




}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { LibroService } from '../../service/libro.service';
import { LibroCrea } from '../../interface/libro-crea';
import { debounceTime, switchMap } from 'rxjs/operators';
import { NgForOf, NgIf } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of } from 'rxjs';
import {Autor} from '../../interface/autor';
import {Categoria} from '../../interface/categoria';
@Component({
  selector: 'app-editar-libro',
  templateUrl: './editar-libro.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    NgForOf
  ],
  styleUrls: ['./editar-libro.component.css']
})
export class EditarLibroComponent implements OnInit {
  libroForm!: FormGroup;
  tituloControl = new FormControl('');
  librosFiltrados: LibroCrea[] = [];
  libroId?: number;
  isEditMode = false;
  autores: Autor[] = [];
  categorias: Categoria[]= [];
  titulo: string = '';

  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      resumen: ['', Validators.required],
      anioPublicacion: ['', Validators.required],
      precio: ['', Validators.required],
      ISBN: ['', Validators.required],
      editorial: ['', Validators.required],
      imagen: [''],
      idioma: ['', Validators.required],
      numPaginas: ['', Validators.required],
      autor: this.fb.group({ id: ['', Validators.required] }),
      categoria: this.fb.group({ id: ['', Validators.required] })
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.libroId = id ? +id : undefined;
    this.isEditMode = !!this.libroId;

    if (this.isEditMode && this.libroId) {
      this.cargarLibro(this.libroId);
    }

    // Llamar a obtenerAutores y obtenerCategorias para llenar los campos en el formulario
    this.libroService.obtenerAutores().subscribe(autores => {
      console.log("Autores:", autores);
      this.autores = autores;
    });

    this.libroService.obtenerCategorias().subscribe(categorias => {
      console.log("Categorías:", categorias);
      this.categorias = categorias;
    });

    // Lógica para buscar el libro por título
    this.tituloControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => value ? this.libroService.buscarLibroPorTitulo(value) : of([]))
    ).subscribe(libros => {
      this.librosFiltrados = libros;
    });
  }


  cargarLibro(id: number): void {
    this.libroService.obtenerLibro(id).subscribe(libro => {
      console.log("📥 Libro recibido del backend:", libro);

      if (!libro) {
        console.error("❌ No se encontró el libro.");
        alert("Libro no encontrado.");
        return;
      }

      console.log("📖 Título:", libro.titulo);
      console.log("📜 Resumen:", libro.resumen);
      console.log("📅 Año de Publicación:", libro.anioPublicacion);
      console.log("💲 Precio:", libro.precio);
      console.log("📘 ISBN:", libro.ISBN);
      console.log("🏢 Editorial:", libro.editorial);
      console.log("🖼️ Imagen:", libro.imagen);
      console.log("🗣️ Idioma:", libro.idioma);
      console.log("📑 Número de Páginas:", libro.numPaginas);

      // Depuración de autor y categoría
      console.log("👨‍💼 Autor recibido:", libro.autor);
      console.log("📚 Categoría recibida:", libro.categoria);

      this.libroForm.patchValue({
        titulo: libro.titulo,
        resumen: libro.resumen,
        anioPublicacion: libro.anioPublicacion,
        precio: libro.precio,
        ISBN: libro.ISBN,
        editorial: libro.editorial,
        imagen: libro.imagen,
        idioma: libro.idioma,
        numPaginas: libro.numPaginas,
        autor: { id: libro.autor?.id || '' },
        categoria: { id: libro.categoria?.id || '' }
      });

      console.log("📌 Formulario actualizado con valores:", this.libroForm.value);
    }, error => {
      console.error('❌ Error al cargar el libro:', error);
      alert('Hubo un problema al cargar los datos del libro.');
    });
  }



  guardarLibro(): void {
    if (this.libroForm.invalid) {
      alert("El formulario no es válido. Revisa los campos.");
      return;
    }

    const libro: LibroCrea = {
      ...this.libroForm.value,
      anioPublicacion: this.fechaFormateada(this.libroForm.value.anioPublicacion),
      autor: { id: this.libroForm.value.autor?.id },
      categoria: { id: this.libroForm.value.categoria?.id },
    };

    this.libroService.crearLibro(libro).subscribe(
      () => {
        alert("📚 ¡Se ha creado tu libro!");
        this.crearNuevoLibro();
      },
      error => {
        console.error("❌ Error al registrar el libro:", error);
        alert("Hubo un error al registrar el libro.");
      }
    );
  }

  crearNuevoLibro(): void {
    this.isEditMode = false;
    this.libroId = undefined;
    this.libroForm.reset();
  }

  private fechaFormateada(anioPublicacion: string | number): string {
    if (!anioPublicacion) return '';
    if (typeof anioPublicacion === 'number') {
      return new Date(anioPublicacion, 0, 1).toISOString().split('T')[0];
    }
    return new Date(anioPublicacion).toISOString().split('T')[0];
  }


  onLibroSeleccionado(libro: LibroCrea): void {
    this.libroForm.patchValue({
      titulo: libro.titulo,
      resumen: libro.resumen,
      anioPublicacion: this.fechaFormateada(libro.anio_publicacion),
      precio: libro.precio,
      ISBN: libro.ISBN,
      editorial: libro.editorial,
      imagen: libro.imagen,
      idioma: libro.idioma,
      numPaginas: libro.num_paginas,
      autor: { id: libro.autor.nombre },
      categoria: { id: libro.categoria.nombre }
    });
  }
}

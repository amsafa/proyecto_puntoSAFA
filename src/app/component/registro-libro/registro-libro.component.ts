import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibroService } from '../../service/libro.service';
import { Libro } from '../../interface/libro';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-registro-libro',
  templateUrl: './registro-libro.component.html',
  imports: [
    ReactiveFormsModule,CommonModule,FormsModule
  ],
  styleUrls: ['./registro-libro.component.css']
})
export class RegistroLibroComponent implements OnInit {
  libroForm!: FormGroup;
  libroId!: number | null;
  isEditMode = false;


  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario con validaciones mejoradas
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      resumen: ['', [Validators.maxLength(800)]],
      anioPublicacion: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      precio: [0, [Validators.required, Validators.min(0)]],
      ISBN: ['', [Validators.required, Validators.pattern(/^(?:\d{9}[\dXx]|\d{13})$/)]],
      editorial: ['', Validators.required],
      imagen: [''],
      idioma: ['', Validators.required],
      numPaginas: [0, [Validators.required, Validators.min(1)]],
      // Grupo para Autor
      autor: this.fb.group({
        id: ['', Validators.required]
      }),
      // Grupo para Categoría
      categoria: this.fb.group({
        id: ['', Validators.required]
      })
    });

    // Revisa si viene un parámetro 'id' para modo edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.libroId = +id;
        this.isEditMode = true;
        this.cargarLibro(this.libroId);
      }
    });
  }

  // Carga los datos del libro en modo edición
  cargarLibro(id: number): void {
    this.libroService.getLibroById(id).subscribe(libro => {
      this.libroForm.patchValue({
        ...libro,
        autor: { id: libro.autor?.id || '' },
        categoria: { id: libro.categoria?.id || '' }
      });
    });
  }

  // Guarda o actualiza el libro según el modo
  guardarLibro(): void {
    if (this.libroForm.invalid) return;

    const libro: Libro = {
      ...this.libroForm.value,
      autor: { id: this.libroForm.value.autor.id },
      categoria: { id: this.libroForm.value.categoria.id }
    };

    if (this.isEditMode && this.libroId) {
      // Actualización de libro
      this.libroService.editarLibro(this.libroId, libro).subscribe(() => {
        alert('Libro actualizado correctamente');
        this.router.navigate(['/libros']);
      });
    } else {
      // Creación de libro nuevo
      this.libroService.crearLibro(libro).subscribe(() => {
        alert('Libro registrado correctamente');
        this.router.navigate(['/libros']);
      });
    }
  }

  // Elimina el libro actual en modo edición
  eliminarLibro(): void {
    if (this.libroId && confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.libroService.eliminarLibro(this.libroId).subscribe(() => {
        alert('Libro eliminado correctamente');
        this.router.navigate(['/libros']);
      });
    }
  }

  // Resetea el formulario para crear un libro nuevo
  crearNuevoLibro(): void {
    this.isEditMode = false;
    this.libroId = null;
    this.libroForm.reset({
      titulo: '',
      resumen: '',
      anioPublicacion: '',
      precio: 0,
      ISBN: '',
      editorial: '',
      imagen: '',
      idioma: '',
      numPaginas: 0,
      autor: { id: '' },
      categoria: { id: '' }
    });
  }
}

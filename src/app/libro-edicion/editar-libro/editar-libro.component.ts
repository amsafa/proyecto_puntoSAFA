import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibroService } from '../../service/libro.service';
import { LibroCrea } from '../../interface/libro-crea';
import { debounceTime, switchMap } from 'rxjs/operators';
import { NgForOf, NgIf } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of } from 'rxjs';
import { Autor } from '../../interface/autor';
import { Categoria } from '../../interface/categoria';

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
  categorias: Categoria[] = [];
  titulo: string = '';


  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.libroForm = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      resumen: ['', Validators.required],
      anioPublicacion: ['', Validators.required],
      precio: ['', Validators.required],
      ISBN: ['', Validators.required],
      editorial: ['', Validators.required],
      imagen: [''],
      idioma: ['', Validators.required],
      numPaginas: ['', Validators.required],
      autor: ['', Validators.required],
      categoria: ['', Validators.required]
    });



    const id = this.route.snapshot.paramMap.get('id');
    this.libroId = id ? +id : undefined;
    this.isEditMode = !!this.libroId;

    if (this.isEditMode && this.libroId) {
      this.cargarLibro(this.libroId);
    }
    this.tituloControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => value ? this.libroService.buscarLibroPorTitulo(value) : of([]))
    ).subscribe(libros => {
      this.librosFiltrados = libros;
    });
  }

  cargarLibro(id: number): void {
    this.libroService.obtenerLibro(id).subscribe((libro: LibroCrea) => {
      if (!libro) {
        alert("Libro no encontrado.");
        return;
      }
      console.log("Libro cargado:", libro);

      this.libroForm.patchValue({
        titulo: libro.titulo,
        resumen: libro.resumen,
        anioPublicacion: libro.anioPublicacion ? libro.anioPublicacion.split('T')[0] : '', // ✅ Remove time + timezone
        precio: libro.precio,
        ISBN: libro.ISBN,
        editorial: libro.editorial,
        imagen: libro.imagen,
        idioma: libro.idioma,
        numPaginas: libro.numPaginas,
        autor: libro.autor ? `${libro.autor.nombre} ${libro.autor.apellidos}` : '', // ✅ Store full name
        categoria: libro.categoria ? libro.categoria.nombre : '' // ✅ Store category name
      });
    }, error => {
      console.error("Error al cargar el libro:", error);
      alert('Hubo un problema al cargar los datos del libro.');
    });
  }

  eliminarLibro(): void {
    if (!this.libroId) {
      alert('Debe seleccionar un libro antes de eliminar.');
      return;
    }

    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este libro?');
    console.log("ID a eliminar:", this.libroId);

    if (confirmDelete) {
      this.libroService.eliminarLibro(this.libroId).subscribe(
        () => {
          alert('Libro eliminado correctamente.');
          this.router.navigate(['/lista-libros']);
        },
        error => {
          alert('Error: No se pudo eliminar el libro.');
        }
      );
    }
  }



  onLibroSeleccionado(libro: LibroCrea): void {
    console.log("Libro seleccionado:", libro);
    this.libroId = libro.id;
    this.libroForm.patchValue({
      id: libro.id ?? null,
      titulo: libro.titulo,
      resumen: libro.resumen,
      anioPublicacion: libro.anioPublicacion ? libro.anioPublicacion.split('T')[0] : '', // ✅ Remove time + timezone
      precio: libro.precio,
      ISBN: libro.ISBN,
      editorial: libro.editorial,
      imagen: libro.imagen,
      idioma: libro.idioma,
      numPaginas: libro.numPaginas,
      autor: libro.autor ? `${libro.autor.nombre} ${libro.autor.apellidos}` : '', // ✅ Store full name
      categoria: libro.categoria ? libro.categoria.nombre : '' // ✅ Store category name
    });
    console.log("ID almacenado en el formulario:", this.libroForm.get('id')?.value);
  }

  guardarCambios(): void {
    const libroActualizado = this.libroForm.value;
    const libroId = this.libroForm.get('id')?.value;

    console.log("ID extraído para actualizar:", libroId);

    if (!libroId) {
      alert("Error: No se encontró el ID del libro.");
      return;
    }

    // Find the author object based on the full name entered
    const autorSeleccionado = this.autores.find(a =>
      `${a.nombre} ${a.apellidos}` === libroActualizado.autor
    );

    // Find the category object based on the name entered
    const categoriaSeleccionada = this.categorias.find(c =>
      c.nombre === libroActualizado.categoria
    );

    this.libroService.actualizarLibro(libroActualizado.id, {
      ...libroActualizado,
      anio_publicacion: libroActualizado.anio_publicacion, // Keep as string (YYYY-MM-DD)
      autor: autorSeleccionado ? { id: autorSeleccionado.id } : null,  // ✅ Convert back to autor ID
      categoria: categoriaSeleccionada ? { id: categoriaSeleccionada.id } : null  // ✅ Convert back to categoria ID
    }).subscribe(() => {
      alert('Libro actualizado con éxito');
    }, error => {
      alert('Error al actualizar el libro.');
    });
  }
}

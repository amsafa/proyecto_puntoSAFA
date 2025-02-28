import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibroService } from '../../service/libro.service';
import { LibroCrea } from '../../interface/libro-crea';
import { debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import {NgForOf, NgIf} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';

@Component({
  selector: 'app-editar-libro',
  templateUrl: './editar-libro.component.html',
  styleUrls: ['./editar-libro.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
  ],
  providers: [ConfirmationService, MessageService]
})
export class EditarLibroComponent implements OnInit {
  libroForm!: FormGroup;
  tituloControl = new FormControl('');
  librosFiltrados: LibroCrea[] = [];
  libroId?: number;
  isEditMode = false;


  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      resumen: ['', [Validators.maxLength(800)]],
      anio_publicacion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      ISBN: ['', [Validators.required, Validators.pattern('^(\\d{10}|\\d{13})$')]],
      editorial: ['', Validators.required],
      imagen: [''],
      idioma: ['', Validators.required],
      num_paginas: ['', [Validators.required, Validators.min(1)]],
      autor: [null, Validators.required],
      categoria: [null, Validators.required]
    });

    this.libroId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.libroId;

    if (this.isEditMode) {
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
    this.libroService.obtenerLibro(id).subscribe(libro => {
      console.log(libro); // Verifica si los campos están presentes en el objeto libro
      if (libro) {
        this.libroForm.patchValue({
          titulo: libro.titulo,
          resumen: libro.resumen,
          anio_publicacion: libro.anio_publicacion,
          precio: libro.precio,
          ISBN: libro.ISBN,
          editorial: libro.editorial,
          imagen: libro.imagen,
          idioma: libro.idioma,
          num_paginas: libro.num_paginas,
          autor: libro.autor ? libro.autor.id : null, // solo el ID
          categoria: libro.categoria ? libro.categoria.id : null // solo el ID
        });
      }
    });
  }




  guardarLibro(): void {
    if (this.libroForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Formulario Inválido', detail: 'Por favor, completa los campos obligatorios.' });
      return;
    }

    const libro: LibroCrea = {
      ...this.libroForm.value,
      anio_publicacion: this.fechaFormateada(this.libroForm.value.anio_publicacion)
    };

    if (this.isEditMode && this.libroId) {
      this.libroService.actualizarLibro(this.libroId, libro).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Libro Actualizado', detail: 'El libro ha sido actualizado correctamente.' });
          this.router.navigate(['/lista-libros']);
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el libro.' });
        }
      );
    }
  }

  eliminarLibro(): void {
    if (!this.libroId) return;

    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este libro?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.libroService.eliminarLibro(this.libroId!).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Libro Eliminado', detail: 'El libro ha sido eliminado correctamente.' });
            this.router.navigate(['/lista-libros']);
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el libro.' });
          }
        );
      }
    });
  }

  onLibroSeleccionado(libro: LibroCrea): void {
    this.libroId = libro.id;
    this.isEditMode = true;
    this.libroForm.patchValue(libro);
  }

  private fechaFormateada(anioPublicacion: string | number): string {
    if (!anioPublicacion) return '';
    return typeof anioPublicacion === 'number'
      ? new Date(anioPublicacion, 0, 1).toISOString().split('T')[0]
      : new Date(anioPublicacion).toISOString().split('T')[0];
  }


}

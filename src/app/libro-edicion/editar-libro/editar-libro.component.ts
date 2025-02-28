import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { LibroService } from '../../service/libro.service';
import { Libro } from '../../interface/libro';
import { debounceTime, switchMap } from 'rxjs/operators';
import { NgForOf, NgIf } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of } from 'rxjs';
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
  librosFiltrados: Libro[] = [];
  libroId?: number;
  isEditMode = false;

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

    this.tituloControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => value ? this.libroService.buscarLibroPorTitulo(value) : of([]))
    ).subscribe(libros => {
      this.librosFiltrados = libros;
    });
  }

  cargarLibro(id: number): void {
    this.libroService.obtenerLibro(id).subscribe(libro => {
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
    }, error => {
      console.error('Error al cargar el libro:', error);
      alert('Hubo un problema al cargar los datos del libro.');
    });
  }

  guardarLibro(): void {
    if (this.libroForm.invalid) {
      alert("El formulario no es válido. Revisa los campos.");
      return;
    }

    const libro: Libro = {
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


  onLibroSeleccionado(libro: Libro): void {
    this.libroForm.patchValue({
      titulo: libro.titulo,
      resumen: libro.resumen,
      anioPublicacion: this.fechaFormateada(libro.anioPublicacion),
      precio: libro.precio,
      ISBN: libro.ISBN,
      editorial: libro.editorial,
      imagen: libro.imagen,
      idioma: libro.idioma,
      numPaginas: libro.numPaginas,
      autor: { id: libro.autor?.id || '' },
      categoria: { id: libro.categoria?.id || '' }
    });
  }
}

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
  private confirmationService: any;
  private messageService: any;

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
      autor: ['', Validators.required],
      categoria: ['', Validators.required]
    });



    const id = this.route.snapshot.paramMap.get('id');
    this.libroId = id ? +id : undefined;
    this.isEditMode = !!this.libroId;

    if (this.isEditMode && this.libroId) {
      this.cargarLibro(this.libroId);
    }

    this.libroService.obtenerAutores().subscribe(autores => {
      this.autores = autores;
    });

    this.libroService.obtenerCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });

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


  guardarLibro(): void {
    if (this.libroForm.invalid) {
      alert("El formulario no es válido. Revisa los campos.");
      return;
    }

    const libro: LibroCrea = {
      ...this.libroForm.value,
      anioPublicacion: this.fechaFormateada(this.libroForm.value.anioPublicacion),
      autor: { id: this.libroForm.value.autor.id },
      categoria: { id: this.libroForm.value.categoria.id }
    };

    this.libroService.crearLibro(libro).subscribe(
      () => {
        alert("📚 ¡Se ha creado tu libro!");
        this.crearNuevoLibro();
      },
      error => {
        alert("Hubo un error al registrar el libro.");
      }
    );
  }

  private fechaFormateada(anio_publicacion: Date): string {
    if (!anio_publicacion) return '';
    return new Date(anio_publicacion).toISOString().split('T')[0];
  }

  crearNuevoLibro(): void {
    this.isEditMode = false;
    this.libroId = undefined;
    this.libroForm.reset();
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
  }

  guardarCambios(): void {
    const libroActualizado = this.libroForm.value;

    // Ensure anioPublicacion is stored as a full date
    const fullDate = libroActualizado.anioPublicacion ? `${libroActualizado.anioPublicacion}-01-01` : null;

    this.libroService.actualizarLibro(libroActualizado.id, {
      ...libroActualizado,
      anioPublicacion: fullDate, // ✅ Convert year back to full date
      autor: this.autores.find(a => `${a.nombre} ${a.apellidos}` === libroActualizado.autor) || null,
      categoria: this.categorias.find(c => c.nombre === libroActualizado.categoria) || null
    }).subscribe(() => {
      alert('Libro actualizado con éxito');
    }, error => {
      alert('Error al actualizar el libro.');
    });
  }
}

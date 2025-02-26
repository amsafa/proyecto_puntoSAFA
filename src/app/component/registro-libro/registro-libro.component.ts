import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LibroService } from '../../service/libro.service';
import { Libro as LibroCrea } from '../../interface/libro-crea';  // Importando desde libro-crea.ts
import {Libro, Libro as LibroOriginal} from '../../interface/libro';  // Importando desde libro.ts
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
      anioPublicacion: this.fechaFormateada(this.libroForm.value.anioPublicacion),
      precio: this.libroForm.value.precio,
      ISBN: this.libroForm.value.ISBN,
      editorial: this.libroForm.value.editorial,
      imagen: this.libroForm.value.imagen,
      idioma: this.libroForm.value.idioma,
      numPaginas: this.libroForm.value.numPaginas,
      autor: { id: Number(this.libroForm.value.autor?.id) },
      categoria: { id: Number(this.libroForm.value.categoria?.id) },
      // Propiedades opcionales que puedes dejar vacías o con valores por defecto
      calificacion: 0,
      mediaCalificacion: 0,
      autorNombre: "",
      autorApellidos: ""
    };

    // Transformar libroCrea al formato que espera el servicio (LibroOriginal)
    const libroOriginal: LibroOriginal = this.transformarLibroCreaAOriginal(libroCrea);

    // Llamar al servicio con el libro transformado
    this.libroService.crearLibro(libroOriginal).subscribe(
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

  // Función para transformar el libro de libro-crea.ts a libro.ts
  private transformarLibroCreaAOriginal(libroCrea: LibroCrea): LibroOriginal {
    return <Libro>{
      id: 0,  // Asegúrate de que el id se asigna correctamente o se usa como un valor predeterminado
      titulo: libroCrea.titulo,
      resumen: libroCrea.resumen,
      anioPublicacion: libroCrea.anioPublicacion,
      precio: libroCrea.precio,
      ISBN: libroCrea.ISBN,
      editorial: libroCrea.editorial,
      imagen: libroCrea.imagen,
      idioma: libroCrea.idioma,
      numPaginas: libroCrea.numPaginas,
      autor: libroCrea.autor,
      categoria: libroCrea.categoria,
      calificacion: libroCrea.calificacion || 0,  // Asignar valor por defecto si es necesario
      mediaCalificacion: libroCrea.mediaCalificacion || 0,  // Asignar valor por defecto si es necesario
      autorNombre: libroCrea.autorNombre || "",  // Valor por defecto
      autorApellidos: libroCrea.autorApellidos || ""  // Valor por defecto
    };
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

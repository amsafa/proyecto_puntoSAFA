import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LibroService } from '../../service/libro.service';
import { LibroCrea } from '../../interface/libro-crea';  // Importando desde libro-crea.ts
import { NgIf } from '@angular/common';
import {LibroNuevo} from '../../interface/libroNuevo';

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
  ) {}

  ngOnInit() {
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]], // Added max length validation
      resumen: ['', [Validators.required, Validators.maxLength(800)]], // Added max length validation
      anioPublicacion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      ISBN: ['', [Validators.required, Validators.pattern(/^\d{10}(\d{3})?$/)]], // Added pattern validation for ISBN
      editorial: ['', Validators.required],
      imagen: [''], // Optional field
      idioma: ['', Validators.required],
      numPaginas: ['', [Validators.required, Validators.min(1)]],
      autor: [null, Validators.required], // Directly as a number
      categoria: [null, Validators.required], // Directly as a number

    });
  }

  guardarLibro(): void {
    if (this.libroForm.invalid) {
      console.log("Form is invalid");
      return;  // Prevent form submission
    }

    if (this.libroForm.invalid) {
      alert("El formulario no es válido. Revisa los campos.");
      return;
    }

    const libroNuevo: LibroNuevo = {
      id: 0,  // This can be omitted if not needed
      titulo: this.libroForm.value.titulo,
      resumen: this.libroForm.value.resumen,
      anioPublicacion: new Date(this.libroForm.value.anioPublicacion).toISOString().split('T')[0], // Format the date
      precio: this.libroForm.value.precio,
      ISBN: this.libroForm.value.ISBN,
      editorial: this.libroForm.value.editorial,
      imagen: this.libroForm.value.imagen,
      idioma: this.libroForm.value.idioma,
      numPaginas: this.libroForm.value.numPaginas,
      autor: this.libroForm.value.autor.id,  // Only send the ID
      categoria: this.libroForm.value.categoria.id, // Only send the ID
    };

    console.log("libroForm.value", this.libroForm.value);
    console.log("libroCrea", libroNuevo);
    console.log("libroForm.value.autor", this.libroForm.value.autor);
    console.log("libroForm.value.categoria", this.libroForm.value.categoria);
    console.log("Final libroCrea object before sending:", libroNuevo);

    // Llamar al servicio con el libro transformado
    this.libroService.crearLibro(libroNuevo).subscribe(
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

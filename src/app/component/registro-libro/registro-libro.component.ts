import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LibroService } from '../../service/libro.service';
import { Libro } from '../../interface/libro';
import {NgIf} from '@angular/common';

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
  private tituloControl: any;

  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private router: Router
  ) {}

  ngOnInit() {this.tituloControl
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

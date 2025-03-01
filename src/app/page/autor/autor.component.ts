import { Component, OnInit } from '@angular/core';

import { DatePipe, NgForOf, NgIf } from '@angular/common'; // ✅ Importar NgIf
import { HttpClient } from '@angular/common/http';
import {HeaderComponent} from '../../component/header/header.component';
import {FooterComponent} from '../../component/footer/footer.component';
import {BuscadorInicioComponent} from '../../component/buscador-inicio/buscador-inicio.component';

interface Libro {
  titulo: string;
  descripcion: string;
}

interface Autor {
  id: number;
  nombre: string;
  apellidos: string;
  nacionalidad: string;
  fecha_nacimiento: string;
  biografia: string;
  libros: Libro[];
}

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    BuscadorInicioComponent,
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.css']
})
export class AutorComponent implements OnInit {
  autor: Autor | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerAutor();
  }

  obtenerAutor() {
    this.http.get<Autor>('http://localhost:8000/autor').subscribe(
      (data) => {
        this.autor = data;
        console.log("Datos del autor recibidos:", this.autor);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}

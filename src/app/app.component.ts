import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibroService } from './service/libro.service';
import {NgForOf} from '@angular/common';
import {FooterComponent} from './component/footer/footer.component';
import {HeaderComponent} from './component/header/header.component';
import {
  HeroSectionInicioComponent
} from './component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';
import {
  CajasCategoriaInicioComponent
} from './component/Inicio_componentes_propios/cajas-categoria-inicio/cajas-categoria-inicio.component';
import {CarouselComponent} from './component/Inicio_componentes_propios/carousel/carousel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, FooterComponent, HeaderComponent, HeroSectionInicioComponent, CajasCategoriaInicioComponent, CarouselComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'puntoSafa';
  usuarios: any[] = [];

  constructor(private apiService: LibroService) {}

  ngOnInit() {

  }
}

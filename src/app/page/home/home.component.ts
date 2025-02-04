import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from '../../component/header/header.component';
import {
  HeroSectionInicioComponent
} from '../../component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';
import {BuscadorInicioComponent} from '../../component/buscador-inicio/buscador-inicio.component';
import {
  CajasCategoriaInicioComponent
} from '../../component/Inicio_componentes_propios/cajas-categoria-inicio/cajas-categoria-inicio.component';
import {FooterComponent} from "../../component/footer/footer.component";
import {CarouselComponent} from "../../component/Inicio_componentes_propios/carousel/carousel.component";
import {
  RecomendacionLibroComponent
} from "../../component/Inicio_componentes_propios/recomendacion-libro/recomendacion-libro.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    HeroSectionInicioComponent,
    BuscadorInicioComponent,
    CajasCategoriaInicioComponent,
    FooterComponent,
    CarouselComponent,
    RecomendacionLibroComponent
  ]
})
export class HomeComponent  implements OnInit {

  constructor() { }

  ngOnInit(): void {
    fetch('/libro/all')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }

}

import { Component, OnInit } from '@angular/core';
import {
  HeroSectionInicioComponent
} from '../../component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';
import {BuscadorInicioComponent} from '../../component/buscador-inicio/buscador-inicio.component';
import {
  CajasCategoriaInicioComponent
} from '../../component/Inicio_componentes_propios/cajas-categoria-inicio/cajas-categoria-inicio.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    HeroSectionInicioComponent,
    BuscadorInicioComponent,
    CajasCategoriaInicioComponent
  ]
})
export class HomeComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}

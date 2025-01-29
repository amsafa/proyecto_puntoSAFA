import { Routes } from '@angular/router';
import {HeaderComponent} from './component/header/header.component';
import {FooterComponent} from './component/footer/footer.component';
import {HeroSectionInicioComponent} from './component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';
import {BuscadorInicioComponent} from './component/buscador-inicio/buscador-inicio.component';
import {
  CajasCategoriaInicioComponent
} from './component/Inicio_componentes_propios/cajas-categoria-inicio/cajas-categoria-inicio.component';
import {Carousel} from 'primeng/carousel';
import {CarouselComponent} from './component/Inicio_componentes_propios/carousel/carousel.component';

export const routes: Routes = [

  //Comprobación de componentes de Alba
  {path: 'header', component:HeaderComponent, pathMatch: 'full'},
  {path: 'footer', component: FooterComponent, pathMatch: 'full'},
  {path: 'heroInicio', component: HeroSectionInicioComponent, pathMatch: 'full'},
  {path: 'buscadorInicio' ,component: BuscadorInicioComponent, pathMatch: 'full'},
  {path: 'cajasCategoria', component: CajasCategoriaInicioComponent, pathMatch: 'full'},
  {path: 'carrusel', component: CarouselComponent, pathMatch: 'full'}

];

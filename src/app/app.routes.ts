import { Routes } from '@angular/router';
import {HeaderComponent} from './component/header/header.component';
import {FooterComponent} from './component/footer/footer.component';
import {HeroSectionInicioComponent} from './component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';
import {BuscadorInicioComponent} from './component/buscador-inicio/buscador-inicio.component';
import { CajasCategoriaInicioComponent } from './component/Inicio_componentes_propios/cajas-categoria-inicio/cajas-categoria-inicio.component';
import {Carousel} from 'primeng/carousel';
import {
  CajasCategoriaInicioComponent
} from './component/Inicio_componentes_propios/cajas-categoria-inicio/cajas-categoria-inicio.component';
import {CarouselComponent} from './component/Inicio_componentes_propios/carousel/carousel.component';
import { RecomendacionLibroComponent } from './component/Inicio_componentes_propios/recomendacion-libro/recomendacion-libro.component';
import {BookCardComponent} from './component/Inicio_componentes_propios/book-card/book-card.component';
import {HomeComponent} from './page/home/home.component';
import {
  RecomendacionLibroComponent
} from './component/Inicio_componentes_propios/recomendacion-libro/recomendacion-libro.component';
import {CatalogoComponent} from './page/catalogo/catalogo.component';
import {BookCardComponent} from './component/Inicio_componentes_propios/book-card/book-card.component';



export const routes: Routes = [

  //Comprobación de componentes de Alba
  {path: 'header', component:HeaderComponent, pathMatch: 'full'},
  {path: 'footer', component: FooterComponent, pathMatch: 'full'},
  {path: 'heroInicio', component: HeroSectionInicioComponent, pathMatch: 'full'},
  {path: 'buscadorInicio' ,component: BuscadorInicioComponent, pathMatch: 'full'},
  {path: 'verTarjetaLibro', component: BookCardComponent},
  {path: 'cajasCategoria', component: CajasCategoriaInicioComponent, pathMatch: 'full'},
  {path: 'carrusel', component: CarouselComponent, pathMatch: 'full'},
  {path: 'recomendacionLibro', component: RecomendacionLibroComponent, pathMatch: 'full'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'},


  {path:'catalogo', component:CatalogoComponent, pathMatch:'full'},
  {path:'bookcard', component:BookCardComponent, pathMatch:'full'},


];

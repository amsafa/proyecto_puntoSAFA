import { Routes } from '@angular/router';
import {HeaderComponent} from './component/header/header.component';
import {FooterComponent} from './component/footer/footer.component';
import {HeroSectionInicioComponent} from './component/hero-section-inicio/hero-section-inicio.component';

export const routes: Routes = [

  {path: 'header', component:HeaderComponent, pathMatch: 'full'},
  {path: 'footer', component: FooterComponent, pathMatch: 'full'},
  {path: 'heroInicio', component: HeroSectionInicioComponent, pathMatch: 'full'},
];

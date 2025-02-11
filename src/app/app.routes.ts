import { Routes } from '@angular/router';

import {HomeComponent} from './page/home/home.component';
import {CatalogoComponent} from './page/catalogo/catalogo.component';
import {DetalleDeLibroComponent} from './page/detalle-de-libro/detalle-de-libro.component';



export const routes: Routes = [

  //Routers de páginas

  //Página de inicio
  {path: 'home', component: HomeComponent, pathMatch: 'full'},


  //Página de catálogo
  {path:'catalogo', component:CatalogoComponent, pathMatch:'full'},


  //Ruta detalle de libro
  { path: 'detalle-libro/:id', component: DetalleDeLibroComponent }, // Ruta para detalles del libro



];

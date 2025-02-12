import { Routes } from '@angular/router';


import {RegistroComponent} from './page/registro/registro.component';
import {LoginComponent} from './page/login/login.component';
import {HomeComponent} from './page/home/home.component';
import {AutorComponent} from './page/autor/autor.component';
import {PerfilComponent} from './page/perfil/perfil.component';
import {CatalogoComponent} from './page/catalogo/catalogo.component';
import {CarritoPruebaComponent} from './component/carrito-prueba/carrito-prueba.component';
import {CarritoComponent} from './component/carrito/carrito.component';
import {PerfilPruebaComponent} from './perfil-prueba/perfil-prueba.component';
import {DetalleDeLibroComponent} from './page/detalle-de-libro/detalle-de-libro.component';



export const routes: Routes = [

  //Comprobación de componentes de Alba
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path:'carroprueba', component:CarritoPruebaComponent, pathMatch: 'full'},
  {path:'carrotest', component:CarritoComponent, pathMatch: 'full'},


  {path:'catalogo', component:CatalogoComponent, pathMatch:'full'},

  //Comprobación de componentes
  {path: 'registro', component:RegistroComponent, pathMatch: 'full'},
  {path: 'login', component:LoginComponent, pathMatch: 'full'},
  {path: 'home', component:HomeComponent, pathMatch: 'full'},
  {path:'autor', component:AutorComponent, pathMatch: 'full'},
  {path:'catalogo', component: CatalogoComponent, pathMatch: 'full'},
  {path:'perfil', component:PerfilComponent, pathMatch: 'full'},
  {path:'perfil-prueba', component:PerfilPruebaComponent, pathMatch: 'full'},
  {path:'carritoprueba', component:CarritoPruebaComponent, pathMatch: 'full'},
  {path:'carrito-test', component:CarritoComponent, pathMatch: 'full'},
  {path:'detalle-libro', component:DetalleDeLibroComponent, pathMatch: 'full'},


];

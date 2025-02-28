import { Routes } from '@angular/router';


import {RegistroComponent} from './page/registro/registro.component';
import {LoginComponent} from './page/login/login.component';
import {HomeComponent} from './page/home/home.component';
import {AutorComponent} from './page/autor/autor.component';
import {PerfilComponent} from './page/perfil/perfil.component';
import {CatalogoComponent} from './page/catalogo/catalogo.component';
import {DetalleDeLibroComponent} from './page/detalle-de-libro/detalle-de-libro.component';
import {PerfilAdmComponent} from './page/perfil-adm/perfil-adm.component';
import {authGuard} from './auth.guard';
import {EmailComponent} from './email/email.component';
import {ActivarCuentaComponent} from './component/activar-cuenta/activar-cuenta.component';
import {EditarLibroComponent} from './libro-edicion/editar-libro/editar-libro.component';
import {PagarCompraComponent} from './page/pagar-compra/pagar-compra.component';
import {PedidosClienteComponent} from './page/pedidos-cliente/pedidos-cliente.component';
import {RecuperarContrasenaComponent} from './contrasena/recuperar-contrasena/recuperar-contrasena.component';
import {RestablecerContrasenaComponent} from './contrasena/restablecer-contrasena/restablecer-contrasena.component';
import {RegistroLibroComponent} from './libro-edicion/registro-libro/registro-libro.component';
import {SobrenosotrosComponent} from './page/sobrenosotros/sobrenosotros.component';




export const routes: Routes = [

  //Comprobación de componentes
  {path: '', component: HomeComponent, pathMatch: 'full' },
  {path: 'registro', component:RegistroComponent, pathMatch: 'full'},
  {path: 'login', component:LoginComponent, pathMatch: 'full'},
  {path: 'home', component:HomeComponent, pathMatch: 'full'},
  {path:'autor', component:AutorComponent, pathMatch: 'full'},
  {path:'catalogo', component: CatalogoComponent, pathMatch: 'full'},
  {path:'perfil', component:PerfilComponent, pathMatch: 'full'},
  {path: 'detalle-libro/:id', component: DetalleDeLibroComponent },
  { path: 'activar-cuenta', component: ActivarCuentaComponent },
  {path: 'perfil-adm', component: PerfilAdmComponent, pathMatch: 'full'},
  {path:'pagar-pedido', component:PagarCompraComponent, pathMatch: 'full'},
  {path:'pedidos-cliente', component:PedidosClienteComponent, pathMatch: 'full'},
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent, pathMatch: 'full' },
  { path: 'restablecer-contrasena/:token', component: RestablecerContrasenaComponent, pathMatch: 'full' },
  {path: 'sobrenosotros', component: SobrenosotrosComponent, pathMatch: 'full'},



  // Rutas protegidas (solo accesibles si hay sesión iniciada)
  { path: 'perfil', component: PerfilComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'perfil-adm', component: PerfilAdmComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'email', component: EmailComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'registro-libro', component: RegistroLibroComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'editar-libro', component: EditarLibroComponent, pathMatch: 'full', canActivate: [authGuard] },




];

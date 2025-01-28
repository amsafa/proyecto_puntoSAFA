import { Routes } from '@angular/router';
import {HeaderComponent} from './component/header/header.component';
import {FooterComponent} from './component/footer/footer.component';

export const routes: Routes = [

  {path: 'header', component:HeaderComponent, pathMatch: 'full'},
  {path: 'footer', component: FooterComponent, pathMatch: 'full'},
];

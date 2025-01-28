import { Routes } from '@angular/router';
import {HeaderComponent} from './component/header/header.component';

export const routes: Routes = [

  {path: 'header', component:HeaderComponent, pathMatch: 'full'},
];

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import {NgForOf} from '@angular/common';
import {HeaderComponent} from './component/header/header.component';
import {FooterComponent} from './component/footer/footer.component';
import {
  HeroSectionInicioComponent
} from './component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HeaderComponent, FooterComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'puntoSafa';



  constructor(private router: ApiService) {}

  ngOnInit() {



  }


}

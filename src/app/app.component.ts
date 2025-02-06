import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './service/api.service';
import {NgForOf} from '@angular/common';
import {FooterComponent} from './component/footer/footer.component';
import {HeaderComponent} from './component/header/header.component';
import {
  HeroSectionInicioComponent
} from './component/Inicio_componentes_propios/hero-section-inicio/hero-section-inicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, FooterComponent, HeaderComponent, HeroSectionInicioComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'puntoSafa';
  usuarios: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {

  }
}

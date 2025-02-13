import { Component, OnInit } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibroService } from './service/libro.service';
import {FooterComponent} from './component/footer/footer.component';
import {HeaderComponent} from './component/header/header.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FooterComponent,
    HeaderComponent,
    RouterOutlet,
    RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'puntoSafa';
  usuarios: any[] = [];

  constructor(private apiService: LibroService) {}

  ngOnInit() {

  }
}

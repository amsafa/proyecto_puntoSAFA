import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import {NgForOf} from '@angular/common';
import {HeaderComponent} from './component/header/header.component';
import {FooterComponent} from './component/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, HeaderComponent, FooterComponent],
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

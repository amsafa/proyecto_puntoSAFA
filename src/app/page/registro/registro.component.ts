import { Component } from '@angular/core';
import {FooterComponent} from '../../component/footer/footer.component';
import {HeaderComponent} from '../../component/header/header.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {CommonModule} from '@angular/common';
import {PruebaService} from '../../service/prueba.service';


@Component({
  selector: 'app-registro',
  imports: [
    FooterComponent,
    HeaderComponent,CommonModule, FormsModule, ReactiveFormsModule

  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  constructor(private pruebaService: PruebaService) {
  }

  ngOnInit() {
    this.pruebaService.test().subscribe({
      next: (data) => {
        console.log('API Response:', data);
      }
    })
  }

}

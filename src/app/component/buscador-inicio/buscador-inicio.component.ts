import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-buscador-inicio',
  templateUrl: './buscador-inicio.component.html',
  styleUrls: ['./buscador-inicio.component.css'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class BuscadorInicioComponent  implements OnInit {



  constructor() { }

  ngOnInit(): void {

  }
}

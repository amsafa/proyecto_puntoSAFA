import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-hero-section-inicio',
  templateUrl: './hero-section-inicio.component.html',
  styleUrls: ['./hero-section-inicio.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Asegúrate de importar RouterModule


  ]
})
export class HeroSectionInicioComponent  implements OnInit {

  constructor(private router: Router) {}

  navigateToAboutUs() {
    this.router.navigate(['/sobrenosotros']);
  }




  ngOnInit(): void {
  }
}

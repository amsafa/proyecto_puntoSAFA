import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-hero-section-inicio',
  templateUrl: './hero-section-inicio.component.html',
  styleUrls: ['./hero-section-inicio.component.css'],
  standalone: true,
  imports: [
    RouterLink
  ]
})
export class HeroSectionInicioComponent  implements OnInit {

  constructor(private router: Router) {}

  navigateToAboutUs() {
    this.router.navigate(['/sobre-nosotros']);
  }

  ngOnInit(): void {
  }
}

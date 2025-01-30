import {Component, ElementRef, NgIterable, OnInit, ViewChild} from '@angular/core';
import {BookCardComponent} from '../book-card/book-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [
    BookCardComponent,
    NgForOf
  ]
})
export class CarouselComponent  implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;
  autoScrollInterval!: any;

  books = [
    {
      title: 'Libro 1',
      author: 'Autor 1',
      price: 18.95,
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Libro 2',
      author: 'Autor 2',
      price: 22.95,
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Libro 3',
      author: 'Autor 3',
      price: 15.75,
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Libro 4',
      author: 'Autor 4',
      price: 19.99,
      image: 'https://via.placeholder.com/150',
    },
  ];

  ngOnInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    clearInterval(this.autoScrollInterval);
  }

  scrollLeft() {
    const carouselElement = this.carousel.nativeElement;
    carouselElement.scrollBy({
      left: -300, // Ajusta el tamaño del desplazamiento
      behavior: 'smooth',
    });
  }

  scrollRight() {
    const carouselElement = this.carousel.nativeElement;
    carouselElement.scrollBy({
      left: 300, // Ajusta el tamaño del desplazamiento
      behavior: 'smooth',
    });
  }

  //Desplazamiento automático

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      const carouselElement = this.carousel.nativeElement;
      if (
        carouselElement.scrollLeft + carouselElement.offsetWidth >=
        carouselElement.scrollWidth
      ) {
        // Si llega al final, vuelve al inicio
        carouselElement.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Desplaza hacia la derecha
        this.scrollRight();
      }
    }, 3000); // Cambia cada 3 segundos
  }
}

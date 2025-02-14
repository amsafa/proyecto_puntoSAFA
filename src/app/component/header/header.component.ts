import { Component, OnInit, HostListener } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [NgIf, NgClass, RouterLink],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isMenuOpen = false;
  showMenu = false;
  userData: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getAuthState().subscribe((state) => {
      this.isLoggedIn = state;
      if (this.isLoggedIn) {
        this.authService.fetchUserData();
      }
    });

    this.authService.getUserData().subscribe((user) => {
      this.userData = user;
    });
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleAccountMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.showMenu = false;
    this.isMenuOpen = false;
    this.router.navigate(['/home']);
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('nav')) {
      this.isMenuOpen = false;
      this.showMenu = false;
    }
  }
}

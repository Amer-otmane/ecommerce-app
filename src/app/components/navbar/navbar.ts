import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/CartService';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {

  count      = computed(() => this.cartService.cartCount());
  isLoggedIn = computed(() => this.auth.isLoggedIn());
  userName   = computed(() => this.auth.getUser()?.name || '');

  constructor(
    private cartService: CartService,
    private auth:        AuthService,
    private router:      Router
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
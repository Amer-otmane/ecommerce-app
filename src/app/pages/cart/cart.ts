import { Component, computed, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe, DecimalPipe, PercentPipe, LowerCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService } from '../../services/CartService';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, DecimalPipe, PercentPipe, LowerCasePipe],
  templateUrl: './cart.html',
})
export class Cart {

  @ViewChild('cartTitle') cartTitle!: ElementRef;

  cartItems = computed(() => this.cartService.getCart());

  total = computed(() =>
    this.cartService.getCart()
      .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
  );

  ordered = signal<boolean>(false);
  error   = signal<string>('');

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private http:        HttpClient,
    private router:      Router
  ) {}

  increase(item: any) {
    this.cartService.addToCart(item, 1);
  }

  decrease(index: number, item: any) {
    if (item.quantity > 1) {
      this.cartService.decreaseItem(index);
    } else {
      this.cartService.removeItem(index);
    }
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  order() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const items = this.cartItems().map(item => ({
      product_id: item.id,
      quantity:   item.quantity,
      price:      item.price
    }));

    const token   = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:3000/api/orders', { items }, { headers }).subscribe({
      next: (res: any) => {
        console.log('✅ Commande créée:', res);
        this.cartService.clearCart();
        this.ordered.set(true); // ✅ rester sur la page
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.error.set('❌ Erreur commande');
        setTimeout(() => this.error.set(''), 3000);
      }
    });
  }
}
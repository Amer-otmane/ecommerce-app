import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule, CurrencyPipe, UpperCasePipe, TitleCasePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/CartService';
import { Subscription } from 'rxjs';

// ✅ enum TypeScript
enum StockLevel {
  DISPONIBLE = 'disponible',
  LIMITE     = 'limité',
  RUPTURE    = 'rupture'
}

// ✅ type alias union
type PriceRange = 'Économique' | 'Milieu de gamme' | 'Premium';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, UpperCasePipe, TitleCasePipe, DecimalPipe, SlicePipe],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit, OnDestroy {

  product   = signal<any>(null);
  quantity  = signal<number>(1);
  added     = signal<boolean>(false);
  currentId: any = null;

  // ✅ computed() totalPrice
  totalPrice = computed(() =>
    this.product() && this.quantity()
      ? (this.product()?.price * this.quantity()).toFixed(2)
      : 0
  );

  // ✅ tuple [number, string]
  quantityLabel = computed((): [number, string] => {
    const q = this.quantity();
    if (q === 1) return [q, 'unité'];
    if (q <= 5)  return [q, 'unités'];
    return [q, 'unités — quantité importante'];
  });

  // ✅ computed() avec enum StockLevel
  stockLevel = computed((): StockLevel => {
    const stock = this.product()?.stock ?? 0;
    if (stock === 0) return StockLevel.RUPTURE;
    if (stock <= 5)  return StockLevel.LIMITE;
    return StockLevel.DISPONIBLE;
  });

  // ✅ computed() avec type alias union PriceRange
  priceRange = computed((): PriceRange => {
    const price = this.product()?.price ?? 0;
    if (price < 20)  return 'Économique';
    if (price < 100) return 'Milieu de gamme';
    return 'Premium';
  });

  // ✅ exposer l'enum au template
  StockLevel = StockLevel;

  private sub!: Subscription;

  constructor(
    private route:       ActivatedRoute,
    private router:      Router,
    private cartService: CartService,
    private http:        HttpClient
  ) {
    // ✅ effect() avec onCleanup
    effect((onCleanup) => {
      console.log('🛒 Quantité changée:', this.quantity());

      const timer = setTimeout(() => {
        console.log('⏱️ Timer quantité expiré');
      }, 1000);

      // ✅ onCleanup — nettoyage avant réexécution
      onCleanup(() => {
        clearTimeout(timer);
        console.log('🧹 Cleanup effect quantité');
      });
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.currentId = id;

    this.sub = this.http.get(`http://localhost:3000/api/products/${id}`).subscribe({
      next: (data: any) => {
        console.log('✅ DATA:', data);
        this.product.set(data);
      },
      error: (err) => {
        console.error('❌ ERREUR:', err);
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  increase() {
    if (this.quantity() < this.product().stock)
      this.quantity.update(q => q + 1);
  }

  decrease() {
    if (this.quantity() > 1)
      this.quantity.update(q => q - 1);
  }

  addToCart() {
    this.cartService.addToCart(this.product(), this.quantity());
    this.added.set(true);
    this.quantity.set(1);
    setTimeout(() => this.added.set(false), 2000);
  }

  goBack() { this.router.navigate(['/']); }
}
import { 
  Component, OnInit, OnDestroy, signal, computed, 
  AfterViewInit, AfterViewChecked, AfterContentInit,
  AfterContentChecked, DoCheck, ViewChildren, QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/CartService';
import { ProductCard } from '../../components/product-card/product-card';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './home.html',
})
export class Home implements 
  OnInit, OnDestroy,
  AfterViewInit, AfterViewChecked,
  AfterContentInit, AfterContentChecked,
  DoCheck {

  products = signal<any[]>([]);
  private sub!: Subscription;

  // ✅ computed()
  totalProducts = computed(() => this.products().length);

  // ✅ computed() — produits en rupture de stock
  outOfStock = computed(() =>
    this.products().filter((p: any) => p.stock === 0).length
  );

  // ✅ @ViewChildren + QueryList
  @ViewChildren(ProductCard) productCards!: QueryList<ProductCard>;

  constructor(
    private http:        HttpClient,
    private cartService: CartService
  ) {}

  // ✅ ngOnInit
  ngOnInit() {
    this.sub = this.http.get<any>('http://localhost:3000/api/products').subscribe({
      next: (data: any) => { this.products.set(data.products); },
      error: (err)      => { console.error('❌ ERREUR:', err); }
    });
  }

  // ✅ ngDoCheck
  ngDoCheck() {
    console.log('🔍 DoCheck — cycle de détection');
  }

  // ✅ ngAfterContentInit
  ngAfterContentInit() {
    console.log('📦 AfterContentInit Home');
  }

  // ✅ ngAfterContentChecked
  ngAfterContentChecked() {
    console.log('✅ AfterContentChecked Home');
  }

  // ✅ ngAfterViewInit
  ngAfterViewInit() {
    console.log('👁️ AfterViewInit — produits:', this.products().length);
    this.productCards.changes.subscribe((cards: QueryList<ProductCard>) => {
      console.log('🔄 Cartes mises à jour:', cards.length);
    });
  }

  // ✅ ngAfterViewChecked
  ngAfterViewChecked() {
    console.log('🔁 AfterViewChecked Home');
  }

  // ✅ ngOnDestroy
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product, 1);
  }
}
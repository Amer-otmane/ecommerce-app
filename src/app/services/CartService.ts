import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _cart = signal<any[]>([]);

  // ✅ asReadonly()
  cart = this._cart.asReadonly();

  // ✅ computed() — total items
  cartCount = computed(() =>
    this._cart().reduce((total, item) => total + item.quantity, 0)
  );

  // ✅ computed() + Set<string> — categories uniques
  categoriesCount = computed(() => {
    const set = new Set<string>(
      this._cart().map((item: any) => item.category)
    );
    console.log('📦 Catégories uniques:', set);
    return set.size;
  });

  // ✅ computed() + Map<number, any> — index des items par id
  itemsMap = computed(() => {
    const map = new Map<number, any>();
    this._cart().forEach((item: any) => {
      map.set(item.id, item);
    });
    console.log('🗺️ Map des items:', map);
    return map;
  });

  constructor() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const items = JSON.parse(saved);
      const fixed = items.map((item: any) => ({
        ...item,
        quantity: item.quantity ?? 1
      }));
      this._cart.set(fixed);
    }
  }

  // ✅ méthode générique avec contrainte extends
  findItem<T extends { id: number }>(id: number, list: T[]): T | undefined {
    return list.find(item => item.id === id);
  }

  addToCart(product: any, quantity: number = 1) {
    this._cart.update(items => {
      // ✅ utilisation de la méthode générique
      const existing = this.findItem<any>(product.id, items);
      if (existing) {
        return items.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        return [...items, { ...product, quantity }];
      }
    });
    localStorage.setItem('cart', JSON.stringify(this._cart()));
  }

  decreaseItem(index: number) {
    this._cart.update(items =>
      items.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
    localStorage.setItem('cart', JSON.stringify(this._cart()));
  }

  getCart() {
    return this._cart();
  }

  clearCart() {
    this._cart.set([]);
    localStorage.setItem('cart', JSON.stringify(this._cart()));
  }

  removeItem(index: number) {
    this._cart.update(items => items.filter((_, i) => i !== index));
    localStorage.setItem('cart', JSON.stringify(this._cart()));
  }
}
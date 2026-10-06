import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api = 'http://localhost:3000/api/products'; // ← votre backend

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(this.api);
  }

  getProduct(id: number) {
    return this.http.get(`${this.api}/${id}`);
  }
}
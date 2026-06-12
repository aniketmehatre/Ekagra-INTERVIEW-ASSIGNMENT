import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Product } from '../core/mock/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  readonly products = signal<Product[]>([]);

  readonly loading = signal(false);

  readonly totalProducts = computed(() => this.products().length);

  getProducts() {
    this.loading.set(true);

    return this.http.get<{ products: Product[] }>('https://dummyjson.com/products?limit=100').pipe(
      tap((response) => {
        this.products.set(response.products);

        this.loading.set(false);
      }),
    );
  }

  deleteProduct(productId: number): void {
    const previous = this.products();

    this.products.update((products) => products.filter((p) => p.id !== productId));

    setTimeout(() => {
      const failed = Math.random() > 0.8;

      if (failed) {
        alert('Delete failed. Rolling back.');

        this.products.set(previous);
      }
    }, 1000);
  }

  addProduct(product: Product): void {
    this.products.update((products) => [
      {
        ...product,
        id: Date.now(),
        thumbnail: '',
        description: '',
      },

      ...products,
    ]);
  }

  updateProduct(updatedProduct: Product): void {
    this.products.update((products) =>
      products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)),
    );
  }
}

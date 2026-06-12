import { Component, OnInit, inject, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductStore } from '../../../services/product.store';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../core/models/product.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly store = inject(ProductStore);
  private readonly cartService = inject(CartService);

  readonly selectedProduct = signal<Product | null>(null);
  readonly quantity = signal(1);
  readonly loading = signal(false);
  readonly relatedProducts = computed(() => {
    const product = this.selectedProduct();
    if (!product) {
      return [];
    }

    return this.store
      .products()
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!id) {
        this.router.navigate(['/shop']);
        return;
      }

      const existing = this.store.products().find((product) => product.id === id);

      if (existing) {
        this.selectedProduct.set(existing);
        return;
      }

      this.loading.set(true);
      this.productService
        .getProduct(id)
        .pipe(take(1))
        .subscribe({
          next: (product) => {
            this.selectedProduct.set(product);
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
            this.router.navigate(['/shop']);
          },
        });
    });
  }

  onAddToCart(): void {
    const product = this.selectedProduct();
    if (!product || product.stock <= 0) {
      return;
    }

    this.cartService.addItem(product, this.quantity());
  }

  updateQuantity(value: string): void {
    const parsed = Number(value);
    this.quantity.set(parsed > 0 ? parsed : 1);
  }
}

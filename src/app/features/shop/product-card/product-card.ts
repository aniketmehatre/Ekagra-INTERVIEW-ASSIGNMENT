import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() inCartCount = 0;
  @Output() addToCart = new EventEmitter<number>();

  // OnPush is used here because each product card depends only on its input properties.
  // This keeps the card rendering efficient when the parent list refreshes or when other
  // cards receive stock updates through shared state.

  get isOutOfStock(): boolean {
    return this.product.stock <= 0;
  }

  get statusClass(): string {
    if (this.product.stock <= 0) {
      return 'status-out-of-stock';
    }
    if (this.product.stock <= 5) {
      return 'status-low-stock';
    }
    return 'status-in-stock';
  }

  onAddToCart(): void {
    if (this.isOutOfStock) {
      return;
    }

    this.addToCart.emit(1);
  }
}

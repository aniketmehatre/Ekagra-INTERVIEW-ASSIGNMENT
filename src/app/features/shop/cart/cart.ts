import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  private readonly cartService = inject(CartService);

  readonly items = this.cartService.items;
  readonly itemCount = this.cartService.itemCount;

  get subtotal(): number {
    return this.cartService.subtotal;
  }

  updateQuantity(productId: number, value: string): void {
    const quantity = Number(value);
    if (Number.isNaN(quantity) || quantity < 1) {
      return;
    }

    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }
}

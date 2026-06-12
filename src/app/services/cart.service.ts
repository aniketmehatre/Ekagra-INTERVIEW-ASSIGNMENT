import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../core/models/product.model';
import { CartItem } from '../core/models/cart.model';

const CART_STORAGE_KEY = 'platform_commons_cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly items = signal<CartItem[]>(this.loadCart());

  readonly itemCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));

  addItem(product: Product, quantity: number): void {
    const updatedItems = [...this.items()];
    const existingIndex = updatedItems.findIndex((item) => item.product.id === product.id);

    if (existingIndex >= 0) {
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: Math.min(product.stock, updatedItems[existingIndex].quantity + quantity),
      };
    } else {
      updatedItems.push({ product, quantity });
    }

    this.saveItems(updatedItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    const updatedItems = this.items().map((item) =>
      item.product.id === productId
        ? { ...item, quantity: Math.min(item.product.stock, Math.max(1, quantity)) }
        : item,
    );

    this.saveItems(updatedItems);
  }

  removeItem(productId: number): void {
    const updatedItems = this.items().filter((item) => item.product.id !== productId);
    this.saveItems(updatedItems);
  }

  clearCart(): void {
    this.saveItems([]);
  }

  get subtotal(): number {
    return this.items().reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  private saveItems(items: CartItem[]): void {
    this.items.set(items);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  private loadCart(): CartItem[] {
    const stored = localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
  }
}

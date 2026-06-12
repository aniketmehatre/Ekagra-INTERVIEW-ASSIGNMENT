import { Pipe, PipeTransform } from '@angular/core';
import { CartItem } from '../../core/models/cart.model';

@Pipe({
  name: 'totals',
  pure: true,
})
export class TotalsPipe implements PipeTransform {
  transform(items: CartItem[], taxRate: number): { subtotal: number; tax: number; total: number } {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }
}

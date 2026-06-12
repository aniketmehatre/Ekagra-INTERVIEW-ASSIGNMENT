import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderPayload {
  userId: number;
  total: number;
  discountedTotal?: number;
  products: Array<{ id: number; quantity: number }>;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly ORDERS_URL = 'https://dummyjson.com/carts';

  submitOrder(payload: OrderPayload): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.ORDERS_URL}/add`, payload);
  }
}

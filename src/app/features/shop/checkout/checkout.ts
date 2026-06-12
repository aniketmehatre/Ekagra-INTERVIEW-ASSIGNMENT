import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CheckoutStateService } from '../../../services/checkout-state.service';
import { OrderService } from '../../../services/order.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly checkoutState = inject(CheckoutStateService);
  private readonly orderService = inject(OrderService);

  readonly currentStep = signal(1);
  readonly orderId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly items = this.cartService.items;
  readonly total = computed(() => this.cartService.subtotal);

  readonly shippingForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern('^[0-9A-Za-z-]{3,10}$')]],
    country: ['', Validators.required],
  });

  readonly paymentForm = this.fb.nonNullable.group({
    cardholderName: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]{13,19}$')]],
    expiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/(?:[0-9]{2})$')]],
    cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const order = params.get('id');
      const step = Number(params.get('n')) || 1;

      if (order) {
        this.orderId.set(Number(order));
        return;
      }

      this.currentStep.set(step >= 1 && step <= 3 ? step : 1);
    });
  }

  completeStepOne(): void {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    this.checkoutState.completeStepOne();
    void this.router.navigate(['/shop/checkout/step/2']);
  }

  completeStepTwo(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.checkoutState.completeStepTwo();
    void this.router.navigate(['/shop/checkout/step/3']);
  }

  placeOrder(): void {
    if (this.items().length === 0) {
      void this.router.navigate(['/shop']);
      return;
    }

    const payload = {
      userId: 1,
      total: this.total(),
      products: this.items().map((item) => ({ id: item.product.id, quantity: item.quantity })),
      user: {
        name: this.shippingForm.controls.fullName.value,
        email: this.shippingForm.controls.email.value,
        phone: this.shippingForm.controls.phone.value,
        address: `${this.shippingForm.controls.addressLine1.value} ${this.shippingForm.controls.addressLine2.value}, ${this.shippingForm.controls.city.value}, ${this.shippingForm.controls.postalCode.value}, ${this.shippingForm.controls.country.value}`,
      },
    };

    this.loading.set(true);
    this.errorMessage.set('');

    this.orderService
      .submitOrder(payload)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.cartService.clearCart();
          this.checkoutState.reset();
          this.loading.set(false);
          void this.router.navigate(['/shop/order-confirmation', response.id]);
        },
        error: () => {
          this.errorMessage.set('Unable to place order. Please try again.');
          this.loading.set(false);
        },
      });
  }
}

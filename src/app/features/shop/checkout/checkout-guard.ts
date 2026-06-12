import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CheckoutStateService } from '../../../services/checkout-state.service';

export const checkoutGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const cartService = inject(CartService);
  const checkoutState = inject(CheckoutStateService);

  const step = Number(route.paramMap.get('n'));

  if (cartService.items().length === 0) {
    router.navigate(['/shop']);
    return false;
  }

  if (step === 2 && !checkoutState.stepOneCompleted()) {
    router.navigate(['/shop/checkout/step/1']);
    return false;
  }

  if (step === 3 && !checkoutState.stepTwoCompleted()) {
    router.navigate(['/shop/checkout/step/2']);
    return false;
  }

  return true;
}

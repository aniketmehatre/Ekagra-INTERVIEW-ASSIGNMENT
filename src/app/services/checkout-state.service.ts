import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CheckoutStateService {
  readonly stepOneCompleted = signal(false);
  readonly stepTwoCompleted = signal(false);

  completeStepOne(): void {
    this.stepOneCompleted.set(true);
  }

  completeStepTwo(): void {
    this.stepTwoCompleted.set(true);
  }

  reset(): void {
    this.stepOneCompleted.set(false);
    this.stepTwoCompleted.set(false);
  }
}

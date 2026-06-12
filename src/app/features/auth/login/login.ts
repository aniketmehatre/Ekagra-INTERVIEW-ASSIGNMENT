import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SkeletonLoaderComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],

  // OnPush minimizes unnecessary
  // change detection cycles because
  // this screen is form-driven and
  // state updates are explicit.

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);

    const { email, password } = this.loginForm.getRawValue();

    this.authService
      .login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          this.loading.set(false);

          if (!success) {
            this.errorMessage.set('Invalid email or password');

            return;
          }

          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

          const role = this.authService.role();

          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);

            return;
          }

          if (role === 'admin') {
            this.router.navigate(['/admin/products']);

            return;
          }

          this.router.navigate(['/shop']);
        },

        error: () => {
          this.loading.set(false);

          this.errorMessage.set('Something went wrong');
        },
      });
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }
}

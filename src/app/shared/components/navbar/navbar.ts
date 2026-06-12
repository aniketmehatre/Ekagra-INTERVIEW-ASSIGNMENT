import {
  Component,
  inject
} from '@angular/core';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
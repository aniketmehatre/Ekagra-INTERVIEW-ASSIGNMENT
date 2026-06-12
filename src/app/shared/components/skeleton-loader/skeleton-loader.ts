import { Component, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type SkeletonType = 'row' | 'circle' | 'text' | 'card';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.html',
  styleUrl: './skeleton-loader.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLoaderComponent {
  @Input() type: SkeletonType = 'text';
  @Input() count: number = 3;
  @Input() rows: number = 1;

  readonly items = Array.from({ length: this.count }, (_, i) => i);
  readonly rowItems = Array.from({ length: this.rows }, (_, i) => i);
}


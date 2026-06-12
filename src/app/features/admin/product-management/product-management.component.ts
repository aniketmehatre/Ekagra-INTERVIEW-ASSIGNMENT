import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  effect,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductStore } from '../../../services/product.store';
import { Product } from '../../../core/models/product.model';
import { ProductFormComponent } from '../product-form/product-form';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductFormComponent,
    SkeletonLoaderComponent,
  ],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManagementComponent implements OnInit {
  private readonly store = inject(ProductStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  // Local signals
  readonly showForm = signal(false);
  readonly searchInput = signal('');
  readonly categoryFilter = signal('all');

  // Store signals
  readonly products = this.store.products;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly categories = this.store.categories;
  readonly selectedProduct = this.store.selectedProduct;
  readonly filteredProducts = this.store.filteredProducts;
  readonly totalProducts = this.store.totalProducts;

  // Computed signals
  readonly categoriesWithAll = computed(() => {
    const cats = this.categories();
    return cats.length > 0 ? ['all', ...cats] : ['all'];
  });

  constructor() {
    // Setup search with debounce
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.store.setSearchQuery(query);
      });
  }

  ngOnInit(): void {
    // Store already loads products in its constructor
  }

  onSearchChange(query: string): void {
    this.searchInput.set(query);
    this.searchSubject.next(query);
  }

  onCategoryChange(category: string): void {
    this.categoryFilter.set(category);
    this.store.setSelectedCategory(category);
  }

  openAddForm(): void {
    this.store.setSelectedProduct(null);
    this.showForm.set(true);
  }

  openEditForm(product: Product): void {
    this.store.setSelectedProduct(product);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.store.setSelectedProduct(null);
  }

  onSaveProduct(productData: Omit<Product, 'id'>): void {
    const selected = this.store.selectedProduct();

    if (selected) {
      this.store.updateProduct({
        ...productData,
        id: selected.id,
      } as Product);
    } else {
      this.store.addProduct(productData);
    }

    this.closeForm();
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.store.deleteProduct(id);
    }
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
  }

  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'badge-danger';
    if (stock <= 5) return 'badge-warning';
    return 'badge-success';
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }
}

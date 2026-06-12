import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader';
import { ProductStore } from '../../../services/product.store';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent, SkeletonLoaderComponent],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  private readonly store = inject(ProductStore);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = this.store.loading;
  readonly categories = this.store.categories;
  readonly products = this.store.catalogFilteredProducts;
  readonly priceRange = this.store.catalogPriceRange;
  readonly inStockOnly = this.store.catalogInStockOnly;
  readonly searchQuery = this.store.catalogSearchQuery;
  readonly selectedCategories = this.store.catalogSelectedCategories;
  readonly itemCount = this.cartService.itemCount;
  readonly localPriceRange = signal({ min: 0, max: 0 });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const category = params.getAll('category');
      const query = params.get('query') ?? '';
      const min = Number(params.get('min') ?? 0);
      const max = Number(params.get('max') ?? 0);
      const inStock = params.get('inStock') === 'true';

      this.store.catalogSearchQuery.set(query);
      this.store.catalogSelectedCategories.set(category.filter((value) => value !== ''));
      this.store.catalogPriceRange.set({ min, max });
      this.store.catalogInStockOnly.set(inStock);
      this.localPriceRange.set({ min, max });
    });

    const initialMin = this.store.catalogMinPrice();
    const initialMax = this.store.catalogMaxPrice();
    this.store.catalogPriceRange.set({ min: initialMin, max: initialMax });
    this.localPriceRange.set({ min: initialMin, max: initialMax });
  }

  toggleCategory(category: string): void {
    if (category === 'all') {
      this.store.catalogSelectedCategories.set([]);
      this.syncQueryParams();
      return;
    }

    const values = [...this.selectedCategories()];
    const index = values.indexOf(category);

    if (index >= 0) {
      values.splice(index, 1);
    } else {
      values.push(category);
    }

    this.store.catalogSelectedCategories.set(values);
    this.syncQueryParams();
  }

  trackByCategory(_index: number, category: string): string {
    return category;
  }

  onQueryChange(value: string): void {
    this.store.catalogSearchQuery.set(value);
    this.syncQueryParams();
  }

  onPriceRangeChange(): void {
    this.store.catalogPriceRange.set(this.localPriceRange());
    this.syncQueryParams();
  }

  updateLocalPriceRange(field: 'min' | 'max', value: number): void {
    const nextValue = Number.isFinite(value) ? value : 0;

    this.localPriceRange.update((range) => ({
      ...range,
      [field]: nextValue,
    }));
  }

  onStockToggle(): void {
    this.store.catalogInStockOnly.set(!this.inStockOnly());
    this.syncQueryParams();
  }

  syncQueryParams(): void {
    const min = this.priceRange().min;
    const max = this.priceRange().max;

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        query: this.searchQuery() || null,
        category: this.selectedCategories().length ? this.selectedCategories() : null,
        min: min || null,
        max: max || null,
        inStock: this.inStockOnly() ? 'true' : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  addToCart(product: Product, quantity: number): void {
    this.cartService.addItem(product, quantity);
  }
 
  trackByProduct(_index: number, product: Product): number {
    return product.id;
  }
}

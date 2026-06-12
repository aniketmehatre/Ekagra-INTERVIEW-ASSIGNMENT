import {
  DestroyRef,
  Injectable,
  inject,
  signal,
  computed,
} from '@angular/core';
import { interval, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from './product.service';
import { Product } from '../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  // Signals
  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly selectedProduct = signal<Product | null>(null);
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('all');
  readonly categories = signal<string[]>([]);
  readonly catalogSearchQuery = signal<string>('');
  readonly catalogSelectedCategories = signal<string[]>([]);
  readonly catalogPriceRange = signal<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  readonly catalogInStockOnly = signal<boolean>(false);

  // Computed signals
  readonly filteredProducts = computed(() => {
    const products = this.products();
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();

    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || product.category === category;

      return matchesSearch && matchesCategory;
    });
  });

  readonly catalogFilteredProducts = computed(() => {
    const products = this.products();
    const query = this.catalogSearchQuery().toLowerCase();
    const selectedCategories = this.catalogSelectedCategories();
    const { min, max } = this.catalogPriceRange();
    const inStockOnly = this.catalogInStockOnly();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchesPrice =
        product.price >= min && (max === 0 || product.price <= max);

      const matchesStock = !inStockOnly || product.stock > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });
  });

  readonly catalogMinPrice = computed(() => {
    const prices = this.products().map((product) => product.price);
    return prices.length ? Math.min(...prices) : 0;
  });

  readonly catalogMaxPrice = computed(() => {
    const prices = this.products().map((product) => product.price);
    return prices.length ? Math.max(...prices) : 0;
  });

  readonly totalProducts = computed(() => this.filteredProducts().length);

  constructor() {
    // Load products and categories on initialization
    this.loadProducts();
    this.loadCategories();
    this.startStockSimulation();
  }

  /**
   * Load all products from API
   */
  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .getProducts()
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.products.set(response.products);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load products');
          this.loading.set(false);
          console.error('Error loading products:', err);
        },
      });
  }

  /**
   * Load all categories from API
   */
  loadCategories(): void {
    this.productService
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
        },
        error: (err) => {
          console.error('Error loading categories:', err);
        },
      });
  }

  /**
   * Update search query
   */
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  /**
   * Update selected category
   */
  setSelectedCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  /**
   * Set selected product for editing
   */
  setSelectedProduct(product: Product | null): void {
    this.selectedProduct.set(product);
  }

  /**
   * Add a new product
   */
  addProduct(product: Omit<Product, 'id'>): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .addProduct({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        thumbnail: product.thumbnail,
      })
      .pipe(take(1))
      .subscribe({
        next: (newProduct) => {
          this.products.update((products) => [newProduct, ...products]);
          this.loading.set(false);
          this.selectedProduct.set(null);
        },
        error: (err) => {
          this.error.set('Failed to add product');
          this.loading.set(false);
          console.error('Error adding product:', err);
        },
      });
  }

  /**
   * Update an existing product
   */
  updateProduct(product: Product): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .updateProduct({
        id: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        thumbnail: product.thumbnail,
      })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (updatedProduct) => {
          this.products.update((products) =>
            products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
          );
          this.loading.set(false);
          this.selectedProduct.set(null);
        },
        error: (err) => {
          this.error.set('Failed to update product');
          this.loading.set(false);
          console.error('Error updating product:', err);
        },
      });
  }

  /**
   * Delete a product (optimistic update)
   */
  deleteProduct(id: number): void {
    const previousProducts = this.products();
    this.products.update((products) => products.filter((p) => p.id !== id));

    this.productService
      .deleteProduct(id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.log('Product deleted successfully');
        },
        error: (err) => {
          this.products.set(previousProducts);
          this.error.set('Failed to delete product');
          console.error('Error deleting product:', err);
        },
      });
  }

  /**
   * Reset store state
   */
  reset(): void {
    this.products.set([]);
    this.loading.set(false);
    this.error.set(null);
    this.selectedProduct.set(null);
    this.searchQuery.set('');
    this.selectedCategory.set('all');
  }

  private startStockSimulation(): void {
    interval(3200)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const visibleIds = new Set(this.filteredProducts().map((product) => product.id));
        if (visibleIds.size === 0) {
          return;
        }

        const updatedProducts = this.products().map((product) => {
          if (!visibleIds.has(product.id)) {
            return product;
          }

          if (Math.random() > 0.6) {
            const delta = Math.floor(Math.random() * 5) - 2;
            const stock = Math.max(0, product.stock + delta);
            return stock === product.stock ? product : { ...product, stock };
          }

          return product;
        });

        this.products.set(updatedProducts);
      });
  }
}

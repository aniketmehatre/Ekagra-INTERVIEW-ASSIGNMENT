import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay } from 'rxjs';
import { Product, ProductsResponse, CreateProductDTO, UpdateProductDTO } from '../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://dummyjson.com/products';

  /**
   * Fetch all products from the API
   */
  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.API_URL);
  }

  /**
   * Fetch products with limit and skip for pagination
   */
  getProductsWithPagination(limit: number = 30, skip: number = 0): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.API_URL}?limit=${limit}&skip=${skip}`);
  }

  /**
   * Search products by title
   */
  searchProducts(query: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.API_URL}/search?q=${query}`);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`https://dummyjson.com/products/category/${category}`);
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('https://dummyjson.com/products/categories');
  }

  /**
   * Get a single product by ID
   */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  /**
   * Add a new product (local only - API doesn't support this)
   */
  addProduct(product: CreateProductDTO): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/add`, product).pipe(delay(500));
  }

  /**
   * Update an existing product (local only - API doesn't support full update)
   */
  updateProduct(product: UpdateProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${product.id}`, product).pipe(delay(500));
  }

  /**
   * Delete a product (local only - API doesn't support delete)
   */
  deleteProduct(id: number): Observable<{ id: number; isDeleted: boolean; deletedOn: string }> {
    return this.http.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(
      `${this.API_URL}/${id}`,
    ).pipe(delay(500));
  }
}

/**
 * Product Model Interfaces
 * Used throughout the application for type safety
 */

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
  rating?: number;
  reviewCount?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateProductDTO {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

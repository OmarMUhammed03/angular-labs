import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

/**
 * Resolver: fetches all products before route activation
 * Ensures data is available before component renders
 */
export const productsResolver: ResolveFn<Product[]> = (route, state) => {
  const productService = inject(ProductService);
  return productService.getProductsObservable(20);
};

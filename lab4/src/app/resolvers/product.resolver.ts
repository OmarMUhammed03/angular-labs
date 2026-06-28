import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Resolver: fetches products (will be filtered by component by ID)
 */
export const productResolver: ResolveFn<Product[] | null> = (route, state) => {
  const productService = inject(ProductService);
  return productService.getProductsObservable(100).pipe(
    catchError(() => of(null))
  );
};

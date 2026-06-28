import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, shareReplay } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.escuelajs.co/api/v1/products';

  /** Reactive limit — changing this re-fetches automatically */
  readonly limit = signal(20);

  /** Signal-based product list: re-fetches whenever limit changes */
  readonly products = toSignal(
    toObservable(this.limit).pipe(
      switchMap(limit =>
        this.http.get<Product[]>(`${this.apiUrl}?limit=${limit}`)
      )
    ),
    { initialValue: [] as Product[] }
  );

  readonly isLoading = computed(() => this.products().length === 0);

  setLimit(limit: number): void {
    this.limit.set(limit);
  }

  /**
   * Observable version for resolvers and one-shot fetches
   * Used by route resolvers
   */
  getProductsObservable(limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?limit=${limit}`).pipe(
      shareReplay(1)
    );
  }

  /**
   * Get a single product by ID
   * In a real app, would call /products/:id
   */
  getProductById(id: number | string): Observable<Product | null> {
    // For demo: fetch all and filter (not ideal for production)
    return this.getProductsObservable(100).pipe(
      switchMap(products => {
        const found = products.find(p => p.id === +id) ?? null;
        return [found];
      })
    );
  }

  /**
   * Create a new product (mock - returns generated product)
   */
  createProduct(data: Partial<Product>): Observable<Product> {
    // Mock: Generate a new product with random ID
    const newProduct: Product = {
      id: Math.floor(Math.random() * 10000),
      title: data.title || '',
      price: data.price || 0,
      description: data.description || '',
      category: data.category || { id: 1, name: 'General', image: '' },
      images: data.images || []
    };
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(newProduct);
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Update an existing product (mock)
   */
  updateProduct(id: number | string, data: Partial<Product>): Observable<Product> {
    // Mock: Return updated product
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          id: +id,
          title: data.title || '',
          price: data.price || 0,
          description: data.description || '',
          category: data.category || { id: 1, name: 'General', image: '' },
          images: data.images || []
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Delete a product (mock)
   */
  deleteProduct(id: number | string): Observable<{ success: boolean }> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 800);
    });
  }
}

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
}

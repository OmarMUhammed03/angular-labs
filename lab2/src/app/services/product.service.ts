import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { Product } from '../models/product.model';

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
}

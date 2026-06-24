import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem, CartItemView } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  /** Source-of-truth: private writable signal */
  private readonly _items = signal<CartItem[]>([]);

  /** Public read-only view of raw items */
  readonly items = this._items.asReadonly();

  /**
   * Derived signal: each item enriched with:
   *  - itemTotal  (quantity × price, 2 dp)
   */
  readonly itemViews = computed<CartItemView[]>(() =>
    this._items().map(item => ({
      ...item,
      itemTotal: +(item.product.price * item.quantity).toFixed(2),
    }))
  );

  /** Sum of all quantities */
  readonly totalCount = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  /** Number of distinct product lines */
  readonly lineCount = computed(() => this._items().length);

  /** Grand total (sum of all itemTotals) */
  readonly grandTotal = computed(() =>
    +this._items()
      .reduce((sum, i) => sum + i.product.price * i.quantity, 0)
      .toFixed(2)
  );

  // ── Mutations ──────────────────────────────────────────────────────────

  addToCart(product: Product): void {
    this._items.update(items => {
      const exists = items.some(i => i.product.id === product.id);
      if (exists) {
        return items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number): void {
    this._items.update(items => items.filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }

  clearCart(): void {
    this._items.set([]);
  }
}

import { Component, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService    = inject(CartService);

  /** Reactive signals from services — no subscriptions needed */
  readonly products  = this.productService.products;
  readonly isLoading = this.productService.isLoading;

  /** Brief visual feedback after adding to cart */
  readonly lastAdded = signal<number | null>(null);

  /** Set of product IDs currently in the cart — for badge/button state */
  readonly inCartIds = computed(() =>
    new Set(this.cartService.items().map(i => i.product.id))
  );

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.lastAdded.set(product.id);
    setTimeout(() => this.lastAdded.set(null), 1500);
  }
}

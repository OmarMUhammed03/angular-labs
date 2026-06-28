import { Component, inject, signal, computed, input } from '@angular/core';
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
  private readonly cartService = inject(CartService);

  /** Signal inputs — can be overridden by parent */
  products = input<Product[]>([]);
  isLoading = input<boolean>(false);

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

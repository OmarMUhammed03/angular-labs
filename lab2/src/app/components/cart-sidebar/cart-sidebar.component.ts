import { Component, input, output, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';

@Component({
  selector: 'app-cart-sidebar',
  imports: [CurrencyPipe, CartItemComponent],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.scss'
})
export class CartSidebarComponent {
  /** Signal input — open/close state driven by parent */
  isOpen = input.required<boolean>();

  /** Output event — request to close */
  close = output<void>();

  private readonly cartService = inject(CartService);

  // ── Expose service signals directly to the template ──────────────────
  readonly itemViews  = this.cartService.itemViews;   // CartItemView[]
  readonly totalCount = this.cartService.totalCount;  // sum of quantities
  readonly lineCount  = this.cartService.lineCount;   // distinct product lines
  readonly grandTotal = this.cartService.grandTotal;  // grand total price
  readonly isEmpty    = computed(() => this.lineCount() === 0);

  // ── Event handlers ────────────────────────────────────────────────────
  onQuantityChange(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  onRemove(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  onClear(): void {
    this.cartService.clearCart();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.close.emit();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close.emit();
    }
  }
}

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
  isOpen = input.required<boolean>();
  close = output<void>();

  private readonly cartService = inject(CartService);

  readonly items = this.cartService.items;
  readonly totalPrice = this.cartService.totalPrice;
  readonly isEmpty = computed(() => this.items().length === 0);

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

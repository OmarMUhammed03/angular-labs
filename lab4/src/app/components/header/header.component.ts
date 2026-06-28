import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartSidebarComponent } from '../cart-sidebar/cart-sidebar.component';

@Component({
  selector: 'app-header',
  imports: [CartSidebarComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);

  readonly cartCount = this.cartService.totalCount;
  readonly isCartOpen = signal(false);

  toggleCart(): void {
    this.isCartOpen.update(v => !v);
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }
}

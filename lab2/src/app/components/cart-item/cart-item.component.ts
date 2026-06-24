import { Component, input, output, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItemView } from '../../models/product.model';

@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  /** Full enriched item (product + quantity + itemTotal) via signal input */
  item = input.required<CartItemView>();

  /** Emits the new desired quantity (caller decides add / remove) */
  quantityChange = output<number>();

  /** Emits when the user removes this line */
  remove = output<void>();

  // Derived presentational signals
  readonly title     = computed(() => this.item().product.title);
  readonly unitPrice = computed(() => this.item().product.price);
  readonly qty       = computed(() => this.item().quantity);
  readonly lineTotal = computed(() => this.item().itemTotal);
  readonly imageUrl  = computed(() => {
    const raw = this.item().product.images[0] ?? '';
    const cleaned = raw.replace(/[\[\]"]/g, '').trim();
    return cleaned.startsWith('http')
      ? cleaned
      : 'https://placehold.co/64x64?text=?';
  });
}

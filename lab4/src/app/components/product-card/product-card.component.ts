import { Component, input, output, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyFormatPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  /** Signal inputs */
  product   = input.required<Product>();
  inCart    = input(false);
  justAdded = input(false);

  /** Signal output */
  addToCart = output<Product>();

  /** Derived signals for the template */
  readonly imageUrl = computed(() => {
    const raw     = this.product().images[0] ?? '';
    const cleaned = raw.replace(/[\[\]"]/g, '').trim();
    return cleaned.startsWith('http')
      ? cleaned
      : 'https://placehold.co/400x300?text=No+Image';
  });

  readonly btnLabel = computed(() =>
    this.justAdded()
      ? '✓ Added!'
      : this.inCart()
      ? 'Add More'
      : '+ Add to Cart'
  );
}

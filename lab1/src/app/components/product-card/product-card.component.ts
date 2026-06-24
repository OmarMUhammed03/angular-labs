import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();

  getImage(): string {
    const img = this.product().images[0];
    if (!img) return 'https://placehold.co/400x300?text=No+Image';
    // Clean escaped JSON strings the API sometimes returns
    const cleaned = img.replace(/[\[\]"]/g, '').trim();
    return cleaned.startsWith('http') ? cleaned : 'https://placehold.co/400x300?text=No+Image';
  }
}

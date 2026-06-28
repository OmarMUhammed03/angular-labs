import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight.directive';
import { UnlessDirective } from '../../directives/unless.directive';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule,
    HighlightDirective,
    UnlessDirective,
    CurrencyFormatPipe
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  /** Resolved product data from resolver */
  readonly product = toSignal(
    this.route.data as any,
    { initialValue: {} as Record<string, any> }
  );

  /** Extract product from resolved data */
  readonly currentProduct = computed(() => {
    const data = this.product() as Record<string, any>;
    const resolved = data?.['product'];
    // Find product by ID from resolved list
    if (resolved && Array.isArray(resolved)) {
      const id = this.route.snapshot.paramMap.get('id');
      return resolved.find((p: Product) => p.id === +id!) ?? null;
    }
    return null;
  });

  readonly isLoading = computed(() => !this.currentProduct());
  readonly justAdded = signal(false);

  readonly imageUrl = computed(() => {
    const img = this.currentProduct()?.images[0] ?? '';
    const cleaned = img.replace(/[\[\]"]/g, '').trim();
    return cleaned.startsWith('http')
      ? cleaned
      : 'https://placehold.co/600x400?text=Product';
  });

  cleanImageUrl(url: string): string {
    return url.replace(/[\[\]"]/g, '').trim();
  }

  onAddToCart(): void {
    const prod = this.currentProduct();
    if (prod) {
      this.cartService.addToCart(prod);
      this.justAdded.set(true);
      setTimeout(() => this.justAdded.set(false), 2000);
    }
  }

  onGoBack(): void {
    this.router.navigate(['/products']);
  }
}

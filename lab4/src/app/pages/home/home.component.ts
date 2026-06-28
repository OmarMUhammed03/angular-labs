import { Component, inject, signal, computed } from '@angular/core';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [ProductListComponent],
  template: `
    <app-product-list
      [products]="products()"
      [isLoading]="isLoading()"
    />
  `
})
export class HomeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  /** Get resolved data from resolver if available, else use service signal */
  readonly resolvedProducts = toSignal(
    this.route.data,
    { initialValue: {} as any }
  );

  readonly products = computed(() => {
    const resolved = this.resolvedProducts().products;
    return resolved ?? this.productService.products();
  });

  readonly isLoading = this.productService.isLoading;
}

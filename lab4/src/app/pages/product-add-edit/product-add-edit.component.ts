import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-add-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-add-edit.component.html',
  styleUrl: './product-add-edit.component.scss'
})
export class ProductAddEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly route_data = toSignal(this.route.data as any, {
    initialValue: {} as Record<string, any>
  });

  readonly isEditMode = computed(() => {
    const data = this.route_data() as Record<string, any>;
    return !!(data && data['product']);
  });

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: ['', [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    categoryName: ['', Validators.required],
    images: ['']
  });

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal(false);

  constructor() {
    // Pre-fill form if editing
    if (this.isEditMode()) {
      const data = this.route_data() as Record<string, any>;
      const product = data['product'];
      if (product) {
        this.form.patchValue({
          title: product.title,
          price: product.price,
          description: product.description,
          categoryName: product.category?.name || ''
        });
      }
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const formValue = this.form.value;
    const payload = {
      title: formValue.title || '',
      price: parseFloat(formValue.price as string) || 0,
      description: formValue.description || '',
      category: {
        id: 1,
        name: formValue.categoryName || '',
        image: ''
      },
      images: formValue.images ? [formValue.images] : []
    };

    const request$ = this.isEditMode()
      ? this.productService.updateProduct(this.getProductId(), payload)
      : this.productService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.submitError.set(
          this.isEditMode()
            ? 'Failed to update product. Please try again.'
            : 'Failed to create product. Please try again.'
        );
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  private getProductId(): string {
    const data = this.route_data() as Record<string, any>;
    const products = data['product'];
    if (Array.isArray(products)) {
      const id = this.route.snapshot.paramMap.get('id');
      const product = products.find((p: Product) => p.id === +id!);
      return product?.id.toString() || '0';
    }
    return '0';
  }
}

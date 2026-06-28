import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

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

  readonly route_data = toSignal(this.route.data as any, { initialValue: {} as Record<string, any> });
  readonly isEditMode = computed(() => {
    const data = this.route_data() as Record<string, any>;
    return !!(data && data['product']);
  });

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: ['', [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    categoryName: ['', Validators.required],
    images: ['']
  });

  readonly isSubmitting = signal(false);

  constructor() {
    // Initialize form with product data if editing
    if (this.isEditMode()) {
      const data = this.route_data() as Record<string, any>;
      const product = data['product'];
      if (product) {
        this.form.patchValue({
          title: product.title,
          price: product.price,
          description: product.description,
          categoryName: product.category.name
        });
      }
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate(['/products']);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}

# Implementation Guide - Lab 3: Advanced Angular Features

This guide explains every advanced feature implemented in Lab 3.

---

## 1. Custom Pipe: `currencyFormat`

### Location
`src/app/pipes/currency-format.pipe.ts`

### What It Does
Transforms a number into a formatted currency string with customizable symbol and decimal places.

### Implementation Details

```typescript
@Pipe({
  name: 'currencyFormat',
  pure: true  // Can be optimized by change detection
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, symbol: string = '$', decimals: number = 2): string {
    // Validation
    if (value === null || value === undefined) return '';
    if (typeof value !== 'number' || isNaN(value)) return '';

    // Format with locale
    const formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    // Determine prefix vs suffix
    return symbol.length > 2
      ? `${symbol} ${formatted}`     // "USD 1,234.50"
      : `${symbol}${formatted}`;     // "$1,234.50"
  }
}
```

### Usage

```html
<!-- In ProductCard component -->
{{ product.price | currencyFormat:'$':2 }}
<!-- Output: $99.99 -->

<!-- In ProductDetails component -->
{{ currentProduct()?.price | currencyFormat:'$':2 }}
<!-- Output: $99.99 -->

<!-- With different currencies -->
{{ price | currencyFormat:'€':0 }}    <!-- €1,235 -->
{{ price | currencyFormat:'USD':2 }}  <!-- USD 1,234.50 -->
```

### Key Concepts
- **Pure pipe**: Angular can cache the result for identical inputs
- **Named parameters** with defaults for flexibility
- **Locale-aware formatting** using `toLocaleString()`
- **Symbol handling**: Long symbols (3+ chars) are treated as currency codes

---

## 2. Custom Attribute Directive: `appHighlight`

### Location
`src/app/directives/highlight.directive.ts`

### What It Does
Adds a background color and styling to any element. Updates reactively when the color changes.

### Implementation Details

```typescript
@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.padding]': '"2px 4px"',
    '[style.border-radius]': '"4px"',
    '[style.font-weight]': '"500"',
    '[style.display]': '"inline-block"'
  }
})
export class HighlightDirective {
  // Signal input with alias
  color = input<string>('yellow', { alias: 'appHighlightColor' });

  constructor(private el: ElementRef<HTMLElement>) {
    // Reactive effect: updates DOM whenever color changes
    effect(() => {
      this.el.nativeElement.style.backgroundColor = this.color();
    });
  }
}
```

### Key Features
1. **Host bindings** for static styling (padding, border-radius, etc.)
2. **Signal input** with alias: `appHighlightColor`
3. **Effect** for reactive updates
4. **ElementRef** for direct DOM access

### Usage

```html
<!-- In ProductDetailsComponent -->
<span
  class="product-category"
  appHighlight
  appHighlightColor="#e0e7ff"
>
  {{ currentProduct()?.category.name }}
</span>

<!-- With dynamic color (uses signal) -->
<span appHighlight [appHighlightColor]="dynamicColor()">
  Dynamic Highlight
</span>
```

### Why Signals + Effect?
The `effect()` tracks the `color()` signal. When the color changes, the effect re-runs and updates the DOM. This is **reactive** without subscriptions.

---

## 3. Custom Structural Directive: `appUnless`

### Location
`src/app/directives/unless.directive.ts`

### What It Does
Structural directive that shows content when a condition is **FALSE** (opposite of `*ngIf`).

### Implementation Details

```typescript
@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  // Signal input with required alias
  condition = input.required<boolean>({ alias: 'appUnless' });

  constructor(
    private templateRef: TemplateRef<void>,
    private viewContainer: ViewContainerRef
  ) {
    // Reactive effect: recreates/destroys view based on condition
    effect(() => {
      if (!this.condition()) {
        // Condition is FALSE → create view
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // Condition is TRUE → destroy view
        this.viewContainer.clear();
      }
    });
  }
}
```

### Key Components
1. **TemplateRef**: Reference to the DOM being wrapped
2. **ViewContainerRef**: Container where views are inserted/removed
3. **Effect** for reactive updates
4. **Alias**: `appUnless` maps to the `condition` input

### Usage

```html
<!-- In ProductDetailsComponent -->
<!-- Shows loading spinner when isLoading() is TRUE -->
<div class="loading-overlay" *appUnless="isLoading()">
  <div class="spinner">Loading...</div>
</div>

<!-- Shows product when isLoading() is FALSE -->
<div class="product-details__container" *appUnless="!isLoading()">
  <h1>{{ currentProduct()?.title }}</h1>
</div>
```

### Comparison: `*ngIf` vs `*appUnless`

| Feature | `*ngIf` | `*appUnless` |
|---------|---------|-------------|
| Shows when | `true` | `false` |
| Condition | `*ngIf="condition"` | `*appUnless="condition"` |
| Use case | Default behavior | Inverted logic |

---

## 4. Route Resolvers

### Location
- `src/app/resolvers/products.resolver.ts`
- `src/app/resolvers/product.resolver.ts`

### What They Do
Pre-load data **before** a route activates. Ensures data is available when the component renders.

### Products Resolver

```typescript
export const productsResolver: ResolveFn<Product[]> = (route, state) => {
  const productService = inject(ProductService);
  // Fetch all products before route activates
  return productService.getProductsObservable(20);
};
```

### Product Resolver

```typescript
export const productResolver: ResolveFn<Product[] | null> = (route, state) => {
  const productService = inject(ProductService);
  // Fetch products for details page (will be filtered by component)
  return productService.getProductsObservable(100).pipe(
    catchError(() => of(null))
  );
};
```

### Usage in Routes

```typescript
// app.routes.ts
{
  path: 'products',
  component: HomeComponent,
  resolve: {
    products: productsResolver  // Waits for resolver before activating
  }
}
```

### Data Flow
1. **User clicks** `/products` link
2. **Router** calls `productsResolver`
3. **Resolver** makes HTTP request to API
4. **Router** waits for Observable to complete
5. **Component** receives resolved data via `route.data`
6. **Component** renders with data already loaded

### Access Resolved Data in Component

```typescript
export class HomeComponent {
  readonly resolvedProducts = toSignal(
    this.route.data as any,
    { initialValue: {} as any }
  );

  readonly products = computed(() => {
    const resolved = this.resolvedProducts().products;
    return resolved ?? this.productService.products();
  });
}
```

---

## 5. Loading Spinner (HTML + DOM Manipulation)

### Location
`src/app/pages/product-details/product-details.component.html`

### Implementation

```html
<!-- Shows when isLoading() is TRUE (via *appUnless) -->
<div class="loading-overlay" *appUnless="isLoading()">
  <div class="spinner" role="status" aria-label="Loading product details">
    <div class="spinner-ring"></div>
    <span class="spinner-text">Loading...</span>
  </div>
</div>

<!-- Content shows when isLoading() is FALSE -->
<div class="product-details__container" *appUnless="!isLoading()">
  <!-- Product content -->
</div>
```

### CSS Animation

```scss
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-ring {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### State Management

```typescript
readonly isLoading = computed(() => !this.currentProduct());

readonly currentProduct = computed(() => {
  const data = this.product() as Record<string, any>;
  const resolved = data?.['product'];
  
  if (resolved && Array.isArray(resolved)) {
    const id = this.route.snapshot.paramMap.get('id');
    return resolved.find((p: Product) => p.id === +id!) ?? null;
  }
  return null;  // null → isLoading = true
});
```

---

## 6. Advanced Routing with Guards & Lazy Loading (Setup)

### Location
`src/app/app.routes.ts`

### Current Routes

```typescript
export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home - ShopWave' }
  },
  {
    path: 'products',
    component: HomeComponent,
    resolve: { products: productsResolver },
    data: { title: 'Products - ShopWave' }
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    resolve: { product: productResolver },
    data: { title: 'Product Details - ShopWave' }
  },
  {
    path: 'product/add',
    component: ProductAddEditComponent,
    data: { title: 'Add Product - ShopWave' }
  },
  {
    path: 'product/:id/edit',
    component: ProductAddEditComponent,
    resolve: { product: productResolver },
    data: { title: 'Edit Product - ShopWave' }
  },
  {
    path: '**',
    redirectTo: ''  // Catch-all
  }
];
```

### Adding Route Guards (Future Enhancement)

```typescript
// Protect admin routes
{
  path: 'product/add',
  component: ProductAddEditComponent,
  canActivate: [authGuard]  // Only logged-in users
}
```

---

## 7. Reactive Forms with Validation

### Location
`src/app/pages/product-add-edit/product-add-edit.component.ts`

### Implementation

```typescript
readonly form = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(3)]],
  price: ['', [Validators.required, Validators.min(0)]],
  description: ['', [Validators.required, Validators.minLength(10)]],
  categoryName: ['', Validators.required],
  images: ['']
});

onSubmit(): void {
  if (!this.form.valid) return;  // Prevent submission
  
  this.isSubmitting.set(true);
  // Submit logic here
}
```

### Template with Error Display

```html
<div class="form-group">
  <label for="title" class="form-label">Product Title *</label>
  <input
    id="title"
    type="text"
    formControlName="title"
    class="form-input"
    [attr.aria-invalid]="
      form.get('title')?.invalid && form.get('title')?.touched
    "
  />
  @if (form.get('title')?.hasError('required') && form.get('title')?.touched) {
    <span class="form-error">Title is required</span>
  }
  @if (form.get('title')?.hasError('minlength') && form.get('title')?.touched) {
    <span class="form-error">Minimum 3 characters</span>
  }
</div>
```

### Features
- ✅ Validators: `required`, `minLength`, `min`
- ✅ Conditional error messages
- ✅ ARIA attributes for accessibility
- ✅ Form-level validation check before submit

---

## 8. HTML/DOM Attribute Bindings

### Location
Throughout all components

### Attribute Binding Patterns

```html
<!-- Data attributes -->
<div [attr.data-stock]="true"></div>

<!-- ARIA for accessibility -->
<input
  [attr.aria-invalid]="form.get('title')?.invalid && form.get('title')?.touched"
  [attr.aria-label]="'Decrease quantity of ' + item().product.title"
/>

<!-- Dynamic labels -->
<button [attr.aria-label]="btnLabel() + ' — ' + product().title">
  {{ btnLabel() }}
</button>

<!-- Live regions for updates -->
<span [attr.aria-live]="'polite'" aria-atomic="true">
  {{ grandTotal() | currency }}
</span>

<!-- Conditional attributes -->
<span
  [attr.aria-label]="'Category: ' + currentProduct()?.category.name"
  class="product-category"
>
  {{ currentProduct()?.category.name }}
</span>

<!-- Class bindings (alternative to ngClass) -->
<button
  [class.btn-add-to-cart--added]="justAdded()"
  [class.btn-add-to-cart--in-cart]="inCart() && !justAdded()"
>
  {{ btnLabel() }}
</button>

<!-- Style bindings (alternative to ngStyle) -->
<div [style.backgroundColor]="this.color()"></div>
<div [style.padding]="'2px 4px'"></div>
```

### Why Attribute Bindings?

1. **Type-safe**: Compiler checks property names
2. **Performance**: Direct DOM updates via Ivy
3. **Accessibility**: ARIA attributes are critical
4. **Clarity**: Explicit and readable
5. **No dependencies**: No ngClass/ngStyle overhead

---

## 9. Image URL Cleaning (DOM Manipulation)

The API sometimes returns malformed image URLs with extra brackets and quotes:

```javascript
// API returns: ["https://example.com/image.jpg"]
// We clean it:
img.replace(/[\[\]"]/g, '').trim()
// Result: https://example.com/image.jpg
```

Used in:
- `ProductCardComponent.imageUrl` (computed signal)
- `ProductDetailsComponent.imageUrl` (computed signal)
- `ProductDetailsComponent.cleanImageUrl()` (helper method)

---

## 10. TypeScript Best Practices

### Type Safety

```typescript
// ✅ Proper typing
readonly product = toSignal(
  this.route.data as any,
  { initialValue: {} as Record<string, any> }
);

// ✅ Bracket notation for index signatures
const resolved = data?.['product'];

// ✅ Type guards
if (resolved && Array.isArray(resolved)) { ... }

// ✅ Nullish coalescing
const img = this.currentProduct()?.images[0] ?? '';
```

### No `any` (When Possible)

We use `Record<string, any>` instead of just `any` because:
- Documents that it's a key-value object
- Prevents accidental property access
- Can be migrated to stricter types later

---

## Summary Table

| Feature | File | Purpose |
|---------|------|---------|
| Custom Pipe | `pipes/currency-format.pipe.ts` | Format numbers as currency |
| Attribute Directive | `directives/highlight.directive.ts` | Highlight elements reactively |
| Structural Directive | `directives/unless.directive.ts` | Show when condition is FALSE |
| Resolvers | `resolvers/*.resolver.ts` | Pre-load data before routes |
| Forms | `pages/product-add-edit/` | Reactive form with validation |
| Routing | `app.routes.ts` | Full app navigation |
| Loading UI | `pages/product-details/` | Spinner while resolving |

---

## Testing These Features

### Test the Custom Pipe
```html
<!-- ProductCard template -->
{{ product.price | currencyFormat:'$':2 }}

<!-- Expected output: $99.99 -->
```

### Test the Highlight Directive
```html
<!-- ProductDetails template -->
<span appHighlight appHighlightColor="#e0e7ff">
  Electronics
</span>

<!-- Expected: light blue background -->
```

### Test the Unless Directive
```html
<!-- When resolver is loading, loading spinner shows -->
<!-- When product loads, product content shows -->
```

### Test Resolvers
1. Click `/products` link
2. Notice loading spinner briefly
3. Products appear when resolver completes

---

## Performance Considerations

1. **Pipes are pure**: Angular can cache results
2. **Signals are lazy**: Only compute when accessed
3. **Effects only run when deps change**: Not on every render
4. **OnPush (default)**: Changes only on input/output
5. **TrackBy in loops**: Prevents unnecessary re-renders

---

## Accessibility Features

- ✅ ARIA labels on all interactive elements
- ✅ Live regions for dynamic content updates
- ✅ Semantic HTML (h1-h3, section, article, nav)
- ✅ Focus management in modals
- ✅ Error messages linked to form fields
- ✅ Keyboard navigation support
- ✅ Color contrast compliance
- ✅ Skip-to-content link (in layout)

---

## Next Steps

1. Add unit tests for directives/pipes
2. Implement route guard for admin routes
3. Add feature-based lazy loading
4. Convert mock edit form to real submission
5. Add product filtering/search
6. Implement authentication flow

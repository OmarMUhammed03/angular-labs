# ShopWave - Angular E-Commerce Application

A fully-featured Angular 19 e-commerce application built with TypeScript and Tailwind CSS, showcasing modern Angular best practices, advanced features, and accessibility standards.

## ✨ Features

### Lab 1 - Foundation
- ✅ Signal-based state management (input/output)
- ✅ Reactive services with signals
- ✅ Products listing with lazy loading
- ✅ Shopping cart with item management
- ✅ Sliding cart sidebar with overlay
- ✅ Responsive design
- ✅ WCAG AA accessibility compliance

### Lab 2 - Enhancement
- ✅ Fully reactive ProductService with switchMap
- ✅ CartService with computed item views and grand total
- ✅ Per-item quantity and total price display
- ✅ Clean cart summary with line count, item count, and grand total
- ✅ HTTP client integration with Escuelajs API

### Lab 3 - Advanced Features
- ✅ Route-based page navigation
- ✅ Route resolvers for data pre-loading
- ✅ Loading spinner during data fetch
- ✅ Product details page with image gallery
- ✅ Add/Edit product form (demo)
- ✅ **Custom Pipe**: `currencyFormat` - flexible currency formatting
- ✅ **Custom Attribute Directive**: `appHighlight` - dynamic highlighting with signals
- ✅ **Custom Structural Directive**: `appUnless` - opposite of ngIf with signal reactivity
- ✅ Reactive Forms with validation
- ✅ HTML/DOM attribute bindings for accessibility
- ✅ Advanced TypeScript patterns

## 🏗️ Project Structure

```
src/app/
├── pages/
│   ├── home/                      # Home/products listing page
│   ├── product-details/           # Single product details page
│   └── product-add-edit/          # Form for adding/editing products
├── components/
│   ├── header/                    # Navigation header with cart toggle
│   ├── product-list/              # Reusable products grid
│   ├── product-card/              # Individual product card (with routing)
│   ├── cart-sidebar/              # Shopping cart overlay
│   └── cart-item/                 # Cart item row
├── services/
│   ├── cart.service.ts            # Cart state management (signals)
│   └── product.service.ts         # Product data (signals + observables)
├── resolvers/
│   ├── products.resolver.ts       # Pre-load all products
│   └── product.resolver.ts        # Pre-load single product
├── directives/
│   ├── highlight.directive.ts     # Custom attribute directive with signals
│   ├── unless.directive.ts        # Custom structural directive (*appUnless)
│   └── auth.guard.ts              # (Stub) Route protection
├── pipes/
│   └── currency-format.pipe.ts    # Custom currency formatting
├── models/
│   └── product.model.ts           # TypeScript interfaces
└── app.routes.ts                  # Routing configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 22+ 
- npm 10+
- Angular CLI 19+

### Installation

```bash
cd shop
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## 📖 Key Concepts Demonstrated

### 1. **Signals & Reactivity**
- Input/Output signals with `input()` and `output()` functions
- `computed()` for derived state
- `effect()` for reactive side effects
- `toSignal()` / `toObservable()` for RxJS interoperability
- `signal.update()` for immutable state updates

```typescript
// Service with signal-based state
readonly totalCount = computed(() =>
  this._items().reduce((sum, i) => sum + i.quantity, 0)
);

// Component with signal inputs/outputs
product = input.required<Product>();
addToCart = output<Product>();
```

### 2. **Custom Pipes**
The `currencyFormat` pipe demonstrates custom transformation logic with flexible parameters:

```html
<!-- Input: 1234.5 | currencyFormat:'$':2 → Output: $1,234.50 -->
{{ product.price | currencyFormat:'$':2 }}
```

### 3. **Custom Attribute Directive**
The `appHighlight` directive uses signals and `effect()` for reactive styling:

```html
<span appHighlight [appHighlightColor]="dynamicColor">
  Highlighted text
</span>
```

**Key features:**
- Signal-based input (`input()`)
- Uses `effect()` to reactively update DOM
- Host bindings for styling

### 4. **Custom Structural Directive**
The `appUnless` directive is the opposite of `*ngIf`:

```html
<!-- Shows when isLoading is FALSE -->
<div *appUnless="isLoading()">
  Content shown when NOT loading
</div>
```

**Key features:**
- Uses `TemplateRef` and `ViewContainerRef` for view manipulation
- Signal-based input with `effect()` for reactivity
- Proper cleanup and view destruction

### 5. **Route Resolvers**
Pre-load data before route activation:

```typescript
// products.resolver.ts
export const productsResolver: ResolveFn<Product[]> = (route, state) => {
  return inject(ProductService).getProductsObservable(20);
};

// app.routes.ts
{ path: 'products', component: HomeComponent, resolve: { products: productsResolver } }
```

### 6. **Reactive Forms with Validation**
Product add/edit form with signal-based state:

```typescript
readonly form = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(3)]],
  price: ['', [Validators.required, Validators.min(0)]]
});
```

### 7. **HTML/DOM Attribute Bindings**
Advanced attribute binding for accessibility and state:

```html
<!-- Dynamic attributes -->
<input
  [attr.aria-invalid]="form.get('title')?.invalid && form.get('title')?.touched"
  [attr.aria-label]="'Add ' + product.title + ' to cart'"
/>

<!-- Data attributes -->
<div [attr.data-stock]="true"></div>

<!-- Live regions -->
<span
  [attr.aria-live]="'polite'"
  aria-atomic="true"
>
  {{ grandTotal() | currency }}
</span>
```

### 8. **Service Architecture**
- Single responsibility principle
- `providedIn: 'root'` for tree-shakeable singleton services
- Both signal and observable interfaces for flexibility

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  // Signal-based for components
  readonly products = toSignal(...);
  
  // Observable for resolvers
  getProductsObservable(limit: number): Observable<Product[]> { ... }
}
```

## 🎯 Best Practices Implemented

### TypeScript
- ✅ Strict mode enabled
- ✅ No `any` type usage
- ✅ Proper interface definitions
- ✅ Type inference where appropriate
- ✅ Proper error handling

### Angular
- ✅ Standalone components (no NgModules)
- ✅ OnPush change detection (default in v22+)
- ✅ Lazy loading support (ready for feature modules)
- ✅ Proper dependency injection with `inject()`
- ✅ Reactive patterns over imperative

### Accessibility (WCAG AA)
- ✅ Semantic HTML
- ✅ ARIA labels and live regions
- ✅ Keyboard navigation support
- ✅ Color contrast compliance
- ✅ Focus management
- ✅ Form validation messages

### Performance
- ✅ Tree-shakeable services
- ✅ Lazy-loaded routes (ready)
- ✅ OnPush change detection
- ✅ Computed signals instead of ngIf in templates
- ✅ TrackBy in `@for` loops

## 🔄 Data Flow

```
API (Escuelajs) 
    ↓
ProductService (signals + observables)
    ↓
├─→ ProductListComponent (signal input)
├─→ ProductDetailsComponent (resolver)
└─→ CartService (manages items with computed views)
    ↓
CartSidebarComponent (displays items, totals)
```

## 📱 Routing Map

| Route | Component | Resolver | Purpose |
|-------|-----------|----------|---------|
| `/` | HomeComponent | None | Landing page |
| `/products` | HomeComponent | productsResolver | Product listing |
| `/product/:id` | ProductDetailsComponent | productResolver | Single product view |
| `/product/add` | ProductAddEditComponent | None | Add new product (demo) |
| `/product/:id/edit` | ProductAddEditComponent | productResolver | Edit product (demo) |

## 🧪 Testing

Component spec files are auto-generated. Add unit tests as needed:

```bash
ng test
```

## 🎨 Design System

### Colors (CSS Variables)
- `--accent: #6c47ff` (Primary)
- `--accent-dark: #5235cc` (Primary Dark)
- `--bg: #f4f5f7` (Background)
- `--surface: #ffffff` (Cards)
- `--surface-2: #eef0f4` (Hover)
- `--border: #e2e6ec` (Dividers)
- `--text-primary: #111827` (Primary text)
- `--text-secondary: #374151` (Secondary text)
- `--text-muted: #6b7280` (Muted text)

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: 0.75rem to 2rem with meaningful hierarchy

### Spacing
- **Grid**: 8px base unit
- **Components**: 12px-24px padding
- **Sections**: 40px-80px padding

## 📦 Build & Deployment

```bash
# Production build
ng build --configuration=production

# Output: dist/shop/
```

## 🐛 Troubleshooting

### Port 4200 already in use
```bash
ng serve --port 4201
```

### Module not found
```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

### Pipe not working in template
Ensure pipe is imported in component:
```typescript
imports: [CurrencyFormatPipe]
```

## 📚 References

- [Angular Docs](https://angular.io/docs)
- [Signals Guide](https://angular.io/guide/signals)
- [Custom Directives](https://angular.io/guide/attribute-directives)
- [Pipes](https://angular.io/guide/pipes)
- [Resolvers](https://angular.io/api/router/Resolve)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📄 License

MIT

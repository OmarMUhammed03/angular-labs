import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ProductListComponent } from './components/product-list/product-list.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, ProductListComponent],
  template: `
    <app-header />
    <main id="main-content">
      <app-product-list />
    </main>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 64px);
      background: var(--bg);
    }
  `]
})
export class AppComponent {}

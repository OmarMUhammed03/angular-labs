import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductAddEditComponent } from './pages/product-add-edit/product-add-edit.component';
import { productsResolver } from './resolvers/products.resolver';
import { productResolver } from './resolvers/product.resolver';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home - ShopWave' }
  },
  {
    path: 'products',
    component: HomeComponent,
    resolve: {
      products: productsResolver
    },
    data: { title: 'Products - ShopWave' }
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    resolve: {
      product: productResolver
    },
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
    resolve: {
      product: productResolver
    },
    data: { title: 'Edit Product - ShopWave' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

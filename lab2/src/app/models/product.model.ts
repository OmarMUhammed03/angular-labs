export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

/** Derived view model — computed in CartService, never stored in state */
export interface CartItemView extends CartItem {
  itemTotal: number; // quantity × price
}

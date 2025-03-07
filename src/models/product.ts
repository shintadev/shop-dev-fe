export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  featured: boolean;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  inStock: boolean;
  onSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  parentId?: string;
  parentName?: string;
  productCount?: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImages: string[];
  price: number;
  discountPrice?: number;
  quantity: number;
  subTotal: number;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImages: string[];
  productPrice: number;
  productDiscountPrice?: number;
  inStock: boolean;
  createdAt: string;
}

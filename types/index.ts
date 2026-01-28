import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  stock: number;
  prices: {
    [priceTypeId: string]: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  priceTypeId: string;
  role: 'admin' | 'customer';
  createdAt: Timestamp;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryType: 'pickup' | 'delivery';
  status: 'pending' | 'preparing' | 'delivering' | 'completed';
  createdAt: Timestamp;
}

export interface PriceType {
  id: string;
  name: string;
  description: string;
  createdAt: Timestamp;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  stock: number; // Now represents box count (koli)
  itemsPerBox: number; // NEW: Number of items per box (e.g., 24)
  prices: {
    [priceTypeId: string]: number;
  };
  // NEW: Dual pricing system fields (optional for backward compatibility)
  pricePerUnit?: number;        // Adet fiyatı (so'm)
  pricePerBox?: number;         // Koli fiyatı (so'm)
  unitsPerBox?: number;         // Koli başına adet sayısı
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string; // YENİ: Telefon numarası (optional - eski customerlar için)
  priceTypeId: string;
  role: 'admin' | 'customer';
  storeCoordinates?: {
    lat: number;
    lng: number;
  };
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
  status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
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

export interface Translation {
  [key: string]: string;
}

export type Language = 'uz' | 'tr' | 'ru';

export interface PartnershipApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
  createdAt: Timestamp;
  notes?: string;
}

export type PartnershipStatus = PartnershipApplication['status'];
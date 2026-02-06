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
  nickname?: string; // NEW: Unique nickname (3-20 chars, a-z 0-9 _)
  priceTypeId: string;
  role: 'admin' | 'customer' | 'operator' | 'supervisor';
  district?: string;
  storeCoordinates?: {
    lat: number;
    lng: number;
    address?: string; // Human-readable address from reverse geocoding
  };
  createdAt: Timestamp;
}

export type UserRole = 'admin' | 'customer' | 'operator' | 'supervisor';

// Role configuration for UI
export interface RoleConfig {
  value: UserRole;
  label: string;
  description: string;
  color: string; // Tailwind color class
  badgeClass: string;
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

export interface SiteSettings {
  testMode: boolean;
  updatedAt?: any; // Firestore Timestamp
  updatedBy?: string;
}
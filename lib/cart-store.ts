import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  deliveryType: 'pickup' | 'delivery';
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDeliveryType: (type: 'pickup' | 'delivery') => void;
  clearCart: () => void;
  getTotalAmount: (priceTypeId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryType: 'pickup',
      
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      setDeliveryType: (type) => {
        set({ deliveryType: type });
      },
      
      clearCart: () => {
        set({ items: [], deliveryType: 'pickup' });
      },
      
      getTotalAmount: (priceTypeId) => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.product.prices[priceTypeId] || 0;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { tr, ru } from 'date-fns/locale';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, customer } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();

  // Dinamik locale seçimi
  const getLocale = () => {
    switch (language) {
      case 'tr':
        return tr;
      case 'ru':
        return ru;
      case 'uz':
        return ru; // Özbekçe için Rusça locale kullan (date-fns'de uz yok)
      default:
        return undefined; // İngilizce default
    }
  };

  const getStatusLabel = (status: string) => {
    const statusKey = `order_status_${status}`;
    return t(statusKey);
  };

  const getDeliveryTypeLabel = (type: string) => {
    return type === 'pickup' ? t('order_delivery_pickup') : t('order_delivery_address');
  };

  const fetchOrders = useCallback(async () => {
    if (!customer) return;

    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('customerId', '==', customer.id),
        orderBy('createdAt', 'desc')
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      
      const ordersData = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [user, router, fetchOrders]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t('orders_title')}</h1>

        {loading ? (
          <div className="text-center py-12">{t('loading')}</div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600 mb-4">{t('no_orders')}</p>
              <Link href="/">
                <Button>{t('start_shopping')}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{t('order_items')} #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('order_number')}: <span className="font-mono">{order.id}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('order_date')}: {order.createdAt && format(order.createdAt.toDate(), 'PPP p', { locale: getLocale() })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'delivering' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getDeliveryTypeLabel(order.deliveryType)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.productName} x {item.quantity}</span>
                        <span className="font-medium">{(item.price * item.quantity).toFixed(2)} {t('currency_symbol')}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                      <span>{t('orders_total')}:</span>
                      <span>{order.totalAmount.toFixed(2)} {t('currency_symbol')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
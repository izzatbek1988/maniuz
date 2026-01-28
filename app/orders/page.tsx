'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, customer } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const getStatusLabel = (status: string) => {
    const statusKey = `order_status_${status}` as any;
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
              <p className="text-muted-foreground">{t('orders_empty')}</p>
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
                        {order.createdAt && format(order.createdAt.toDate(), 'PPP p', { locale: tr })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'delivering' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
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
                        <span className="font-medium">{(item.price * item.quantity).toFixed(2)} ₺</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                      <span>{t('orders_total')}:</span>
                      <span>{order.totalAmount.toFixed(2)} ₺</span>
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

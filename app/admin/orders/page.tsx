'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const statusLabels = {
  pending: 'Beklemede',
  preparing: 'Hazırlanıyor',
  delivering: 'Teslimatta',
  completed: 'Tamamlandı',
};

const deliveryTypeLabels = {
  pickup: 'Mağazadan Teslim Alma',
  delivery: 'Adrese Teslimat',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const ordersSnap = await getDocs(ordersQuery);
      setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order.id);
    setSelectedStatus(order.status);
  };

  const handleSave = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: selectedStatus,
      });
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Sipariş güncellenemedi');
    }
  };

  const handleCancel = () => {
    setEditingOrder(null);
    setSelectedStatus('');
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Sipariş Yönetimi</h1>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Sipariş #{order.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.createdAt && format(order.createdAt.toDate(), 'PPP p', { locale: tr })}
                  </p>
                  <p className="text-sm mt-1">Müşteri: {order.customerName}</p>
                </div>
                <div className="text-right">
                  {editingOrder === order.id ? (
                    <div className="space-y-2">
                      <Label htmlFor={`status-${order.id}`}>Durum</Label>
                      <select
                        id={`status-${order.id}`}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => handleSave(order.id)}>
                          Kaydet
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          İptal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'delivering' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {statusLabels[order.status]}
                      </span>
                      <p className="text-sm text-muted-foreground mt-2">
                        {deliveryTypeLabels[order.deliveryType]}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleEdit(order)}
                      >
                        Durumu Güncelle
                      </Button>
                    </>
                  )}
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
                  <span>Toplam:</span>
                  <span>{order.totalAmount.toFixed(2)} ₺</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

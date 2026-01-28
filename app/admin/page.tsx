'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingBag, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    priceTypes: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsSnap, customersSnap, ordersSnap, priceTypesSnap] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'customers')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'priceTypes')),
      ]);

      setStats({
        products: productsSnap.size,
        customers: customersSnap.size,
        orders: ordersSnap.size,
        priceTypes: priceTypesSnap.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fiyat Tipleri</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.priceTypes}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

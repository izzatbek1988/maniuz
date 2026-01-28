'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, customer } = useAuth();
  const router = useRouter();
  const [priceTypeName, setPriceTypeName] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (customer?.priceTypeId) {
      fetchPriceTypeName(customer.priceTypeId);
    }
  }, [user, customer]);

  const fetchPriceTypeName = async (priceTypeId: string) => {
    try {
      const priceTypeDoc = await getDoc(doc(db, 'priceTypes', priceTypeId));
      if (priceTypeDoc.exists()) {
        setPriceTypeName(priceTypeDoc.data().name);
      }
    } catch (error) {
      console.error('Error fetching price type:', error);
    }
  };

  if (!user || !customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Profilim</h1>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ad Soyad</Label>
                <p className="text-lg mt-1">{customer.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-lg mt-1">{customer.email}</p>
              </div>
              <div>
                <Label>Fiyat Tipi</Label>
                <p className="text-lg mt-1">{priceTypeName || 'Yükleniyor...'}</p>
              </div>
              <div>
                <Label>Rol</Label>
                <p className="text-lg mt-1 capitalize">{customer.role === 'admin' ? 'Admin' : 'Müşteri'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

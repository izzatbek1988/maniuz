'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Customer, PriceType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [selectedPriceType, setSelectedPriceType] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersSnap, priceTypesSnap] = await Promise.all([
        getDocs(collection(db, 'customers')),
        getDocs(collection(db, 'priceTypes')),
      ]);

      setCustomers(customersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
      setPriceTypes(priceTypesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PriceType)));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer.id);
    setSelectedPriceType(customer.priceTypeId);
  };

  const handleSave = async (customerId: string) => {
    try {
      await updateDoc(doc(db, 'customers', customerId), {
        priceTypeId: selectedPriceType,
      });
      setEditingCustomer(null);
      fetchData();
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Müşteri güncellenemedi');
    }
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setSelectedPriceType('');
  };

  const getPriceTypeName = (priceTypeId: string) => {
    const priceType = priceTypes.find(pt => pt.id === priceTypeId);
    return priceType?.name || 'Bilinmiyor';
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Müşteri Yönetimi</h1>

      <div className="grid gap-4">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  <p className="text-sm mt-2">
                    Rol: <span className="font-medium capitalize">{customer.role === 'admin' ? 'Admin' : 'Müşteri'}</span>
                  </p>
                  
                  {editingCustomer === customer.id ? (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`price-type-${customer.id}`}>Fiyat Tipi</Label>
                        <select
                          id={`price-type-${customer.id}`}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                          value={selectedPriceType}
                          onChange={(e) => setSelectedPriceType(e.target.value)}
                        >
                          {priceTypes.map((pt) => (
                            <option key={pt.id} value={pt.id}>
                              {pt.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(customer.id)}>
                          Kaydet
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          İptal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mt-2">
                      Fiyat Tipi: <span className="font-medium">{getPriceTypeName(customer.priceTypeId)}</span>
                    </p>
                  )}
                </div>
                
                {editingCustomer !== customer.id && (
                  <Button size="icon" variant="outline" onClick={() => handleEdit(customer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

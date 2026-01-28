'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PriceType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminPriceTypesPage() {
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPriceType, setEditingPriceType] = useState<PriceType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchPriceTypes();
  }, []);

  const fetchPriceTypes = async () => {
    try {
      const priceTypesSnap = await getDocs(collection(db, 'priceTypes'));
      setPriceTypes(priceTypesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PriceType)));
    } catch (error) {
      console.error('Error fetching price types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPriceType) {
        await updateDoc(doc(db, 'priceTypes', editingPriceType.id), formData);
      } else {
        await addDoc(collection(db, 'priceTypes'), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      }

      setShowForm(false);
      setEditingPriceType(null);
      resetForm();
      fetchPriceTypes();
    } catch (error) {
      console.error('Error saving price type:', error);
      alert('Fiyat tipi kaydedilemedi');
    }
  };

  const handleEdit = (priceType: PriceType) => {
    setEditingPriceType(priceType);
    setFormData({
      name: priceType.name,
      description: priceType.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu fiyat tipini silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'priceTypes', id));
      fetchPriceTypes();
    } catch (error) {
      console.error('Error deleting price type:', error);
      alert('Fiyat tipi silinemedi');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPriceType(null);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Fiyat Tipi Yönetimi</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Fiyat Tipi
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingPriceType ? 'Fiyat Tipi Düzenle' : 'Yeni Fiyat Tipi Ekle'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Fiyat Tipi Adı *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: Perakende, Toptan, VIP"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama *</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fiyat tipi hakkında açıklama"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingPriceType ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {priceTypes.map((priceType) => (
          <Card key={priceType.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{priceType.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{priceType.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(priceType)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(priceType.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

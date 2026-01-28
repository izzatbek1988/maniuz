'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, PriceType } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    stock: 0,
  });
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsSnap, priceTypesSnap] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'priceTypes')),
      ]);

      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setPriceTypes(priceTypesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PriceType)));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        prices,
        updatedAt: serverTimestamp(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ürün kaydedilemedi');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
    setPrices(product.prices);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'products', id));
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ürün silinemedi');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', imageUrl: '', stock: 0 });
    setPrices({});
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Ürün Yönetimi</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ürün
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ürün Adı *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama *</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Resim URL *</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Fiyatlar (Her Fiyat Tipi İçin) *</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {priceTypes.map((priceType) => (
                    <div key={priceType.id} className="space-y-2">
                      <Label htmlFor={`price-${priceType.id}`}>{priceType.name}</Label>
                      <Input
                        id={`price-${priceType.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={prices[priceType.id] || ''}
                        onChange={(e) => setPrices({ ...prices, [priceType.id]: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingProduct ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <p className="text-sm mt-2">Stok: {product.stock}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {priceTypes.map((pt) => (
                      <span key={pt.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {pt.name}: {product.prices[pt.id]?.toFixed(2) || '0.00'} {t('currency_symbol')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(product.id)}>
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

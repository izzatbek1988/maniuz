'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user, customer } = useAuth();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      if (productDoc.exists()) {
        setProduct({ id: productDoc.id, ...productDoc.data() } as Product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (product) {
      addItem(product, quantity);
      router.push('/cart');
    }
  };

  const getPrice = () => {
    if (!customer?.priceTypeId || !product) return 0;
    return product.prices[customer.priceTypeId] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">Ürün bulunamadı.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ürünlere Dön
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.imageUrl || '/placeholder.png'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            {user && customer ? (
              <div>
                <p className="text-4xl font-bold text-primary">
                  {getPrice().toFixed(2)} ₺
                </p>
              </div>
            ) : (
              <p className="text-lg text-muted-foreground">
                Fiyat görmek için giriş yapın
              </p>
            )}

            <div>
              <p className={`text-lg ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `Stokta mevcut (${product.stock} adet)` : 'Stokta yok'}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sepete Ekle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Miktar</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Sepete Ekle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

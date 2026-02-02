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
import Footer from '@/components/Footer';
import { useTranslation } from '@/contexts/TranslationContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user, customer } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useTranslation();

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
      
      const itemsPerBox = product.itemsPerBox || 1;
      const totalItems = quantity * itemsPerBox;
      
      toast.success(
        `${quantity} ${t('box')} (${totalItems} ${t('units')}) ${t('cart_added')}!`,
        {
          duration: 3000,
          icon: '🛒',
        }
      );
      
      router.push('/cart');
    }
  };

  const getPrice = () => {
    if (!customer?.priceTypeId || !product) return 0;
    return product.prices[customer.priceTypeId] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="text-center py-12">{t('loading')}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="text-center py-12">{t('product_not_found')}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('product_back')}
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
              <div className="space-y-3">
                <p className="text-4xl font-bold text-primary">
                  {getPrice().toFixed(2)} {t('currency_symbol')}
                </p>
                
                {/* Improved Dual Pricing Display with Translations */}
                {(product.pricePerUnit || product.pricePerBox) && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 space-y-2">
                    {product.pricePerUnit && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🔢</span>
                          <span className="text-sm font-medium text-gray-600">
                            {t('unit_price')}:
                          </span>
                        </div>
                        <span className="text-lg font-bold text-purple-600">
                          {product.pricePerUnit.toLocaleString()} {t('currency_symbol')}
                        </span>
                      </div>
                    )}
                    {product.pricePerBox && product.unitsPerBox && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📦</span>
                          <span className="text-sm font-medium text-gray-600">
                            {t('box_price')}:
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-blue-600">
                            {product.pricePerBox.toLocaleString()} {t('currency_symbol')}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.unitsPerBox} {t('units')})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-lg text-muted-foreground">
                {t('view_price')}
              </p>
            )}

            <div>
              <p className={`text-lg ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? (
                  <>
                    📦 {t('product_stock')}: <span className="font-semibold">{product.stock} {t('box')}</span>
                    {product.itemsPerBox && (
                      <span className="text-muted-foreground text-base">
                        {' '}({product.stock * product.itemsPerBox} {t('units')})
                      </span>
                    )}
                  </>
                ) : t('product_out_of_stock')}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t('product_add_to_cart')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t('product_quantity')} ({t('box')})</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  {product.itemsPerBox && quantity > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {t('cart_total')}: {quantity * product.itemsPerBox} {t('units')}
                    </p>
                  )}
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t('product_add_to_cart')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

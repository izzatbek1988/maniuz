'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2, ShoppingBag, Package, Truck, Store, CheckCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { user, customer } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { items, deliveryType, updateQuantity, removeItem, setDeliveryType, clearCart, getTotalAmount } = useCartStore();
  const [loading, setLoading] = useState(false);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleCheckout = async () => {
    if (!customer || items.length === 0) return;

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        // FIXED: Use pricePerBox if available (wholesale pricing)
        price: item.product.pricePerBox || item.product.prices[customer.priceTypeId] || 0,
      }));

      await addDoc(collection(db, 'orders'), {
        customerId: customer.id,
        customerName: customer.name,
        items: orderItems,
        totalAmount: getTotalAmount(customer.priceTypeId),
        deliveryType,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      clearCart();
      
      toast.success(
        t('order_success') || 'Buyurtma muvaffaqiyatli yaratildi!',
        {
          duration: 4000,
          icon: '🎉',
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: 'bold',
          },
        }
      );
      
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(t('login_error') || 'Xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (productId: string) => {
    if (!customer) return 0;
    const item = items.find((i) => i.product.id === productId);
    if (!item) return 0;
    // FIXED: Use pricePerBox if available (wholesale pricing), otherwise fall back to dynamic pricing
    return item.product.pricePerBox || item.product.prices[customer.priceTypeId] || 0;
  };

  const handleRemove = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(
      `${productName} ${t('cart_removed') || 'o\'chirildi'}`,
      {
        duration: 2000,
        icon: '🗑️',
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <Card className="text-center py-16 max-w-md w-full border-0 shadow-2xl bg-white">
            <CardContent>
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <ShoppingBag className="h-16 w-16 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900">{t('cart_empty')}</h2>
              <p className="text-gray-600 mb-8 text-lg">
                {t('cart_empty_description') || 'Savatingiz bo\'sh. Mahsulotlarni ko\'rib chiqing!'}
              </p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 px-8 py-6 text-lg"
              >
                <Package className="mr-2 h-5 w-5" />
                {t('cart_continue_shopping')}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('cart_title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {items.length} {t('cart_items') || 'mahsulot'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 animate-slide-up">
            {items.map((item, index) => (
              <Card 
                key={item.product.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                      <img
                        src={item.product.imageUrl || '/placeholder.png'}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-1">{item.product.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {item.product.itemsPerBox} {t('units')} / {t('box')}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          onClick={() => handleRemove(item.product.id, item.product.name)}
                          title={t('cart_remove')}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {getPrice(item.product.id).toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-600 font-semibold">
                            {t('currency_symbol')}
                          </span>
                          <span className="text-sm text-gray-500">
                            / {t('box')}
                          </span>
                        </div>
                        {item.product.itemsPerBox && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            {t('cart_total')}: {item.quantity * item.product.itemsPerBox} {t('units')}
                          </p>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-xl border-2 border-blue-100 w-fit">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-10 w-10 rounded-lg border-2 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Minus className="h-4 w-4 text-blue-600" />
                        </Button>
                        <span className="w-16 text-center font-bold text-xl text-gray-900">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="h-10 w-10 rounded-lg border-2 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Plus className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('subtotal')}:</span>
                          <span className="text-xl font-bold text-blue-600">
                            {(getPrice(item.product.id) * item.quantity).toFixed(2)} {t('currency_symbol')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <Card className="border-0 shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                    {t('cart_summary') || 'Buyurtma xulosasi'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Delivery Type */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-900">
                      {t('cart_delivery_type')}
                    </Label>
                    <div className="space-y-3">
                      <label className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        deliveryType === 'pickup' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          value="pickup"
                          checked={deliveryType === 'pickup'}
                          onChange={() => setDeliveryType('pickup')}
                          className="w-5 h-5 text-blue-600"
                        />
                        <Store className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{t('cart_pickup')}</span>
                      </label>
                      <label className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        deliveryType === 'delivery' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          value="delivery"
                          checked={deliveryType === 'delivery'}
                          onChange={() => setDeliveryType('delivery')}
                          className="w-5 h-5 text-purple-600"
                        />
                        <Truck className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">{t('cart_delivery')}</span>
                      </label>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-gray-200 pt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl border-2 border-blue-100">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">
                          {t('cart_total')}:
                        </span>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {customer && getTotalAmount(customer.priceTypeId).toFixed(2)}
                          </div>
                          <div className="text-lg text-gray-600 font-semibold">
                            {t('currency_symbol')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 pt-6">
                  <Button
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('loading')}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        {t('cart_complete_order')}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
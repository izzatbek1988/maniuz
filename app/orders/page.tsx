'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { tr, ru } from 'date-fns/locale';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  CreditCard,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { user, customer } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();

  const getLocale = () => {
    switch (language) {
      case 'tr':
        return tr;
      case 'ru':
        return ru;
      case 'uz':
        return ru;
      default:
        return undefined;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusKey = `order_status_${status}`;
    return t(statusKey);
  };

  const getDeliveryTypeLabel = (type: string) => {
    return type === 'pickup' ? t('order_delivery_pickup') : t('order_delivery_address');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'preparing':
        return <Package className="h-5 w-5" />;
      case 'delivering':
        return <Truck className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'delivering':
        return 'from-blue-500 to-cyan-500';
      case 'preparing':
        return 'from-yellow-500 to-orange-500';
      case 'cancelled':
        return 'from-red-500 to-rose-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivering':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
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

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('orders_title')}
            </h1>
          </div>
          <p className="text-gray-600">
            {t('orders_subtitle') || 'Tüm siparişlerinizi buradan takip edebilirsiniz'}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-16 w-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
              <Sparkles className="h-8 w-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-gray-600 font-medium">{t('loading')}</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="text-center py-16">
              <div className="inline-flex p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
                <ShoppingBag className="h-16 w-16 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{t('no_orders')}</h3>
              <p className="text-gray-600 mb-6">
                {t('no_orders_desc') || 'Henüz hiç sipariş vermediniz. Hemen alışverişe başlayın!'}
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  {t('start_shopping')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {[
                  { key: 'all', label: t('filter_all') || 'Tümü', count: statusCounts.all },
                  { key: 'pending', label: t('order_status_pending') || 'Beklemede', count: statusCounts.pending },
                  { key: 'preparing', label: t('order_status_preparing') || 'Hazırlanıyor', count: statusCounts.preparing },
                  { key: 'delivering', label: t('order_status_delivering') || 'Yolda', count: statusCounts.delivering },
                  { key: 'completed', label: t('order_status_completed') || 'Tamamlandı', count: statusCounts.completed },
                  { key: 'cancelled', label: t('order_status_cancelled') || 'İptal', count: statusCounts.cancelled },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterStatus(filter.key)}
                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                      filterStatus === filter.key
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                    }`}
                  >
                    {filter.label}
                    {filter.count > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        filterStatus === filter.key ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-600">{t('no_orders_filter') || 'Bu kategoride sipariş bulunamadı'}</p>
                  </CardContent>
                </Card>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrders.has(order.id);
                  
                  return (
                    <Card 
                      key={order.id}
                      className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 overflow-hidden"
                    >
                      {/* Status Bar */}
                      <div className={`h-2 bg-gradient-to-r ${getStatusColor(order.status)}`} />
                      
                      <CardHeader className="cursor-pointer" onClick={() => toggleOrderExpand(order.id)}>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`p-2 bg-gradient-to-br ${getStatusColor(order.status)} rounded-xl`}>
                                <div className="text-white">
                                  {getStatusIcon(order.status)}
                                </div>
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {t('order_items')} #{order.id.slice(0, 8).toUpperCase()}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                  <Calendar className="h-3 w-3" />
                                  {order.createdAt && format(order.createdAt.toDate(), 'PPP p', { locale: getLocale() })}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end gap-2">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 ${getStatusBgColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </span>
                            <div className="text-2xl font-bold text-purple-600">
                              {order.totalAmount.toFixed(2)} {t('currency_symbol')}
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="border-t bg-gray-50">
                          <div className="grid md:grid-cols-2 gap-6 mb-6 pt-6">
                            {/* Delivery Info */}
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                {order.deliveryType === 'pickup' ? (
                                  <Package className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <Truck className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 mb-1">
                                  {t('delivery_type') || 'Teslimat Türü'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {getDeliveryTypeLabel(order.deliveryType)}
                                </p>
                              </div>
                            </div>

                            {/* Order ID */}
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <CreditCard className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 mb-1">
                                  {t('order_number') || 'Sipariş No'}
                                </p>
                                <p className="text-sm text-gray-600 font-mono">
                                  {order.id}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800 mb-3">
                              {t('order_items') || 'Sipariş İçeriği'}
                            </h4>
                            {order.items.map((item, index) => (
                              <div 
                                key={index}
                                className="flex justify-between items-center p-3 bg-white rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    {item.quantity}x
                                  </div>
                                  <span className="font-medium text-gray-800">{item.productName}</span>
                                </div>
                                <span className="font-bold text-purple-600">
                                  {(item.price * item.quantity).toFixed(2)} {t('currency_symbol')}
                                </span>
                              </div>
                            ))}
                            
                            {/* Total */}
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white mt-4">
                              <span className="text-lg font-semibold">{t('orders_total')}:</span>
                              <span className="text-2xl font-bold">{order.totalAmount.toFixed(2)} {t('currency_symbol')}</span>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
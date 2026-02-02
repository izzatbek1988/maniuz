'use client';

import { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { ShoppingCart, Eye, Plus, Minus, Package, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Customer } from '@/types';

// Loading Skeleton Component
const ProductSkeleton = () => (
  <Card className="flex flex-col animate-pulse">
    <CardHeader>
      <div className="aspect-square bg-gray-200 rounded-md mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </CardHeader>
    <CardContent>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </CardContent>
    <CardFooter>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </CardFooter>
  </Card>
);

// Memoized ProductCard component
const ProductCard = memo(({ product, user, customer, onAddToCart, getPrice }: {
  product: Product;
  user: any;
  customer: Customer | null;
  onAddToCart: (product: Product, quantity: number) => void;
  getPrice: (product: Product) => number;
}) => {
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();
  const router = useRouter();

  const handleIncrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  }, [quantity, product.stock]);

  const handleDecrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  }, [quantity]);

  const handleAddToCartClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setQuantity(1);
  }, [product, quantity, onAddToCart]);

  const handleCardClick = useCallback(() => {
    router.push(`/product/${product.id}`);
  }, [router, product.id]);

  const totalItems = useMemo(() => {
    return quantity * (product.itemsPerBox || 1);
  }, [quantity, product.itemsPerBox]);

  const displayPrice = useMemo(() => {
    return getPrice(product).toFixed(2);
  }, [product, getPrice]);

  const stockDisplay = useMemo(() => {
    const itemsPerBox = product.itemsPerBox || 1;
    return `${product.stock} ${t('box')} (${product.stock * itemsPerBox} ${t('units')})`;
  }, [product.stock, product.itemsPerBox, t]);

  const isOutOfStock = product.stock === 0;

  return (
    <Card
      className="flex flex-col cursor-pointer group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white overflow-hidden relative"
      onClick={handleCardClick}
    >
      {/* Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {t('product_out_of_stock') || 'Tugadi'}
        </div>
      )}

      {/* New Badge */}
      {!isOutOfStock && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {t('product_new') || 'Yangi'}
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="aspect-square relative mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-inner">
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardTitle className="line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors text-lg leading-tight">
          {product.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm min-h-0 mb-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="space-y-2">
          {user && customer ? (
            <>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {displayPrice}
                </p>
                <p className="text-lg text-gray-600 font-semibold">
                  {t('currency_symbol')}
                </p>
              </div>
              
              {/* Improved Dual Pricing Display with Emojis and Translations */}
              {(product.pricePerUnit || product.pricePerBox) && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 space-y-1">
                  {product.pricePerUnit && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">🔢</span>
                        <span className="text-xs font-medium text-gray-600">{t('unit_price')}:</span>
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        {product.pricePerUnit.toLocaleString()} {t('currency_symbol')}
                      </span>
                    </div>
                  )}
                  {product.pricePerBox && product.unitsPerBox && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">📦</span>
                        <span className="text-xs font-medium text-gray-600">{t('box_price')}:</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-blue-600">
                          {product.pricePerBox.toLocaleString()} {t('currency_symbol')}
                        </span>
                        <span className="text-[10px] text-gray-500 ml-1">
                          ({product.unitsPerBox} {t('units')})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <Eye className="h-4 w-4" />
              <span>{t('view_price') || 'Narxni ko\'rish uchun kiring'}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{stockDisplay}</span>
          </div>
        </div>

        {/* Quantity Selector */}
        {user && customer && !isOutOfStock && (
          <div className="p-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-blue-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Minus className="h-4 w-4 text-blue-600" />
              </button>

              <div className="flex-1 text-center">
                <div className="font-bold text-base text-gray-900">
                  {quantity} {t('box')}
                </div>
                <div className="text-[10px] text-blue-600 font-medium">
                  = {totalItems} {t('units')}
                </div>
              </div>

              <button
                onClick={handleIncrement}
                disabled={quantity >= product.stock}
                className="w-8 h-8 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Plus className="h-4 w-4 text-blue-600" />
              </button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          className="flex-1 border-2 hover:bg-gray-50 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/product/${product.id}`);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t('product_view_details')}
        </Button>
        {user && customer && (
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {t('product_add_to_cart')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, customer } = useAuth();
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = useCallback((product: Product, quantity: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    addItem(product, quantity);

    const itemsPerBox = product.itemsPerBox || 1;
    const totalItems = quantity * itemsPerBox;

    toast.success(
      `${quantity} ${t('box')} (${totalItems} ${t('units')}) ${t('cart_added')}!`,
      {
        duration: 3000,
        icon: '🛒',
        style: {
          background: '#10b981',
          color: '#fff',
          fontWeight: 'bold',
        },
      }
    );
  }, [user, router, addItem, t]);

  const getPrice = useCallback((product: Product) => {
    if (!customer?.priceTypeId) return 0;
    return product.prices[customer.priceTypeId] || 0;
  }, [customer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      <Navbar />
      <Hero />

      <main id="products" className="container mx-auto px-4 py-12 flex-1">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
            <Package className="h-8 w-8 text-blue-600" />
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('products_title')}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('products_subtitle') || 'Eng sifatli mahsulotlarimiz bilan tanishing'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center py-16 border-0 shadow-2xl bg-white">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900">{t('products_empty')}</h2>
              <p className="text-gray-600 text-lg mb-6">
                {t('products_empty_description') || 'Hozircha mahsulotlar mavjud emas'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                user={user}
                customer={customer}
                onAddToCart={handleAddToCart}
                getPrice={getPrice}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
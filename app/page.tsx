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
import { ShoppingCart, Eye, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Customer } from '@/types';
import Link from 'next/link';

// Memoized ProductCard component for better performance
const ProductCard = memo(({ product, user, customer, onAddToCart, getPrice }: {
  product: Product;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return `${product.stock} ${t('product_boxes')} (${product.stock * itemsPerBox} ${t('product_pieces')})`;
  }, [product.stock, product.itemsPerBox, t]);

  return (
    <Card 
      className="flex flex-col cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="aspect-square relative mb-4 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          {user && customer ? (
            <p className="text-2xl font-bold text-primary">
              {displayPrice} {t('currency_symbol')}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('view_price')}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {t('product_stock')}: {stockDisplay}
          </p>
        </div>

        {/* Quantity Selector */}
        {user && customer && product.stock > 0 && (
          <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <div className="flex-1 text-center">
              <div className="font-bold">
                {quantity} {t('product_boxes')}
              </div>
              <div className="text-xs text-muted-foreground">
                = {totalItems} {t('product_pieces')}
              </div>
            </div>
            
            <button
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="icon"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/product/${product.id}`);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
        {user && customer && (
          <Button
            size="icon"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={handleAddToCartClick}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

// Hero Section Component
const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 mb-12 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {t('hero_title')}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
          {t('hero_subtitle')}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="#products">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              {t('hero_cta_products')}
            </Button>
          </Link>
          <Link href="/partnership">
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/10">
              {t('hero_cta_partnership')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
    </section>
  );
};

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
      `${quantity} ${t('product_boxes')} (${totalItems} ${t('product_pieces')}) ${t('cart_added')}!`,
      {
        duration: 3000,
        icon: '🛒',
      }
    );
  }, [user, router, addItem, t]);

  const getPrice = useCallback((product: Product) => {
    if (!customer?.priceTypeId) return 0;
    return product.prices[customer.priceTypeId] || 0;
  }, [customer]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <HeroSection />
        
        <h1 id="products" className="text-4xl font-bold mb-8 text-center">{t('products_title')}</h1>

        {loading ? (
          <div className="text-center py-12">{t('loading')}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('products_empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
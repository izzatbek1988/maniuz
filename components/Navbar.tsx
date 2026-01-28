'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import LanguageSelector from '@/components/LanguageSelector';

export default function Navbar() {
  const { user, customer, signOut } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Maniuz
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            {user ? (
              <>
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button variant="ghost" size="icon">
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                {customer?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline">{t('nav_admin')}</Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">{t('nav_login')}</Button>
                </Link>
                <Link href="/register">
                  <Button>{t('nav_register')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

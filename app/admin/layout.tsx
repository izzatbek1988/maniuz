'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Package, Users, ShoppingBag, DollarSign, LogOut, Languages, Handshake } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { customer, signOut, loading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!customer || customer.role !== 'admin')) {
      router.push('/');
    }
  }, [customer, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('loading')}</div>;
  }

  if (!customer || customer.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">{t('admin_panel')}</h1>
          <LanguageSelector />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)]">
          <nav className="px-4 py-6 space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                {t('admin_home')}
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                {t('admin_dashboard')}
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                {t('admin_products')}
              </Button>
            </Link>
            <Link href="/admin/customers">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                {t('admin_customers')}
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingBag className="mr-2 h-4 w-4" />
                {t('admin_orders')}
              </Button>
            </Link>
            <Link href="/admin/price-types">
              <Button variant="ghost" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                {t('admin_price_types')}
              </Button>
            </Link>
            <Link href="/admin/translations">
              <Button variant="ghost" className="w-full justify-start">
                <Languages className="mr-2 h-4 w-4" />
                {t('admin_translations')}
              </Button>
            </Link>
            <Link href="/admin/partnerships">
              <Button variant="ghost" className="w-full justify-start">
                <Handshake className="mr-2 h-4 w-4" />
                {t('admin_partnerships')}
              </Button>
            </Link>
            <Link href="/admin/seed">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                {t('admin_seed_data')}
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('nav_logout')}
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

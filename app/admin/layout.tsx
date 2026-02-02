'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Package, Users, ShoppingBag, DollarSign, LogOut, Languages, Handshake, Settings } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-purple-100 min-h-screen shadow-lg">
          <div className="p-6 border-b border-purple-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Maniuz Admin
            </h1>
            <p className="text-xs text-gray-500 mt-1">Yönetim Paneli</p>
          </div>
          <nav className="px-4 py-6 space-y-1">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <Home className="mr-3 h-5 w-5" />
                {t('admin_home')}
              </Button>
            </Link>
            <Link href="/admin">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <Package className="mr-3 h-5 w-5" />
                {t('admin_dashboard')}
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-all font-medium"
              >
                <Package className="mr-3 h-5 w-5" />
                {t('admin_products')}
              </Button>
            </Link>
            <Link href="/admin/customers">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <Users className="mr-3 h-5 w-5" />
                {t('admin_customers')}
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                {t('admin_orders')}
              </Button>
            </Link>
            <Link href="/admin/price-types">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <DollarSign className="mr-3 h-5 w-5" />
                {t('admin_price_types')}
              </Button>
            </Link>
            <Link href="/admin/translations">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <Languages className="mr-3 h-5 w-5" />
                {t('admin_translations')}
              </Button>
            </Link>
            <Link href="/admin/partnerships">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <Handshake className="mr-3 h-5 w-5" />
                {t('admin_partnerships')}
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <Settings className="mr-3 h-5 w-5" />
                {t('admin_settings')}
              </Button>
            </Link>
            <Link href="/admin/seed">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <Package className="mr-3 h-5 w-5" />
                {t('admin_seed_data')}
              </Button>
            </Link>
            <div className="pt-4 mt-4 border-t border-purple-100">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-red-50 hover:text-red-600 transition-all"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                {t('nav_logout')}
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

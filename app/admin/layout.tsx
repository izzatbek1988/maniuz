'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Package, Users, ShoppingBag, DollarSign, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { customer, signOut, loading } = useAuth();
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
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (!customer || customer.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">Maniuz Admin</h1>
          </div>
          <nav className="px-4 space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfa
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Ürünler
              </Button>
            </Link>
            <Link href="/admin/customers">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Müşteriler
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Siparişler
              </Button>
            </Link>
            <Link href="/admin/price-types">
              <Button variant="ghost" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Fiyat Tipleri
              </Button>
            </Link>
            <Link href="/admin/seed">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Veri Ekle
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Package, Menu, X, Sparkles, Settings, FileText, UserCircle } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import LanguageSelector from '@/components/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, customer, signOut } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: t('nav_home') || 'Bosh sahifa' },
    { href: '/about', label: t('nav_about') || 'Haqimizda' },
    { href: '/partnership', label: t('nav_partnership') || 'Hamkorlik' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-blue-600 blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                Maniuz
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={`relative group ${
                      pathname === link.href ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                        pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Button>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>

              {user ? (
                <>
                  {/* Cart Button */}
                  <Link href="/cart">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative group hover:bg-blue-50 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  {/* Orders Button */}
                  <Link href="/orders" className="hidden sm:block">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-purple-50 transition-colors group"
                    >
                      <Package className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Button>
                  </Link>

                  {/* User Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                        <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border-gray-200 shadow-xl">
                      <DropdownMenuLabel className="font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                            {customer?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm">{customer?.name || t('nav_my_account')}</span>
                            <span className="text-xs text-gray-500 font-normal">{user.email}</span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>{t('nav_profile')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/orders')} className="cursor-pointer sm:hidden">
                        <Package className="mr-2 h-4 w-4" />
                        <span>{t('nav_orders')}</span>
                      </DropdownMenuItem>
                      {customer?.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push('/admin')} className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t('nav_admin')}</span>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t('nav_logout')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block">
                    <Button variant="outline" className="border-2 hover:border-blue-600 hover:text-blue-600 transition-colors">
                      {t('nav_login')}
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden sm:block">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      {t('nav_register')}
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-lg animate-slide-down">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {/* Mobile Nav Links */}
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${pathname === link.href ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}

              {/* Mobile Language Selector */}
              <div className="sm:hidden py-2">
                <LanguageSelector />
              </div>

              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="flex flex-col gap-2 pt-2 border-t sm:hidden">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t('nav_login')}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      {t('nav_register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
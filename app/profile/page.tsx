'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Tag, Shield, Calendar, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, customer } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [priceTypeName, setPriceTypeName] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (customer?.priceTypeId) {
      fetchPriceTypeName(customer.priceTypeId);
    }
  }, [user, customer, router]);

  const fetchPriceTypeName = async (priceTypeId: string) => {
    try {
      const priceTypeDoc = await getDoc(doc(db, 'priceTypes', priceTypeId));
      if (priceTypeDoc.exists()) {
        setPriceTypeName(priceTypeDoc.data().name);
      }
    } catch (error) {
      console.error('Error fetching price type:', error);
    }
  };

  if (!user || !customer) {
    return null;
  }

  const InfoItem = ({ icon: Icon, label, value, color = "blue" }: { icon: any, label: string, value: string, color?: string }) => (
    <div className="group p-5 rounded-xl border-2 border-gray-100 hover:border-blue-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-${color}-100 group-hover:scale-110 transition-transform`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <Label className="text-sm text-gray-500 font-medium mb-1 block">{label}</Label>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{t('profile_title')}</h1>
              <p className="text-gray-600 mt-1">{t('profile_subtitle') || 'Shaxsiy ma\'lumotlaringiz'}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto animate-slide-up">
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90 overflow-hidden">
            {/* Header with Avatar */}
            <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {customer.role === 'admin' && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    <Shield className="h-3 w-3" />
                    {t('profile_role_admin') || 'Admin'}
                  </span>
                </div>
              )}
            </div>

            <CardHeader className="pt-16 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {customer.name}
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {customer.role === 'admin' ? t('profile_role_admin') : t('profile_role_customer')}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pb-8">
              {/* Info Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem 
                  icon={Mail} 
                  label={t('profile_email')} 
                  value={customer.email}
                  color="blue"
                />
                
                {customer.phone && (
                  <InfoItem 
                    icon={Phone} 
                    label={t('profile_phone') || 'Telefon'} 
                    value={customer.phone}
                    color="green"
                  />
                )}
                
                <InfoItem 
                  icon={Tag} 
                  label={t('profile_price_type')} 
                  value={priceTypeName || t('loading')}
                  color="purple"
                />
                
                <InfoItem 
                  icon={Shield} 
                  label={t('profile_role')} 
                  value={customer.role === 'admin' ? t('profile_role_admin') : t('profile_role_customer')}
                  color="orange"
                />
              </div>

              {/* Member Since */}
              {customer.createdAt && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">
                      {t('profile_member_since') || 'A\'zo bo\'lgan sana'}:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {format(customer.createdAt.toDate(), 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
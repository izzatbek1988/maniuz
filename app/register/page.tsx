'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StoreLocationPicker from '@/components/StoreLocationPicker';
import { UserPlus, Mail, Lock, User, Phone, Loader2, CheckCircle2 } from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeCoordinates, setStoreCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const handleLocationSelect = (coords: Coordinates) => {
    setStoreCoordinates(coords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('validation_password_mismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('validation_password_length'));
      return;
    }

    if (!phone || phone.trim() === '') {
      setError(t('validation_phone_required') || 'Telefon raqami majburiy');
      return;
    }

    if (!storeCoordinates) {
      setError('Iltimos, do\'kon joylashuvini xaritadan tanlang!');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name, phone, storeCoordinates);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t('error'));
      } else {
        setError(t('error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Decorative Element */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 mb-4 shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('register_welcome') || "Boshlaylik!"}</h2>
            <p className="text-gray-600">{t('register_description') || 'Yangi hisob yaratish'}</p>
          </div>

          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90 animate-slide-up">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-center">
                {t('register_title')}
              </CardTitle>
              <CardDescription className="text-center text-base">
                {t('register_subtitle') || 'Yangi hisob yaratish'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-shake">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-green-500" />
                    {t('register_name')}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('register_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 border-2 focus:border-green-500 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    {t('login_email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 border-2 focus:border-blue-500 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-purple-500" />
                    {t('register_phone') || 'Telefon raqami'}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-11 border-2 focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-orange-500" />
                    {t('login_password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-2 focus:border-orange-500 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-pink-500" />
                    {t('register_confirm_password') || 'Parolni tasdiqlang'}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 border-2 focus:border-pink-500 transition-all"
                  />
                </div>

                {/* Store Location Picker */}
                <StoreLocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialCoords={{ lat: 41.311081, lng: 69.240562 }}
                />
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('loading')}
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      {t('register_button')}
                    </>
                  )}
                </Button>
                
                <div className="text-sm text-center text-gray-600 pt-2">
                  {t('register_have_account')}{' '}
                  <Link href="/login" className="text-green-600 hover:text-blue-600 font-semibold hover:underline transition-colors">
                    {t('nav_login')}
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            🔒 {t('secure_connection') || "Xavfsiz aloqa"}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
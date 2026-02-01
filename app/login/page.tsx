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
import { LogIn, Mail, Lock, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t('login_error'));
      } else {
        setError(t('login_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Decorative Element */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('login_welcome') || 'Xush kelibsiz!'}</h2>
            <p className="text-gray-600">{t('login_subtitle') || 'Davom etish uchun tizimga kiring'}</p>
          </div>

          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90 animate-slide-up">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                {t('login_title')}
              </CardTitle>
              <CardDescription className="text-center text-base">
                {t('login_description') || 'Hisobingizga kiring'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-shake">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
                
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
                  <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-500" />
                    {t('login_password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-2 focus:border-purple-500 transition-all"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('loading')}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      {t('login_button')}
                    </>
                  )}
                </Button>
                
                <div className="text-sm text-center text-gray-600 pt-2">
                  {t('login_no_account')}{' '}
                  <Link href="/register" className="text-blue-600 hover:text-purple-600 font-semibold hover:underline transition-colors">
                    {t('nav_register')}
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
          
          {/* Bottom decoration */}
          <p className="text-center text-sm text-gray-500 mt-6">
            🔒 {t('secure_connection') || "Xavfsiz aloqa"}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
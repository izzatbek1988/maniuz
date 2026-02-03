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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StoreLocationPicker from '@/components/StoreLocationPicker';
import { UserPlus, Mail, Lock, User, Phone, Loader2, CheckCircle2, MapPin, AtSign, Check, X, AlertCircle } from 'lucide-react';
import { validatePhone, formatPhoneInput, validateNickname } from '@/lib/validation';
import { useNicknameCheck } from '@/hooks/useNicknameCheck';
import { XORAZM_DISTRICTS } from '@/constants/districts';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');
  const [district, setDistrict] = useState('');
  const [storeCoordinates, setStoreCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();

  // Real-time nickname availability check
  const { checking: checkingNickname, available: nicknameAvailable } = useNicknameCheck(nickname);

  // Phone number validation state
  const phoneValid = phone ? validatePhone(phone) : null;

  // Nickname validation state
  const nicknameValidation = nickname ? validateNickname(nickname) : null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to lowercase and remove invalid characters
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setNickname(value);
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setStoreCoordinates({ lat, lng });
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

    // Validate phone format
    if (!validatePhone(phone)) {
      setError(t('phone_invalid') || 'Telefon raqami noto\'g\'ri formatda (+998XXXXXXXXX)');
      return;
    }

    // Validate nickname if provided
    if (nickname) {
      const nicknameVal = validateNickname(nickname);
      if (!nicknameVal.valid) {
        setError(t(nicknameVal.error || 'nickname_invalid') || 'Nickname noto\'g\'ri formatda');
        return;
      }

      // Check if nickname is available
      if (!nicknameAvailable) {
        setError(t('nickname_taken') || 'Bu nickname band');
        return;
      }
    }

    // Validate district
    if (!district) {
      setError(t('district_required') || 'Tumanni tanlang');
      return;
    }

    // Validate store location
    if (!storeCoordinates) {
      setError(t('location_required') || 'Do\'kon joylashuvini xaritada belgilang');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name, phone, nickname || undefined, district, storeCoordinates);
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
                    {t('phone_number') || 'Telefon raqami'}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+998901234567"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    className={`h-11 border-2 transition-all ${
                      phoneValid === true ? 'border-green-500' : phoneValid === false ? 'border-red-500' : 'focus:border-purple-500'
                    }`}
                  />
                  {phone && (
                    <p className={`text-xs ${phoneValid ? 'text-green-600' : 'text-red-600'}`}>
                      {phoneValid 
                        ? `✓ ${t('phone_valid') || 'To\'g\'ri format'}` 
                        : t('phone_format_hint') || 'Format: +998XXXXXXXXX (12 ta belgi)'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-sm font-semibold flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-indigo-500" />
                    {t('nickname') || 'Nickname'}
                    <span className="text-gray-500 text-xs font-normal">({t('optional') || 'ixtiyoriy'})</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="nickname"
                      type="text"
                      placeholder="mystore123"
                      value={nickname}
                      onChange={handleNicknameChange}
                      maxLength={20}
                      className={`h-11 border-2 transition-all pr-10 ${
                        nickname && nicknameValidation?.valid 
                          ? nicknameAvailable === true ? 'border-green-500' : nicknameAvailable === false ? 'border-red-500' : 'border-gray-300'
                          : 'focus:border-indigo-500'
                      }`}
                    />
                    {nickname && nicknameValidation?.valid && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {checkingNickname ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        ) : nicknameAvailable === true ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : nicknameAvailable === false ? (
                          <X className="h-4 w-4 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {nickname && (
                    <p className={`text-xs ${
                      !nicknameValidation?.valid 
                        ? 'text-red-600' 
                        : checkingNickname 
                          ? 'text-gray-600' 
                          : nicknameAvailable === true 
                            ? 'text-green-600' 
                            : nicknameAvailable === false 
                              ? 'text-red-600' 
                              : 'text-gray-600'
                    }`}>
                      {!nicknameValidation?.valid 
                        ? t(nicknameValidation?.error || 'nickname_invalid') || 'Nickname noto\'g\'ri formatda'
                        : checkingNickname 
                          ? t('checking_availability') || 'Tekshirilmoqda...'
                          : nicknameAvailable === true 
                            ? `✓ ${t('nickname_available') || 'Mavjud'}`
                            : nicknameAvailable === false 
                              ? `✗ ${t('nickname_taken') || 'Band'}`
                              : t('nickname_hint') || '3-20 belgi, faqat kichik harflar, raqamlar va _'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-500" />
                    {t('district_label') || 'Tuman'}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="h-11 border-2">
                      <SelectValue placeholder={t('district_placeholder') || 'Tumanni tanlang'} />
                    </SelectTrigger>
                    <SelectContent>
                      {XORAZM_DISTRICTS[language as keyof typeof XORAZM_DISTRICTS].map((dist) => (
                        <SelectItem key={dist} value={dist}>
                          {dist}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!district && (
                    <p className="text-xs text-gray-600">
                      {t('district_hint') || 'Xorazm viloyati tumanlaridan birini tanlang'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    {t('store_location') || 'Do\'kon joylashuvi'}
                    <span className="text-red-500">*</span>
                  </Label>
                  <StoreLocationPicker
                    onLocationChange={handleLocationChange}
                    initialLat={41.550151}
                    initialLng={60.627490}
                  />
                  {!storeCoordinates && (
                    <p className="text-xs text-gray-600">
                      {t('store_location_hint') || 'Xaritada do\'koningiz joylashuvini belgilang'}
                    </p>
                  )}
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
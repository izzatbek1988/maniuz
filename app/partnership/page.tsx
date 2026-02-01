'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  TrendingUp, 
  Megaphone, 
  Gift, 
  Truck, 
  Users, 
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  User,
  MessageSquare
} from 'lucide-react';

const benefits = [
  { key: 'partnership_benefit_1', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
  { key: 'partnership_benefit_2', icon: Megaphone, color: 'from-blue-500 to-cyan-600' },
  { key: 'partnership_benefit_3', icon: Gift, color: 'from-purple-500 to-pink-600' },
  { key: 'partnership_benefit_4', icon: Truck, color: 'from-orange-500 to-red-600' },
  { key: 'partnership_benefit_5', icon: Users, color: 'from-indigo-500 to-purple-600' },
];

export default function PartnershipPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addDoc(collection(db, 'partnerships'), {
        ...formData,
        status: 'pending',
        createdAt: Timestamp.now(),
        notes: ''
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Bizning hamkorimiz bo'ling</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
              {t('partnership_title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-up animation-delay-200">
              {t('partnership_content')}
            </p>
          </div>
        </div>
        
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16 flex-1 relative z-10 -mt-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Benefits Grid */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t('partnership_benefits')}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Afzalliklarimiz bilan tanishing va muvaffaqiyatli hamkorlik boshlang
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card 
                    key={benefit.key}
                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-transparent overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-lg font-medium leading-relaxed">
                          {t(benefit.key)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <Card className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
            <CardContent className="py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    500+
                  </div>
                  <div className="text-sm text-muted-foreground">Mahsulotlar</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    50+
                  </div>
                  <div className="text-sm text-muted-foreground">Hamkorlar</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">Qo'llab-quvvatlash</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">Ishonch</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card className="shadow-2xl border-2 animate-fade-in-up animation-delay-600">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
                {t('partnership_apply')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              {submitted ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    {t('partnership_success')}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Tez orada siz bilan bog'lanamiz!
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                  >
                    Yana ariza yuborish
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                      <span className="font-medium">{error}</span>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {t('partnership_your_name')}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12"
                        placeholder="Ismingizni kiriting"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {t('partnership_your_email')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-12"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {t('partnership_your_phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="h-12"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      {t('partnership_message')}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                      className="resize-none"
                      placeholder="Bizning hamkorligimiz haqida fikrlaringiz..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all group" 
                    disabled={loading}
                  >
                    {loading ? (
                      t('loading')
                    ) : (
                      <>
                        {t('partnership_submit')}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
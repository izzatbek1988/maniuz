'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'unread',
      });

      toast.success(t('message_sent') || 'Xabar yuborildi!', {
        duration: 3000,
        icon: '📨',
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error submitting message:', err);
      toast.error(t('error') || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('contact_title') || 'Biz bilan bog\'lanish'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('contact_description') || 'Savol yoki takliflaringiz bormi? Biz bilan bog\'laning!'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="glass-card-light p-8 animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Send className="h-6 w-6 text-blue-600" />
              {t('send_message') || 'Xabar yuborish'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t('full_name') || 'To\'liq ism'}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">{t('email_address') || 'Elektron pochta'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">{t('phone_number') || 'Telefon raqami'}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="message">{t('message') || 'Xabar'}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows={5}
                  className="mt-1"
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {loading ? (t('loading') || 'Yuklanmoqda...') : (t('send_message') || 'Xabar yuborish')} 📨
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Phone */}
            <div className="glass-card-light p-6 hover:shadow-xl transition-all animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t('phone_number') || 'Telefon raqami'}</h3>
                  <a href="tel:+998901234567" className="text-blue-600 hover:underline">
                    +998 90 123 45 67
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass-card-light p-6 hover:shadow-xl transition-all animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t('email_address') || 'Elektron pochta'}</h3>
                  <a href="mailto:info@maniuz.com" className="text-purple-600 hover:underline">
                    info@maniuz.com
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass-card-light p-6 hover:shadow-xl transition-all animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t('address') || 'Manzil'}</h3>
                  <p className="text-gray-600">
                    Toshkent shahar, O'zbekiston
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="glass-card-light p-6 hover:shadow-xl transition-all animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('working_hours') || 'Ish vaqti'}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between gap-4">
                      <span className="font-medium">{t('monday_friday') || 'Dushanba - Juma'}:</span>
                      <span className="text-gray-600">09:00 - 18:00</span>
                    </p>
                    <p className="flex justify-between gap-4">
                      <span className="font-medium">{t('saturday_sunday') || 'Shanba - Yakshanba'}:</span>
                      <span className="text-gray-600">10:00 - 16:00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

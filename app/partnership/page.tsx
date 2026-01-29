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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">{t('partnership_title')}</h1>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {t('partnership_content')}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{t('partnership_benefits')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{t('partnership_benefit_1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{t('partnership_benefit_2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{t('partnership_benefit_3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{t('partnership_benefit_4')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{t('partnership_benefit_5')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('partnership_apply')}</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md text-center">
                  {t('partnership_success')}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('partnership_your_name')}</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('partnership_your_email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('partnership_your_phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('partnership_message')}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('loading') : t('partnership_submit')}
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

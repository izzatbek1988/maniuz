'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">{t('about_title')}</h1>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about_content')}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('about_mission')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Maniuz is committed to providing the highest quality cold and energy drinks to our customers. 
                  We strive to deliver exceptional service and products that meet the needs of both retail and 
                  wholesale customers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('about_vision')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To become the leading distributor of cold and energy drinks in the region, known for our 
                  reliability, quality products, and exceptional customer service.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-2xl">{t('about_why_us')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Wide selection of premium cold and energy drinks</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Competitive pricing with flexible price types for different customer segments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Fast and reliable delivery service</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Excellent customer support</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Online ordering system for convenience</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

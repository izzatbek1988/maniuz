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
                  {t('about_mission_text')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('about_vision')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('about_vision_text')}
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
                  <span>{t('about_why_us_1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{t('about_why_us_2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{t('about_why_us_3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{t('about_why_us_4')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{t('about_why_us_5')}</span>
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

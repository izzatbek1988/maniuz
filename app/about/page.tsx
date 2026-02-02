'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  Target, 
  Trophy, 
  Shield, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Heart,
  Award
} from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: '10,000+', label: t('stats_customers') || 'Müşteri' },
    { icon: Building2, value: '500+', label: t('stats_products') || 'Ürün' },
    { icon: Trophy, value: '15+', label: t('stats_years') || 'Yıl Tecrübe' },
    { icon: Award, value: '98%', label: t('stats_satisfaction') || 'Memnuniyet' },
  ];

  const features = [
    {
      icon: Shield,
      title: t('about_why_us_1'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: t('about_why_us_2'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      title: t('about_why_us_3'),
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Sparkles,
      title: t('about_why_us_4'),
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: CheckCircle2,
      title: t('about_why_us_5'),
      color: 'from-orange-500 to-amber-500'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">{t('about_title')}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('about_title')}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {t('about_content')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200"
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl">
                    <stat.icon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{t('about_mission')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {t('about_mission_text')}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{t('about_vision')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {t('about_vision_text')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('about_why_us')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('about_why_us_subtitle') || 'Bizi tercih etmeniz için 5 önemli neden'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-purple-200 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <CardContent className="pt-6 pb-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed">
                      {feature.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-90" />
            <CardContent className="relative py-12 px-8 text-center text-white">
              <h3 className="text-3xl font-bold mb-4">
                {t('about_cta_title') || 'Hemen Alışverişe Başlayın!'}
              </h3>
              <p className="text-lg mb-6 opacity-90">
                {t('about_cta_text') || 'En kaliteli ürünleri keşfedin ve avantajlı fiyatlardan yararlanın.'}
              </p>
              <a 
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <Sparkles className="h-5 w-5" />
                {t('start_shopping') || 'Ürünleri İncele'}
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
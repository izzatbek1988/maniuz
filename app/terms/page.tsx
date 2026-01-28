'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">{t('footer_terms')}</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. General Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Welcome to Maniuz. By accessing and using this website, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Permission is granted to temporarily download one copy of the materials on Maniuz's website 
                for personal, non-commercial transitory viewing only.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Pricing and Orders</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                All prices are subject to change without notice. We reserve the right to refuse or cancel 
                any order for any reason. Different price types apply to different customer segments.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Delivery</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We offer both delivery and pickup options. Delivery times may vary depending on location 
                and availability. We are not responsible for delays caused by circumstances beyond our control.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Your privacy is important to us. We collect and process personal information in accordance 
                with applicable data protection laws. We do not share your personal information with third parties 
                without your consent.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                In no event shall Maniuz or its suppliers be liable for any damages arising out of the use 
                or inability to use the materials on our website or products purchased through our platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                If you have any questions about these Terms of Use, please contact us at info@maniuz.com 
                or +998 90 123 45 67.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

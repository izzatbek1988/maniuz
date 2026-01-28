'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">MANIUZ</h3>
            <p className="text-sm">
              {t('about_content')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer_company')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('footer_about')}
                </Link>
              </li>
              <li>
                <Link href="/partnership" className="hover:text-white transition-colors">
                  {t('footer_partnership')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('footer_contact')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t('footer_terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer_contact')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">{t('contact_phone')}:</span> +998 90 123 45 67
              </li>
              <li>
                <span className="font-medium">{t('contact_email')}:</span> info@maniuz.com
              </li>
              <li>
                <span className="font-medium">{t('contact_address')}:</span> Tashkent, Uzbekistan
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {currentYear} Maniuz. {t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  );
}

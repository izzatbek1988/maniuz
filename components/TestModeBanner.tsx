'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { AlertTriangle, X } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TestModeBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [testMode, setTestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for dismissed state
    const dismissed = localStorage.getItem('test-banner-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }

    // Real-time listener for test mode setting
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'siteConfig'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setTestMode(data?.testMode || false);
          
          // Reset visibility if test mode is re-enabled
          if (data?.testMode) {
            const dismissed = localStorage.getItem('test-banner-dismissed');
            if (dismissed !== 'true') {
              setIsVisible(true);
            }
          }
        } else {
          setTestMode(false);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching test mode:', error);
        setTestMode(false);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('test-banner-dismissed', 'true');
  };

  // Don't render if loading, not in test mode, or dismissed
  if (loading || !testMode || !isVisible) return null;

  return (
    <div className="sticky top-0 z-[60] bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white py-3 px-4 shadow-lg animate-in slide-in-from-top duration-300">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 animate-pulse flex-shrink-0" />
          <p className="font-semibold text-sm md:text-base">
            {t('test_mode_warning')}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          aria-label={t('close')}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

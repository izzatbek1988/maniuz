'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Translation, Language } from '@/types';

interface TranslationContextType {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  loading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const STORAGE_KEY = 'maniuz_language';
const DEFAULT_LANGUAGE: Language = 'uz';

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Translation>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language;
    if (savedLanguage && ['uz', 'tr', 'ru'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    fetchTranslations(language);
  }, [language]);

  const fetchTranslations = async (lang: Language) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'translations', lang);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setTranslations(docSnap.data() as Translation);
      } else {
        console.warn(`No translations found for language: ${lang}`);
        setTranslations({});
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
      setTranslations({});
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage, loading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

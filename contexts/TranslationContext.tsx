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

interface CachedTranslations {
  data: Record<string, string>;
  timestamp: number;
  language: string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const STORAGE_KEY = 'maniuz_language';
const CACHE_KEY = 'maniuz_translations';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const DEFAULT_LANGUAGE: Language = 'uz';

// Cache helper functions
const getCachedTranslations = (language: string): Record<string, string> | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const cached = localStorage.getItem(`${CACHE_KEY}_${language}`);
    if (!cached) return null;
    
    const parsed: CachedTranslations = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - parsed.timestamp < CACHE_DURATION && parsed.language === language) {
      console.log('✅ Translations loaded from cache');
      return parsed.data;
    }
    
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const setCachedTranslations = (language: string, data: Record<string, string>) => {
  try {
    if (typeof window === 'undefined') return;
    
    const cache: CachedTranslations = {
      data,
      timestamp: Date.now(),
      language
    };
    localStorage.setItem(`${CACHE_KEY}_${language}`, JSON.stringify(cache));
    console.log('✅ Translations cached');
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Translation>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load language preference from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language;
      if (savedLanguage && ['uz', 'tr', 'ru'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  const loadTranslations = async (lang: Language) => {
    // 1. First, check cache
    const cached = getCachedTranslations(lang);
    if (cached) {
      setTranslations(cached);
      setLoading(false);
      return;
    }
    
    // 2. If no cache, fetch from Firebase
    try {
      setLoading(true);
      const docRef = doc(db, 'translations', lang);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Translation;
        setTranslations(data);
        setCachedTranslations(lang, data); // Save to cache
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
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
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

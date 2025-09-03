
'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';
import { languages } from '@/locales/languages';

// Define the structure for your translations
interface Translations {
  [key: string]: string | Translations;
}

// Context for managing translation state
interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  T: (key: string) => string; // T for "translate"
  direction: 'ltr' | 'rtl';
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

// In-memory cache for loaded translation files
const translationsCache: { [key: string]: Translations } = {};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  const setLanguage = (lang: string) => {
    if (languages[lang]) {
      setLanguageState(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
      }
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = navigator.language.split('-')[0];

    let currentLang = 'en';
    if (savedLanguage && languages[savedLanguage]) {
      currentLang = savedLanguage;
    } else if (languages[browserLanguage]) {
      currentLang = browserLanguage;
    }
    
    setLanguageState(currentLang);
    if(languages[currentLang]) {
      setDirection(languages[currentLang].direction);
    }
    
    if (typeof window !== 'undefined' && !savedLanguage) {
      localStorage.setItem('language', currentLang);
    }
  }, []);

  // Load translations for the current language
  useEffect(() => {
    const loadTranslations = async () => {
      if (translationsCache[language]) {
        setTranslations(translationsCache[language]);
        return;
      }

      try {
        const module = await import(`@/locales/${language}.json`);
        translationsCache[language] = module.default;
        setTranslations(module.default);
        if(languages[language]) {
           setDirection(languages[language].direction);
        }
      } catch (error) {
        console.error(`Could not load translations for ${language}`, error);
        // Fallback to English if the selected language file fails to load
        if (language !== 'en') {
          setLanguage('en');
        }
      }
    };

    if (language) {
      loadTranslations();
    }
  }, [language]);

  // Function to get a nested translation string
  const T = useCallback(
    (key: string): string => {
      if (!translations) return key;
      const keys = key.split('.');
      let result: any = translations;
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
          // Return the key itself as a fallback
          return key;
        }
      }
      return typeof result === 'string' ? result : key;
    },
    [translations]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      T,
      direction,
    }),
    [language, T, direction]
  );

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

// Custom hook to use the translation context
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

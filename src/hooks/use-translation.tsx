
'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { handleTranslate } from '@/app/actions';
import { useToast } from './use-toast';

interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  translate: (text: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('English');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const translateAndCache = useCallback(
    async (text: string, lang: string) => {
      if (lang === 'English') {
        return text;
      }
      const cacheKey = `${lang}:${text}`;
      if (translations[cacheKey]) {
        return translations[cacheKey];
      }

      setIsTranslating(true);
      const result = await handleTranslate(text, lang);
      setIsTranslating(false);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Translation Failed',
          description: result.error,
        });
        return text; // Fallback to original text
      }

      if (result.translation) {
        setTranslations((prev) => ({ ...prev, [cacheKey]: result.translation! }));
        return result.translation;
      }

      return text;
    },
    [toast, translations]
  );
  
  const translate = useCallback(
    (text: string): string => {
       if (language === 'English') return text;
       const cacheKey = `${language}:${text}`;
       if (translations[cacheKey]) return translations[cacheKey];
       
       // Not ideal, but fire-and-forget the translation
       // The component will re-render once the translation is cached.
       translateAndCache(text, language);
       
       return text; // Return original text for now
    },
    [language, translations, translateAndCache]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      translate,
      isTranslating,
    }),
    [language, setLanguage, translate, isTranslating]
  );

  return (
    <TranslationContext.Provider value={contextValue}>
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

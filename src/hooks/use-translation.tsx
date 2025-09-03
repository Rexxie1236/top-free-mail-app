
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
import { handleTranslate } from '@/app/actions';
import { useToast } from './use-toast';

// A simple in-memory cache to hold translations.
const translationCache: Record<string, string> = {};

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
  const [language, setInternalLanguage] = useState('English');
  // This state will trigger re-renders when new translations are available.
  const [, setForceRender] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const setLanguage = useCallback((lang: string) => {
    setIsTranslating(true);
    setInternalLanguage(lang);
    // When language changes, we don't need to do anything else here.
    // The `translate` function will handle fetching what's needed.
  }, []);

  const translate = useCallback(
    (text: string): string => {
      // If we are in English, just return the text.
      if (language === 'English' || !text) {
        if (isTranslating) setIsTranslating(false);
        return text;
      }

      const cacheKey = `${language}:${text}`;

      // If the translation is already in our cache, return it.
      if (translationCache[cacheKey]) {
        if (isTranslating) setIsTranslating(false);
        return translationCache[cacheKey];
      }
      
      // If it's not in the cache, we need to fetch it.
      // We will return the original text for now, and the UI will update
      // automatically when the translation is loaded.
      
      // Use an immediately-invoked async function to fetch the translation.
      (async () => {
        try {
          const result = await handleTranslate(text, language);
          if (result.translation) {
            translationCache[cacheKey] = result.translation;
            // Force a re-render to show the new translation.
            setForceRender({}); 
          } else if (result.error) {
            // Only show toast on actual error, not just if translation is missing.
             toast({
                variant: 'destructive',
                title: 'Translation Failed',
                description: result.error,
              });
          }
        } catch (e) {
           toast({
              variant: 'destructive',
              title: 'Translation Error',
              description: 'An unexpected error occurred.',
            });
        } finally {
            // We can turn off the global spinner. Even if some translations are pending,
            // the UI is responsive.
            setIsTranslating(false);
        }
      })();

      // Return the original text while we wait for the translation.
      return text;
    },
    [language, toast, isTranslating]
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

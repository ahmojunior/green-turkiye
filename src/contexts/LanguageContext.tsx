import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { UI_STRINGS } from '../i18n/translations';

export type Lang = 'tr' | 'en' | 'de';

const STORAGE_KEY = 'gt_lang';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const warnedKeys = new Set<string>();

function readStoredLang(): Lang {
  if (typeof window === 'undefined') return 'tr';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'en' || stored === 'tr' || stored === 'de' ? stored : 'tr';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
  }, []);

  const t = useCallback((key: string): string => {
    const entry = UI_STRINGS[key];
    if (!entry) {
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        console.warn(`[i18n] Missing UI string for key: "${key}"`);
      }
      return key;
    }
    return entry[lang];
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

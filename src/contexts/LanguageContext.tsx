import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { UI_STRINGS } from '../i18n/translations';
import { LanguageContext, type Lang } from './language-context';

const STORAGE_KEY = 'gt_lang';

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
    // Screen readers take their pronunciation from this attribute, and the UI
    // defaults to Turkish — a static lang="en" had them read every label wrong.
    document.documentElement.lang = lang;
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


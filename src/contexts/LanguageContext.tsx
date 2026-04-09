import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { TRANSLATIONS } from '../data/translations';
import type { LanguageContextValue, Locale } from '../types';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [lang, setLang] = useState<Locale>('ja');
  const t = useMemo(() => TRANSLATIONS[lang], [lang]);
  const value = useMemo(() => ({ t, lang, setLang }), [t, lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useTranslations = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslations must be used within LanguageProvider');
  }
  return context;
};

import React, { createContext, useState, useContext } from 'react';
import { TRANSLATIONS } from '../data/translations'; // 确保路径正确

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ja');
  // 派生状态 t
  const t = TRANSLATIONS[lang];

  const value = { t, lang, setLang };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 创建一个自定义 Hook 方便使用
export const useTranslations = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslations 必须在 LanguageProvider 内部使用');
  }
  return context;
};
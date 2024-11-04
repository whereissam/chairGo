import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en';
import zh from './locales/zh';

// Get saved language from localStorage or use browser language detection
const savedLanguage = localStorage.getItem('language');
const userLanguage = navigator.language || navigator.userLanguage;
const defaultLanguage = savedLanguage || (userLanguage.startsWith('zh') ? 'zh' : 'en');

i18n
  .use(LanguageDetector) // Add language detector
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh }
    },
    lng: defaultLanguage,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n; 
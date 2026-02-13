import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';

// Define resources
const resources = {
    en: {
        common: enCommon,
    },
    ar: {
        common: arCommon,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'ar', // Default to Arabic for Omani System
        defaultNS: 'common', // Added default namespace to fix translation issues
        supportedLngs: ['ar', 'en'],
        interpolation: {
            escapeValue: false, // React already safes from XSS
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        react: {
            useSuspense: false,
        }
    });

// Handle RTL/LTR directionality
i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;

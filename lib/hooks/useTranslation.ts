import { useState } from 'react';
import { en } from '../translations/en';
import { ge } from '../translations/ge';

type Language = 'EN' | 'KA';

// Map language codes to translation objects
const translations = {
    EN: en,
    KA: ge,
};

export const useTranslation = () => {
    const [language, setLanguage] = useState<Language>('EN');

    // Get current translations
    const currentTranslations = translations[language];

    // Translation function - gets nested keys like 'toolbar.logo'
    const t = (key: string) => {
        const keys = key.split('.');
        let value: any = currentTranslations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = (value as any)[k];
            } else {
                // Fallback to English if translation missing
                const fallbackValue = translations.EN;
                for (const fallbackKey of keys) {
                    if (
                        fallbackValue &&
                        typeof fallbackValue === 'object' &&
                        fallbackKey in fallbackValue
                    ) {
                        value = (fallbackValue as any)[fallbackKey];
                    } else {
                        return key; // Return the key if no translation found
                    }
                }
                break;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return {
        language,
        setLanguage,
        t,
    };
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@/presentation/components/ui/inputs/Dropdown';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const languages = [
        { value: 'ar', label: 'العربية' },
        { value: 'en', label: 'English' }
    ];

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
    };

    return (
        <Dropdown
            options={languages}
            value={i18n.language}
            onChange={handleLanguageChange}
            trigger={
                <button className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-800 transition-colors text-white">
                    <Globe className="w-5 h-5" />
                    <span className="text-sm font-medium">{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
                </button>
            }
            position={i18n.dir() === 'rtl' ? 'bottom-left' : 'bottom-right'} // Adjust based on direction
        />
    );
};

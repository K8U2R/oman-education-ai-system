import React from 'react';
import { useTranslation } from 'react-i18next';
import './FooterBrand.scss';

export const FooterBrand: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="footer-brand">
            <h3 className="footer-brand__logo">
                {t('footer.brand.title')}
            </h3>
            <p className="footer-brand__desc">
                {t('footer.brand.description')}
            </p>
        </div>
    );
};

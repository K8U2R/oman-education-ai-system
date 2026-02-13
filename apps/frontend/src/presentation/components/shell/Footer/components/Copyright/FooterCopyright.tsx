import React from 'react';
import { useTranslation } from 'react-i18next';
import { LEGAL_LINKS } from '../../footer.constants';
import { FooterSocial } from '../Social/FooterSocial';
import './FooterCopyright.scss';

export const FooterCopyright: React.FC = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <div className="footer-copyright">
            <div className="footer-copyright__content">
                <p className="footer-copyright__text">
                    {t('footer.copyright', { year })}
                </p>

                <nav className="footer-copyright__legal" aria-label={t('footer.legal.aria_label')}>
                    <ul className="footer-copyright__legal-list">
                        {LEGAL_LINKS.map((link, index) => (
                            <li key={index} className="footer-copyright__legal-item">
                                <a href={link.href} className="footer-copyright__legal-link">
                                    {t(link.labelKey)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="footer-copyright__social-wrapper">
                <FooterSocial />
            </div>
        </div>
    );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FooterColumn } from '../../footer.constants';
import './FooterSection.scss';

interface FooterSectionProps {
    column: FooterColumn;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ column }) => {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <div className="footer-section">
            <h4 className="footer-section__heading">
                {t(column.titleKey)}
            </h4>
            <ul className="footer-section__list">
                {column.links.map((link, index) => {
                    const isActive = location.pathname === link.href;
                    const securityProps = link.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

                    return (
                        <li key={index} className="footer-section__item">
                            <a
                                href={link.href}
                                className={`footer-section__link ${isActive ? 'footer-section__link--active' : ''}`}
                                {...securityProps}
                            >
                                {t(link.labelKey)}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

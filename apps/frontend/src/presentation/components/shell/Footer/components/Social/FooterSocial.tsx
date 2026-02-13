import React from 'react';
import { SOCIAL_LINKS } from '../../footer.constants';
import './FooterSocial.scss';

export const FooterSocial: React.FC = () => {
    return (
        <div className="footer-social">
            {SOCIAL_LINKS.map((social, index) => {
                const securityProps = social.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
                return (
                    <a
                        key={index}
                        href={social.href}
                        className="footer-social__link"
                        aria-label={social.label}
                        {...securityProps}
                    >
                        {social.label}
                    </a>
                );
            })}
        </div>
    );
};

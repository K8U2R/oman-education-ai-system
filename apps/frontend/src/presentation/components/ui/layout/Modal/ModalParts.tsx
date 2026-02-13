/**
 * Modal Sub-components (Header & Overlay)
 * @law Law-10 (Modularity)
 */

import React from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.scss';
import { useTranslation } from 'react-i18next';

interface ModalHeaderProps {
    title?: string;
    description?: string;
    showCloseButton: boolean;
    onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, description, showCloseButton, onClose }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                {title && <h2 className={styles.title}>{title}</h2>}
                {description && <p className={styles.description}>{description}</p>}
            </div>
            {showCloseButton && (
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label={t('common.close')}
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

interface ModalOverlayProps {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, onClick }) => (
    <div className={styles.overlay} onClick={onClick}>
        {children}
    </div>
);

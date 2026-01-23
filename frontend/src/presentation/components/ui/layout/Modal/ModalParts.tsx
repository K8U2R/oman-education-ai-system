/**
 * Modal Sub-components (Header & Overlay)
 * @law Law-10 (Modularity)
 */

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../inputs/Button';

interface ModalHeaderProps {
    title?: string;
    description?: string;
    showCloseButton: boolean;
    onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, description, showCloseButton, onClose }) => (
    <div className="modal__header">
        {title && (
            <div className="modal__header-content">
                <h2 className="modal__title">{title}</h2>
                {description && <p className="modal__description">{description}</p>}
            </div>
        )}
        {showCloseButton && (
            <Button variant="ghost" size="sm" onClick={onClose} className="modal__close-button" aria-label="إغلاق">
                <X className="w-5 h-5" />
            </Button>
        )}
    </div>
);

interface ModalOverlayProps {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, onClick }) => (
    <div className="modal-overlay" onClick={onClick}>
        {children}
    </div>
);

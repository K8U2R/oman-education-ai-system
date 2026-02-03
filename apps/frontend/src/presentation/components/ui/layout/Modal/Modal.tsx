/**
 * Modal Component - مكون النافذة المنبثقة
 * @law Law-10 (Modularity) - Under 100 lines
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/classNames';
import { ModalHeader, ModalOverlay } from './ModalParts';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, description, children, size = 'md',
  showCloseButton = true, closeOnOverlayClick = true, closeOnEscape = true,
  footer, className = '',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => (e.key === 'Escape' && closeOnEscape) && onClose();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) =>
    (closeOnOverlayClick && e.target === e.currentTarget) && onClose();

  return createPortal(
    <ModalOverlay onClick={handleOverlayClick}>
      <div className={cn('modal', `modal--${size}`, className)} onClick={e => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <ModalHeader title={title} description={description} showCloseButton={showCloseButton} onClose={onClose} />
        )}
        <div className="modal__content">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </ModalOverlay>,
    document.body
  );
};

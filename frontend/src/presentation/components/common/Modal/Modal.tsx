/**
 * Modal Component - مكون النافذة المنبثقة
 *
 * مكون نافذة منبثقة قابلة لإعادة الاستخدام
 */

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../Button'
import { cn } from '../utils/classNames'
import './Modal.scss'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  footer?: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = '',
}) => {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const sizeClass = `modal--${size}`

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={cn('modal', sizeClass, className)} onClick={e => e.stopPropagation()}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && (
              <div className="modal__header-content">
                <h2 className="modal__title">{title}</h2>
                {description && <p className="modal__description">{description}</p>}
              </div>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="modal__close-button"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="modal__content">{children}</div>

        {/* Footer */}
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  )
}

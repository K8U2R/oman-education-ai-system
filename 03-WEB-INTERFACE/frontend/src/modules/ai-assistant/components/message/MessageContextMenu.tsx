import React, { useEffect, useRef } from 'react';
import {
  Copy,
  Edit,
  RotateCw,
  Flag,
  Trash2,
  Volume2,
  Check,
} from 'lucide-react';
import { Message } from '../MessageList';
import { MessageAction } from '../../types/chat.types';

interface MessageContextMenuProps {
  message: Message;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  onEdit?: () => void;
  onCopy: () => void;
  onRegenerate?: () => void;
  onReport?: () => void;
  onDelete: () => void;
  onTextToSpeech?: () => void;
  copied?: boolean;
}

/**
 * قائمة الإجراءات المنبثقة للرسائل
 * 
 * تعرض إجراءات مختلفة حسب نوع الرسالة (User/Assistant)
 * مع دعم كامل لـ RTL والتصميم المتجاوب
 */
export const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  message,
  isOpen,
  onClose,
  position,
  onEdit,
  onCopy,
  onRegenerate,
  onReport,
  onDelete,
  onTextToSpeech,
  copied = false,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * إغلاق القائمة عند النقر خارجها
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  /**
   * ضبط موضع القائمة لتجنب الخروج عن الشاشة
   */
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // ضبط الموضع الأفقي (RTL)
      if (rect.right > viewportWidth) {
        menu.style.left = `${viewportWidth - rect.width - 10}px`;
      } else if (rect.left < 0) {
        menu.style.left = '10px';
      }

      // ضبط الموضع العمودي
      if (rect.bottom > viewportHeight) {
        menu.style.top = `${viewportHeight - rect.height - 10}px`;
      } else if (rect.top < 0) {
        menu.style.top = '10px';
      }
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  const isUser = message.role === 'user';

  /**
   * بناء قائمة الإجراءات حسب نوع الرسالة
   */
  const actions: MessageAction[] = [
    // نسخ - متاح لجميع الرسائل
    {
      id: 'copy',
      label: copied ? 'تم النسخ' : 'نسخ',
      icon: copied ? Check : Copy,
      onClick: onCopy,
      show: true,
    },
    // إجراءات خاصة برسالة المستخدم
    ...(isUser
      ? [
          {
            id: 'edit',
            label: 'تعديل',
            icon: Edit,
            onClick: onEdit!,
            show: !!onEdit,
          },
        ]
      : [
          // إجراءات خاصة برسالة النظام
          {
            id: 'regenerate',
            label: 'إعادة توليد',
            icon: RotateCw,
            onClick: onRegenerate!,
            show: !!onRegenerate,
          },
          {
            id: 'report',
            label: 'الإبلاغ عن الرسالة',
            icon: Flag,
            onClick: onReport!,
            show: !!onReport,
            variant: 'warning' as const,
          },
          {
            id: 'tts',
            label: 'قراءة بصوت مسموع',
            icon: Volume2,
            onClick: onTextToSpeech!,
            show: !!onTextToSpeech,
          },
        ]),
    // حذف - متاح لجميع الرسائل
    {
      id: 'delete',
      label: 'حذف',
      icon: Trash2,
      onClick: onDelete,
      variant: 'danger' as const,
      show: true,
    },
  ].filter((action) => action.show) as MessageAction[];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-ide-surface border border-ide-border rounded-lg shadow-xl p-1 min-w-[180px] backdrop-blur-md animate-in fade-in slide-in-from-top-2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      dir="rtl"
      role="menu"
      aria-label="قائمة إجراءات الرسالة"
    >
      {actions.map((action) => {
        const Icon = action.icon;
        const variantClass =
          action.variant === 'danger'
            ? 'text-red-400 hover:bg-red-400/10 hover:text-red-300'
            : action.variant === 'warning'
            ? 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'
            : 'text-ide-text hover:bg-ide-border';

        return (
          <button
            key={action.id}
            onClick={() => {
              if (!action.disabled) {
                action.onClick();
                if (action.id !== 'copy') {
                  // إغلاق القائمة بعد الإجراء (ما عدا النسخ)
                  onClose();
                }
              }
            }}
            disabled={action.disabled}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-right ${variantClass} ${
              action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            role="menuitem"
            aria-label={action.label}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-right">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};


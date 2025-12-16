import React, { useState, useEffect, useRef } from 'react';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Message } from '../../components/MessageList';

interface MessageEditModeProps {
  message: Message;
  onSave: (editedContent: string) => void;
  onCancel: () => void;
}

/**
 * مكون وضع التعديل للرسائل
 * 
 * يعرض textarea قابلة للتعديل مع أزرار حفظ وإلغاء
 * يدعم التحذير عند الإلغاء مع وجود تغييرات
 */
export const MessageEditMode: React.FC<MessageEditModeProps> = ({
  message,
  onSave,
  onCancel,
}) => {
  const [editedContent, setEditedContent] = useState(message.content);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * ضبط ارتفاع textarea تلقائياً
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [editedContent]);

  /**
   * التركيز على textarea عند فتح وضع التعديل
   */
  useEffect(() => {
    textareaRef.current?.focus();
    // تحديد النص بالكامل
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  }, []);

  /**
   * التحقق من وجود تغييرات
   */
  useEffect(() => {
    setHasChanges(editedContent.trim() !== message.content.trim());
  }, [editedContent, message.content]);

  /**
   * معالج حفظ التعديلات
   */
  const handleSave = () => {
    const trimmedContent = editedContent.trim();
    if (trimmedContent && trimmedContent !== message.content.trim()) {
      onSave(trimmedContent);
    } else if (!trimmedContent) {
      // إذا كان النص فارغاً، إلغاء التعديل
      onCancel();
    }
  };

  /**
   * معالج الإلغاء مع التحذير
   */
  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'هل أنت متأكد من إلغاء التعديلات؟ سيتم فقدان جميع التغييرات.'
      );
      if (confirmed) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  /**
   * معالج ضغطات لوحة المفاتيح
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter: حفظ
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    // Escape: إلغاء
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-2">
      {/* حقل التعديل */}
      <textarea
        ref={textareaRef}
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="عدّل الرسالة..."
        dir="rtl"
        className="w-full px-4 py-3 rounded-xl bg-ide-bg/90 backdrop-blur-md border-2 border-ide-accent/50 text-ide-text placeholder:text-ide-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-ide-accent/60 focus:border-ide-accent transition-all duration-200 resize-none min-h-[80px] max-h-[200px] leading-relaxed font-normal selection:bg-ide-accent/30 selection:text-ide-text scrollbar-thin scrollbar-thumb-ide-border/50 scrollbar-track-transparent"
        style={{
          lineHeight: '1.5',
          letterSpacing: '0.01em',
        }}
      />

      {/* أزرار الإجراءات */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="text-ide-text-secondary hover:text-ide-text"
        >
          <X className="w-4 h-4 ml-1" />
          إلغاء
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || !editedContent.trim()}
          className="bg-gradient-to-r from-ide-accent via-blue-500 to-purple-600 hover:from-ide-accent-hover hover:via-blue-600 hover:to-purple-700"
        >
          <Save className="w-4 h-4 ml-1" />
          حفظ
        </Button>
      </div>

      {/* تلميح لوحة المفاتيح */}
      <p className="text-xs text-ide-text-secondary text-right">
        Ctrl+Enter للحفظ • Esc للإلغاء
      </p>
    </div>
  );
};


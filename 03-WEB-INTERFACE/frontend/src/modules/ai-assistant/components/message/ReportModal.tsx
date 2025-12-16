import React, { useState } from 'react';
import { Flag, Send, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Message } from '../MessageList';
import { ReportData } from '../../types/chat.types';

interface ReportModalProps {
  message: Message;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportData) => void;
}

/**
 * نموذج الإبلاغ عن رسالة AI
 * 
 * يسمح للمستخدم بالإبلاغ عن محتوى غير مناسب
 * مع خيارات محددة ووصف اختياري
 */
export const ReportModal: React.FC<ReportModalProps> = ({
  message,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState<ReportData['reason']>('inappropriate');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * خيارات أسباب الإبلاغ
   */
  const reportReasons: Array<{ value: ReportData['reason']; label: string }> = [
    { value: 'inappropriate', label: 'محتوى غير مناسب' },
    { value: 'off-topic', label: 'خارج السياق' },
    { value: 'incorrect', label: 'معلومات خاطئة' },
    { value: 'other', label: 'أخرى' },
  ];

  /**
   * معالج إرسال الإبلاغ
   */
  const handleSubmit = async () => {
    if (!reason) return;

    setIsSubmitting(true);
    try {
      const reportData: ReportData = {
        messageId: message.id,
        reason,
        description: description.trim() || undefined,
        timestamp: new Date(),
      };

      await onSubmit(reportData);
      
      // إعادة تعيين النموذج
      setReason('inappropriate');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * معالج الإلغاء
   */
  const handleCancel = () => {
    setReason('inappropriate');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="الإبلاغ عن الرسالة"
      size="md"
    >
      <div className="space-y-6" dir="rtl">
        {/* معلومات الرسالة */}
        <div className="p-4 bg-ide-surface border border-ide-border rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ide-accent/10 flex items-center justify-center">
              <Flag className="w-5 h-5 text-ide-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ide-text mb-1">
                الرسالة المبلغ عنها:
              </p>
              <p className="text-sm text-ide-text-secondary line-clamp-3 break-words">
                {message.content}
              </p>
            </div>
          </div>
        </div>

        {/* سبب الإبلاغ */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-ide-text">
            سبب الإبلاغ <span className="text-red-400">*</span>
          </label>
          <div className="space-y-2">
            {reportReasons.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 rounded-lg border border-ide-border hover:bg-ide-border/50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={option.value}
                  checked={reason === option.value}
                  onChange={(e) =>
                    setReason(e.target.value as ReportData['reason'])
                  }
                  className="w-4 h-4 text-ide-accent focus:ring-ide-accent focus:ring-offset-ide-bg"
                />
                <span className="text-sm text-ide-text flex-1 text-right">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* وصف إضافي */}
        <div className="space-y-2">
          <label
            htmlFor="report-description"
            className="block text-sm font-medium text-ide-text"
          >
            وصف إضافي (اختياري)
          </label>
          <textarea
            id="report-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="يرجى تقديم تفاصيل إضافية إن أمكن..."
            dir="rtl"
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 rounded-lg bg-ide-bg border border-ide-border text-ide-text placeholder:text-ide-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-ide-accent/50 focus:border-ide-accent transition-all resize-none"
          />
          <p className="text-xs text-ide-text-secondary text-left">
            {description.length}/500
          </p>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ide-border">
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-ide-text-secondary hover:text-ide-text"
          >
            <X className="w-4 h-4 ml-1" />
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            <Send className="w-4 h-4 ml-1" />
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال الإبلاغ'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


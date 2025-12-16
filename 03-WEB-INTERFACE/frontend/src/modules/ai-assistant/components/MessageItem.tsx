import React, { useState, useRef, memo } from 'react';
import { Bot, User, Edit, Copy, Trash2, RotateCw, Flag, Check } from 'lucide-react';
import { formatRelativeTime } from '@/utils/helpers';
import { Message } from './MessageList';
import { MessageEditMode } from '../text-input';
import { ReportModal } from './message/ReportModal';
import { ReportData } from '@/modules/ai-assistant/types/chat.types';

interface MessageItemProps {
  message: Message;
  onEdit?: (messageId: string, editedContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReport?: (data: ReportData) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onEdit,
  onRegenerate,
  onDelete,
  onReport,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  /**
   * معالج النسخ
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  /**
   * معالج التعديل
   */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /**
   * معالج حفظ التعديل
   */
  const handleSaveEdit = (editedContent: string) => {
    if (onEdit) {
      onEdit(message.id, editedContent);
    }
    setIsEditing(false);
  };

  /**
   * معالج إلغاء التعديل
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  /**
   * معالج إعادة التوليد
   */
  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id);
    }
  };

  /**
   * معالج الإبلاغ
   */
  const handleReport = () => {
    setShowReportModal(true);
  };

  /**
   * معالج إرسال الإبلاغ
   */
  const handleSubmitReport = async (data: ReportData) => {
    if (onReport) {
      await onReport(data);
    }
    setShowReportModal(false);
  };

  /**
   * معالج الحذف
   */
  const handleDelete = () => {
    const confirmed = window.confirm(
      'هل أنت متأكد من حذف هذه الرسالة؟'
    );
    if (confirmed && onDelete) {
      onDelete(message.id);
    }
  };

  // إذا كان في وضع التعديل، عرض MessageEditMode
  if (isEditing && isUser) {
    return (
      <div
        ref={messageRef}
        className={`flex gap-4 min-w-0 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Edit Mode */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 justify-end min-w-0">
            <span className="text-xs font-semibold text-ide-text truncate min-w-0">
              أنت
            </span>
            <span className="text-xs text-ide-text-secondary flex-shrink-0">
              {formatRelativeTime(message.timestamp)}
            </span>
            {message.isEdited && (
              <span className="text-xs text-ide-text-secondary/70 flex-shrink-0">
                (معدّل)
              </span>
            )}
          </div>
          <MessageEditMode
            message={message}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={messageRef}
        className={`flex gap-4 group animate-in fade-in slide-in-from-bottom-2 min-w-0 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        style={{ animationDuration: '0.3s' }}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 ${
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-ide-accent to-purple-600'
            }`}
          >
            {isUser ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
          {/* Header: Name, Time, Edited */}
          <div className={`flex items-center gap-2 mb-1.5 ${isUser ? 'justify-end' : 'justify-start'} min-w-0`}>
            <span className="text-xs font-semibold text-ide-text truncate min-w-0">
              {isUser ? 'أنت' : 'مساعد AI'}
            </span>
            <span className="text-xs text-ide-text-secondary flex-shrink-0">
              {formatRelativeTime(message.timestamp)}
            </span>
            {message.isEdited && (
              <span className="text-xs text-ide-text-secondary/70 flex-shrink-0">
                (معدّل)
              </span>
            )}
          </div>

          {/* Message Container: Bubble + Icons */}
          <div className="flex flex-col gap-1.5 min-w-0">
            {/* Message Bubble */}
            <div
              className={`relative inline-block max-w-[85%] sm:max-w-[75%] rounded-2xl shadow-md transition-all hover:shadow-lg min-w-0 chat-animate-fade-in ${
                isUser
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm self-end'
                  : 'bg-ide-surface border border-ide-border text-ide-text rounded-tl-sm self-start'
              }`}
            >
              <div className="p-4 min-w-0">
                <p className="whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base min-w-0">
                  {message.content}
                </p>
              </div>
            </div>

            {/* Action Icons - أسفل الرسالة */}
            <div
              className={`flex items-center gap-1.5 flex-shrink-0 opacity-30 group-hover:opacity-100 transition-all duration-200 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* لرسائل المستخدم: تعديل، نسخ، حذف */}
              {isUser && (
                <>
                  {/* زر التعديل */}
                  <button
                    onClick={handleEdit}
                    className="p-1.5 rounded-lg bg-ide-surface/60 hover:bg-ide-surface border border-ide-border/30 hover:border-ide-border/60 transition-all backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105"
                    title="تعديل"
                    aria-label="تعديل الرسالة"
                  >
                    <Edit className="w-4 h-4 text-ide-text" />
                  </button>

                  {/* زر النسخ */}
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-ide-surface/60 hover:bg-ide-surface border border-ide-border/30 hover:border-ide-border/60 transition-all backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105"
                    title="نسخ"
                    aria-label="نسخ الرسالة"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-ide-text" />
                    )}
                  </button>

                  {/* زر الحذف */}
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-lg bg-ide-surface/60 hover:bg-ide-surface border border-ide-border/30 hover:border-ide-border/60 transition-all backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105"
                    title="حذف"
                    aria-label="حذف الرسالة"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </>
              )}

              {/* لرسائل المساعد: إعادة توليد، نسخ، إبلاغ، قراءة صوتية، حذف */}
              {!isUser && (
                <>
                  {/* زر إعادة التوليد */}
                  <button
                    onClick={handleRegenerate}
                    className="p-1.5 rounded-lg bg-ide-surface/60 hover:bg-ide-surface border border-ide-border/30 hover:border-ide-border/60 transition-all backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105"
                    title="إعادة توليد"
                    aria-label="إعادة توليد الرد"
                  >
                    <RotateCw className="w-4 h-4 text-ide-text" />
                  </button>

                  {/* زر النسخ */}
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-ide-surface/60 hover:bg-ide-surface border border-ide-border/30 hover:border-ide-border/60 transition-all backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105"
                    title="نسخ"
                    aria-label="نسخ الرسالة"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-ide-text" />
                    )}
                  </button>

                  {/* زر الإبلاغ */}
                  <button
                    onClick={handleReport}
                    className="p-1.5 rounded-lg bg-ide-surface/60 hover:bg-ide-surface border border-ide-border/30 hover:border-ide-border/60 transition-all backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105"
                    title="الإبلاغ عن الرسالة"
                    aria-label="الإبلاغ عن الرسالة"
                  >
                    <Flag className="w-4 h-4 text-yellow-400" />
                  </button>

                  {/* زر الحذف */}
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-lg bg-ide-surface/60 hover:bg-ide-surface border border-ide-border/30 hover:border-ide-border/60 transition-all backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105"
                    title="حذف"
                    aria-label="حذف الرسالة"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          message={message}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleSubmitReport}
        />
      )}
    </>
  );
};

// Memoization مع مقارنة مخصصة لتحسين الأداء
export default memo(MessageItem, (prevProps, nextProps) => {
  // مقارنة الرسالة
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (prevProps.message.content !== nextProps.message.content) return false;
  if (prevProps.message.isEdited !== nextProps.message.isEdited) return false;
  if (prevProps.message.editedAt?.getTime() !== nextProps.message.editedAt?.getTime()) return false;
  
  // مقارنة المعالجات (إذا كانت متغيرة، يجب استخدام useCallback في المكون الأب)
  // لكن عادةً لا نحتاج لإعادة الرسم إذا كانت المعالجات متساوية
  
  return true; // لا حاجة لإعادة الرسم
});


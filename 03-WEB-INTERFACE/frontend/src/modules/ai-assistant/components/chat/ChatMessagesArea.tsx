import React from 'react';
import MessageList from '../MessageList';
import { Message } from '../MessageList';
import { ReportData } from '@/modules/ai-assistant/types/chat.types';

interface ChatMessagesAreaProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onEdit?: (messageId: string, editedContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReport?: (data: ReportData) => void;
}

/**
 * مكون منطقة عرض الرسائل
 */
export const ChatMessagesArea: React.FC<ChatMessagesAreaProps> = ({
  messages,
  isLoading,
  messagesEndRef,
  onEdit,
  onRegenerate,
  onDelete,
  onReport,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 chat-scrollbar">
      <MessageList
        messages={messages}
        onEdit={onEdit}
        onRegenerate={onRegenerate}
        onDelete={onDelete}
        onReport={onReport}
      />
      {isLoading && (
        <div
          className="flex items-center gap-3 text-ide-text-secondary animate-in fade-in slide-in-from-bottom-2"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <div
              className="w-2 h-2 bg-ide-accent rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 bg-ide-accent rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 bg-ide-accent rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          <span className="text-sm font-medium">جاري التفكير...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};


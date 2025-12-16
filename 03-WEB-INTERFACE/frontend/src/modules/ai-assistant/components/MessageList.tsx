import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';
import MessageItem from './MessageItem';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  editedAt?: Date; // تاريخ آخر تعديل
  isEdited?: boolean; // هل تم تعديل الرسالة
  originalContent?: string; // المحتوى الأصلي قبل التعديل
}

import { ReportData } from '@/modules/ai-assistant/types/chat.types';

interface MessageListProps {
  messages: Message[];
  onEdit?: (messageId: string, editedContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReport?: (data: ReportData) => void;
}

const MessageList: React.FC<MessageListProps> = memo(({
  messages,
  onEdit,
  onRegenerate,
  onDelete,
  onReport,
}) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-ide-text-secondary animate-in fade-in">
          <div className="w-16 h-16 bg-ide-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-ide-accent" />
          </div>
          <p className="text-lg mb-2 font-semibold">ابدأ المحادثة مع AI</p>
          <p className="text-sm">اكتب رسالتك في الأسفل للبدء</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          onEdit={onEdit}
          onRegenerate={onRegenerate}
          onDelete={onDelete}
          onReport={onReport}
        />
      ))}
    </>
  );
}, (prevProps, nextProps) => {
  // مقارنة فقط عدد الرسائل و IDs
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  
  // مقارنة IDs للتأكد من عدم تغيير الرسائل
  return prevProps.messages.every((msg, i) => {
    const nextMsg = nextProps.messages[i];
    return nextMsg && msg.id === nextMsg.id && msg.content === nextMsg.content;
  });
});

MessageList.displayName = 'MessageList';

export default MessageList;


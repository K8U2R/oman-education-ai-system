import React from 'react';
import { Message } from '../components/MessageList';

/**
 * رسالة محادثة محسّنة مع دعم التعديل
 */
export interface EnhancedMessage extends Message {
  editedAt?: Date; // تاريخ آخر تعديل
  isEdited?: boolean; // هل تم تعديل الرسالة
  originalContent?: string; // المحتوى الأصلي قبل التعديل
}

/**
 * إجراء في قائمة الإجراءات
 */
export interface MessageAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'warning';
  show?: boolean; // للتحكم في إظهار/إخفاء الإجراء
}

/**
 * بيانات الإبلاغ عن رسالة
 */
export interface ReportData {
  messageId: string;
  reason: 'inappropriate' | 'off-topic' | 'incorrect' | 'other';
  description?: string;
  timestamp: Date;
}

/**
 * حالة المحادثة الكاملة
 */
export interface ChatState {
  message: string;
  messages: Message[];
  isLoading: boolean;
  selectedFiles: File[];
  searchQuery: string;
  showSearch: boolean;
  showHistory: boolean;
  showTemplates: boolean;
  showSidebar: boolean;
  showNavigationModal: boolean;
  suggestedPage: PageSuggestion | null;
  lastSendTime: number;
}

/**
 * اقتراح صفحة للانتقال إليها
 */
export interface PageSuggestion {
  path: string;
  title: string;
  description: string;
}

/**
 * جميع الـ Refs المستخدمة في المحادثة
 */
export interface ChatRefs {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  folderInputRef: React.RefObject<HTMLInputElement>;
  centerInputRef: React.RefObject<HTMLTextAreaElement>;
  regularInputRef: React.RefObject<HTMLTextAreaElement>;
}

/**
 * دوال تحديث الحالة
 */
export interface ChatStateSetters {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTemplates: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setShowNavigationModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSuggestedPage: React.Dispatch<React.SetStateAction<PageSuggestion | null>>;
  setLastSendTime: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * قيمة إرجاع useChatState
 */
export interface UseChatStateReturn {
  state: ChatState;
  refs: ChatRefs;
  setters: ChatStateSetters;
}


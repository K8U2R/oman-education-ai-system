import { useState, useRef } from 'react';
import { ChatState, ChatRefs, ChatStateSetters, UseChatStateReturn } from '../types/chat.types';

/**
 * Hook لإدارة حالة المحادثة والـ refs
 */
export function useChatState(): UseChatStateReturn {
  // States
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatState['messages']>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showNavigationModal, setShowNavigationModal] = useState<boolean>(false);
  const [suggestedPage, setSuggestedPage] = useState<ChatState['suggestedPage']>(null);
  const [lastSendTime, setLastSendTime] = useState<number>(0);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const centerInputRef = useRef<HTMLTextAreaElement>(null);
  const regularInputRef = useRef<HTMLTextAreaElement>(null);

  const state: ChatState = {
    message,
    messages,
    isLoading,
    selectedFiles,
    searchQuery,
    showSearch,
    showHistory,
    showTemplates,
    showSidebar,
    showNavigationModal,
    suggestedPage,
    lastSendTime,
  };

  const refs: ChatRefs = {
    messagesEndRef,
    fileInputRef,
    folderInputRef,
    centerInputRef,
    regularInputRef,
  };

  const setters: ChatStateSetters = {
    setMessage,
    setMessages,
    setIsLoading,
    setSelectedFiles,
    setSearchQuery,
    setShowSearch,
    setShowHistory,
    setShowTemplates,
    setShowSidebar,
    setShowNavigationModal,
    setSuggestedPage,
    setLastSendTime,
  };

  return { state, refs, setters };
}


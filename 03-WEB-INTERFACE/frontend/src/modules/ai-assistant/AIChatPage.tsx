import React, { useEffect, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { useChatState } from './hooks/useChatState';
import { useFileHandlers } from './hooks/useFileHandlers';
import { useMessageHandlers } from './hooks/useMessageHandlers';
import { useChatHistory } from './hooks/useChatHistory';
import { useKeyboardShortcuts, exportChat, ChatInput } from './text-input';
import { ChatHeader } from './components/chat/ChatHeader';
import { ChatWelcomeView } from './components/chat/ChatWelcomeView';
import { ChatSearchBar } from './components/chat/ChatSearchBar';
import { ChatMessagesArea } from './components/chat/ChatMessagesArea';
import ChatSidebar from './components/ChatSidebar';
import ChatHistory from './components/ChatHistory';
import MessageTemplates from './components/MessageTemplates';
import NavigationModal from './components/NavigationModal';
import { ChatErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/logger';
import { StorageManager } from './utils/storageManager';
import './styles/chat-theme.css';

/**
 * صفحة المحادثة الرئيسية مع AI
 */
const AIChatPage: React.FC = () => {
  // إدارة الحالة والـ refs
  const { state, refs, setters } = useChatState();
  const chatHistory = useChatHistory();

  // معالجة الملفات
  const fileHandlers = useFileHandlers(
    state.selectedFiles,
    setters.setSelectedFiles,
    refs.fileInputRef,
    refs.folderInputRef
  );

  // معالجة الرسائل
  const messageHandlers = useMessageHandlers(state, setters, chatHistory, {
    centerInputRef: refs.centerInputRef,
    regularInputRef: refs.regularInputRef,
  });

  // التمرير التلقائي للأسفل
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      refs.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [refs.messagesEndRef]);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  // حفظ المسودة تلقائياً
  useEffect(() => {
    if (state.message.trim()) {
      StorageManager.safeSetItem('ai-chat-draft', state.message);
    } else {
      StorageManager.safeRemoveItem('ai-chat-draft');
    }
  }, [state.message]);

  // تحميل رسائل الجلسة الحالية عند تحميل الصفحة أو تغيير الجلسة
  useEffect(() => {
    // فقط إذا لم تكن هناك رسائل محملة حالياً
    if (state.messages.length === 0 && chatHistory.currentSessionId) {
      const session = chatHistory.getSession(chatHistory.currentSessionId);
      if (session && session.messages.length > 0) {
        setters.setMessages(session.messages);
        logger.info('تم تحميل رسائل الجلسة الحالية', { 
          sessionId: chatHistory.currentSessionId,
          messagesCount: session.messages.length 
        });
      }
    }
  }, [chatHistory.currentSessionId, chatHistory.sessions.length, chatHistory.getSession, setters, state.messages.length]);

  // حفظ الرسائل في التاريخ (debounced)
  useEffect(() => {
    if (state.messages.length > 0 && chatHistory.currentSessionId && state.messages.length > 1) {
      const timer = setTimeout(() => {
        chatHistory.updateSession(chatHistory.currentSessionId!, state.messages);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.messages.length, chatHistory.currentSessionId, chatHistory.updateSession, state.messages, chatHistory]);

  // تحميل المسودة عند التحميل (فقط إذا لم تكن هناك رسائل)
  useEffect(() => {
    if (state.messages.length === 0) {
      const draft = StorageManager.safeGetItem('ai-chat-draft');
      if (draft) {
        setters.setMessage(draft);
      }
      if (refs.centerInputRef.current) {
        refs.centerInputRef.current.focus();
      }
    }
  }, [state.messages.length, setters, refs.centerInputRef]);

  // اختصارات لوحة المفاتيح
  useKeyboardShortcuts({
    onFocusInput: () => {
      const input = state.messages.length === 0 ? refs.centerInputRef.current : refs.regularInputRef.current;
      input?.focus();
    },
    onClearChat: messageHandlers.handleClearChat,
    onCloseModal: () => {
      setters.setShowNavigationModal(false);
      setters.setShowSearch(false);
    },
    onSendMessage: () => {
      if (state.message.trim() && !state.isLoading) {
        messageHandlers.handleSend();
      }
    },
    onSearch: () => {
      setters.setShowSearch(true);
    },
  });

  // تصفية الرسائل للبحث
  const filteredMessages = useMemo(() => {
    if (!state.searchQuery.trim()) return state.messages;
    const query = state.searchQuery.toLowerCase();
    return state.messages.filter((msg) => msg.content.toLowerCase().includes(query));
  }, [state.messages, state.searchQuery]);

  return (
    <ChatErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('خطأ في AIChatPage', error, {
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <div className="h-screen bg-ide-bg w-full flex overflow-hidden flex-row-reverse min-w-0 chat-container">
      {/* Sidebar - RTL: على اليسار */}
      {state.showSidebar && state.messages.length > 0 && (
        <ChatSidebar
          messages={state.messages}
          onSelectSession={messageHandlers.handleSelectSession}
          onSelectTemplate={messageHandlers.handleSelectTemplate}
          onExportChat={() => exportChat(state.messages, 'json')}
          currentSessionId={chatHistory.currentSessionId}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="w-full max-w-full flex flex-col h-full px-2 sm:px-4 md:px-6 lg:px-8 min-w-0">
          {/* Header */}
          <ChatHeader
            messagesCount={state.messages.length}
            showSidebar={state.showSidebar}
            onToggleSidebar={() => setters.setShowSidebar(!state.showSidebar)}
            onShowSearch={() => setters.setShowSearch(!state.showSearch)}
            onShowHistory={() => setters.setShowHistory(true)}
            onExportChat={() => exportChat(state.messages, 'json')}
            onShowTemplates={() => setters.setShowTemplates(true)}
          />

          {/* Chat Container */}
          <Card className="flex-1 flex flex-col my-2 sm:my-4 md:my-6 min-h-0 shadow-2xl border border-ide-border/30 bg-ide-surface/40 backdrop-blur-sm chat-surface">
            {state.messages.length === 0 ? (
              /* Welcome View - First Time */
              <ChatWelcomeView
                message={state.message}
                setMessage={setters.setMessage}
                selectedFiles={state.selectedFiles}
                onFileSelect={fileHandlers.handleFileSelect}
                onFolderSelect={fileHandlers.handleFolderSelect}
                onRemoveFile={fileHandlers.handleRemoveFile}
                onSend={messageHandlers.handleSend}
                isLoading={state.isLoading}
                fileInputRef={refs.fileInputRef}
                folderInputRef={refs.folderInputRef}
                centerInputRef={refs.centerInputRef}
              />
            ) : (
              <>
                {/* Search Bar */}
                {state.showSearch && (
                  <ChatSearchBar
                    searchQuery={state.searchQuery}
                    setSearchQuery={setters.setSearchQuery}
                    filteredCount={filteredMessages.length}
                    totalCount={state.messages.length}
                    onFileSelect={fileHandlers.handleFileSelect}
                    onFolderSelect={fileHandlers.handleFolderSelect}
                    fileInputRef={refs.fileInputRef}
                    folderInputRef={refs.folderInputRef}
                  />
                )}

                {/* Messages Area */}
                <ChatMessagesArea
                  messages={state.searchQuery ? filteredMessages : state.messages}
                  isLoading={state.isLoading}
                  messagesEndRef={refs.messagesEndRef}
                  onEdit={messageHandlers.handleEditMessage}
                  onRegenerate={messageHandlers.handleRegenerateResponse}
                  onDelete={messageHandlers.handleDeleteMessage}
                  onReport={messageHandlers.handleReportMessage}
                />

                {/* Input Area */}
                <div className="flex-shrink-0 p-3 sm:p-4 md:p-6 border-t border-ide-border/50 bg-gradient-to-t from-ide-surface/60 via-ide-surface/40 to-transparent backdrop-blur-md">
                  <ChatInput
                    message={state.message}
                    setMessage={setters.setMessage}
                    onSend={messageHandlers.handleSend}
                    isLoading={state.isLoading}
                    selectedFiles={state.selectedFiles}
                    onFileSelect={fileHandlers.handleFileSelect}
                    onFolderSelect={fileHandlers.handleFolderSelect}
                    onRemoveFile={fileHandlers.handleRemoveFile}
                    variant="regular"
                    fileInputRef={refs.fileInputRef}
                    folderInputRef={refs.folderInputRef}
                    inputRef={refs.regularInputRef}
                  />
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Navigation Modal */}
      {state.showNavigationModal && state.suggestedPage && (
        <NavigationModal
          page={state.suggestedPage}
          onNavigate={messageHandlers.handleNavigate}
          onDismiss={messageHandlers.handleDismissSuggestion}
        />
      )}

      {/* Chat History Modal */}
      {state.showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <ChatHistory
            onSelectSession={messageHandlers.handleSelectSession}
            onClose={() => setters.setShowHistory(false)}
          />
        </div>
      )}

      {/* Message Templates Modal */}
      {state.showTemplates && (
        <Modal
          isOpen={state.showTemplates}
          onClose={() => setters.setShowTemplates(false)}
          title="قوالب سريعة"
          size="lg"
        >
          <MessageTemplates onSelect={messageHandlers.handleSelectTemplate} />
        </Modal>
      )}
      </div>
    </ChatErrorBoundary>
  );
};

export default AIChatPage;

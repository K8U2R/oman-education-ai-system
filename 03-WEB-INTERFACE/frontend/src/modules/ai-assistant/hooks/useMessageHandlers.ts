import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from '../components/MessageList';
import { ChatState, ChatStateSetters } from '../types/chat.types';
import { ReportData } from '../types/chat.types';
import { aiService } from '@/services/api/ai-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useChatHistory } from './useChatHistory';
import { validateMessageForSend } from '../text-input';
import { retryApiCall } from '../utils/retryHandler';
import { StorageManager } from '../utils/storageManager';
import { logger } from '../utils/logger';

const MIN_SEND_INTERVAL = 1000; // 1 second

/**
 * Hook لمعالجة الرسائل والتفاعل مع AI
 */
export function useMessageHandlers(
  state: ChatState,
  setters: ChatStateSetters,
  chatHistory: ReturnType<typeof useChatHistory>,
  refs: {
    centerInputRef: React.RefObject<HTMLTextAreaElement>;
    regularInputRef: React.RefObject<HTMLTextAreaElement>;
  }
) {
  const navigate = useNavigate();
  const { handleError, showSuccess, showWarning } = useErrorHandler();

  const handleSend = useCallback(async () => {
    const { message, messages, isLoading, lastSendTime } = state;
    const {
      setMessage: setMessageState,
      setMessages,
      setIsLoading,
      setLastSendTime,
      setSuggestedPage,
      setShowNavigationModal,
    } = setters;

    if (!message.trim() || isLoading) return;

    // التحقق من صحة الرسالة
    const validation = validateMessageForSend(message.trim());
    if (!validation.canSend) {
      handleError(new Error(validation.error || 'رسالة غير صالحة'), 'خطأ في الرسالة');
      return;
    }

    // عرض التحذيرات إن وجدت
    if (validation.warnings && validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        logger.warn('تحذير في الرسالة', { warning });
      });
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastSendTime < MIN_SEND_INTERVAL) {
      showWarning('يرجى الانتظار', 'يرجى الانتظار قليلاً قبل إرسال رسالة أخرى');
      return;
    }
    setLastSendTime(now);

    // استخدام الرسالة المُنظفة
    const sanitizedMessage = validation.sanitized || message.trim();

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: sanitizedMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = sanitizedMessage;
    setMessageState('');
    StorageManager.safeRemoveItem('ai-chat-draft');
    setIsLoading(true);

    try {
      // الحصول على رد + تحليل نية من Backend/Gemini مع Retry
      let aiResponse: { message: string; intent?: import('@/services/api/ai-service').AIIntentSuggestion | null };
      try {
        const response = await retryApiCall(
          () =>
            aiService.sendMessageWithIntent(
              [
                ...messages.map((m) => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content })),
                { role: 'user', content: currentMessage },
              ],
              {}
            ),
          {
            onRetry: (attempt, error) => {
              logger.warn(`إعادة محاولة إرسال الرسالة (المحاولة ${attempt})`, { error: error.message });
            },
          }
        );
        aiResponse = {
          message: response.message || 'أفهم طلبك، دعني أساعدك...',
          intent: response.intent,
        };
        logger.info('تم الحصول على رد من AI (مع تحليل النية) بنجاح');
      } catch (apiError) {
        // في حالة فشل API بعد إعادة المحاولة، استخدم رسالة خطأ ودية بدون منطق يدوي قديم
        logger.error(
          'فشل التواصل مع AI Intent API',
          apiError instanceof Error ? apiError : new Error(String(apiError))
        );
        aiResponse = {
          message: 'عذراً، تعذر الوصول إلى خدمة الذكاء الاصطناعي حالياً. يرجى المحاولة مرة أخرى لاحقاً.',
        };
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      // حفظ في التاريخ (فوري بعد الإرسال)
      if (chatHistory.currentSessionId) {
        chatHistory.updateSession(chatHistory.currentSessionId, updatedMessages);
      } else {
        chatHistory.createSession(updatedMessages);
      }

      // إذا كان هناك اقتراح صفحة من Backend/Gemini، عرض التنبيه
      if (aiResponse.intent?.suggested_path && aiResponse.intent.suggested_title) {
        setSuggestedPage({
          path: aiResponse.intent.suggested_path,
          title: aiResponse.intent.suggested_title,
          description: aiResponse.intent.suggested_description || '',
          icon: undefined,
        });
        setShowNavigationModal(true);
      }
    } catch (error) {
      handleError(error, 'خطأ في التواصل مع AI');
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'عذراً، حدث خطأ في التواصل مع خدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [state, setters, chatHistory, handleError, showWarning]);

  const handleClearChat = useCallback(() => {
    const { setMessages, setMessage, setSelectedFiles, setShowNavigationModal } = setters;
    if (window.confirm('هل أنت متأكد من مسح جميع الرسائل؟')) {
      setMessages([]);
      setMessage('');
      setSelectedFiles([]);
      StorageManager.safeRemoveItem('ai-chat-draft');
      chatHistory.setCurrentSessionId(null);
      setShowNavigationModal(false);
      showSuccess('تم المسح', 'تم مسح جميع الرسائل بنجاح');
    }
  }, [setters, chatHistory, showSuccess]);

  const handleSelectSession = useCallback(
    (sessionMessages: Message[]) => {
      const { setMessages, setShowHistory } = setters;
      setMessages(sessionMessages);
      setShowHistory(false);
      showSuccess('تم التحميل', 'تم تحميل المحادثة بنجاح');
    },
    [setters, showSuccess]
  );

  const handleSelectTemplate = useCallback(
    (text: string) => {
      const { setMessage, setShowTemplates } = setters;
      setMessage(text);
      setShowTemplates(false);
      const input = state.messages.length === 0 ? refs.centerInputRef.current : refs.regularInputRef.current;
      input?.focus();
    },
    [setters, state.messages.length, refs]
  );

  const handleNavigate = useCallback(() => {
    if (state.suggestedPage) {
      showSuccess('جاري الانتقال', `سيتم نقلك إلى ${state.suggestedPage.title}`);
      setTimeout(() => {
        navigate(state.suggestedPage!.path);
      }, 500);
    }
  }, [state.suggestedPage, navigate, showSuccess]);

  const handleDismissSuggestion = useCallback(() => {
    const { setShowNavigationModal, setSuggestedPage } = setters;
    setShowNavigationModal(false);
    setSuggestedPage(null);
  }, [setters]);

  /**
   * معالج تعديل رسالة المستخدم
   */
  const handleEditMessage = useCallback(
    async (messageId: string, editedContent: string) => {
      const { setMessages: setMessagesState, setIsLoading } = setters;

      // العثور على الرسالة المراد تعديلها
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1 || messages[messageIndex].role !== 'user') {
        showWarning('خطأ', 'لا يمكن تعديل هذه الرسالة');
        return;
      }

      const originalMessage = messages[messageIndex];
      const originalContent = originalMessage.content;

      // التحقق من صحة الرسالة المعدلة
      const { validateMessageForEdit } = await import('../text-input');
      const validation = validateMessageForEdit(originalContent, editedContent);
      if (!validation.valid) {
        handleError(new Error(validation.error || 'رسالة غير صالحة'), 'خطأ في الرسالة المعدلة');
        return;
      }

      const sanitizedContent = validation.sanitized || editedContent;

      // تحديث الرسالة
      const updatedMessage: Message = {
        ...originalMessage,
        content: sanitizedContent,
        isEdited: true,
        editedAt: new Date(),
        originalContent: originalContent,
      };

      // تحديث قائمة الرسائل
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = updatedMessage;

      // حذف جميع رسائل AI التي تلي الرسالة المعدلة
      const messagesAfterEdit = updatedMessages.slice(0, messageIndex + 1);
      setMessagesState(messagesAfterEdit);

      // إعادة إرسال الرسالة المعدلة
      setIsLoading(true);
      try {
        let aiResponse: { message: string };

        try {
          const response = await retryApiCall(
            () =>
              aiService.sendMessageWithIntent(
                [
                  ...messagesAfterEdit
                    .slice(0, -1)
                    .map((m) => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content })),
                  { role: 'user', content: sanitizedContent },
                ],
                { }
              ),
            {
              onRetry: (attempt, error) => {
                logger.warn(`إعادة محاولة تعديل الرسالة (المحاولة ${attempt})`, { error: error.message });
              },
            }
          );
          aiResponse = { message: response.message || 'أفهم طلبك، دعني أساعدك...' };
          logger.info('تم تعديل الرسالة وإعادة إرسالها بنجاح (مع تحليل نية محدث في الخلفية)');
        } catch (apiError) {
          logger.error(
            'فشل تعديل الرسالة عبر AI Intent API',
            apiError instanceof Error ? apiError : new Error(String(apiError))
          );
          aiResponse = {
            message: 'عذراً، تعذر إعادة توليد الرد بعد تعديل الرسالة. يرجى المحاولة مرة أخرى لاحقاً.',
          };
        }

        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: aiResponse.message,
          timestamp: new Date(),
        };

        setMessagesState([...messagesAfterEdit, assistantMessage]);

        // حفظ في التاريخ
        if (chatHistory.currentSessionId) {
          chatHistory.updateSession(chatHistory.currentSessionId, [
            ...messagesAfterEdit,
            assistantMessage,
          ]);
        }

        showSuccess('تم التعديل', 'تم تعديل الرسالة وإعادة إرسالها بنجاح');
      } catch (error) {
        handleError(error, 'خطأ في تعديل الرسالة');
      } finally {
        setIsLoading(false);
      }
    },
    [state, setters, chatHistory, handleError, showSuccess, showWarning]
  );

  /**
   * معالج إعادة توليد رد النظام
   */
  const handleRegenerateResponse = useCallback(
    async (assistantMessageId: string) => {
      const { setMessages: setMessagesState, setIsLoading } = setters;

      // العثور على رسالة AI المراد إعادة توليدها
      const assistantIndex = messages.findIndex((m) => m.id === assistantMessageId);
      if (assistantIndex === -1 || messages[assistantIndex].role !== 'assistant') {
        showWarning('خطأ', 'لا يمكن إعادة توليد هذه الرسالة');
        return;
      }

      // العثور على رسالة المستخدم السابقة
      const userMessageIndex = assistantIndex - 1;
      if (
        userMessageIndex < 0 ||
        messages[userMessageIndex].role !== 'user'
      ) {
        showWarning('خطأ', 'لا توجد رسالة مستخدم سابقة');
        return;
      }

      const userMessage = messages[userMessageIndex];
      const messagesBeforeRegenerate = messages.slice(0, assistantIndex);

      // حذف رسالة AI الحالية
      setMessagesState(messagesBeforeRegenerate);

      // إعادة إرسال رسالة المستخدم
      setIsLoading(true);
      try {
        let aiResponse: { message: string };

        try {
          const response = await retryApiCall(
            () =>
              aiService.sendMessageWithIntent(
                [
                  ...messagesBeforeRegenerate.map((m) => ({
                    role: m.role as 'user' | 'assistant' | 'system',
                    content: m.content,
                  })),
                  { role: 'user', content: userMessage.content },
                ],
                { }
              ),
            {
              onRetry: (attempt, error) => {
                logger.warn(`إعادة محاولة توليد الرد (المحاولة ${attempt})`, { error: error.message });
              },
            }
          );
          aiResponse = { message: response.message || 'أفهم طلبك، دعني أساعدك...' };
          logger.info('تم إعادة توليد الرد بنجاح عبر AI Intent API');
        } catch (apiError) {
          logger.error(
            'فشل إعادة توليد الرد عبر AI Intent API',
            apiError instanceof Error ? apiError : new Error(String(apiError))
          );
          aiResponse = {
            message: 'عذراً، تعذر إعادة توليد الرد حالياً. يرجى المحاولة مرة أخرى لاحقاً.',
          };
        }

        const newAssistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: aiResponse.message,
          timestamp: new Date(),
        };

        setMessagesState([...messagesBeforeRegenerate, newAssistantMessage]);

        // حفظ في التاريخ
        if (chatHistory.currentSessionId) {
          chatHistory.updateSession(chatHistory.currentSessionId, [
            ...messagesBeforeRegenerate,
            newAssistantMessage,
          ]);
        }

        showSuccess('تم إعادة التوليد', 'تم توليد رد جديد بنجاح');
      } catch (error) {
        handleError(error, 'خطأ في إعادة توليد الرد');
      } finally {
        setIsLoading(false);
      }
    },
    [state, setters, chatHistory, handleError, showSuccess, showWarning]
  );

  /**
   * معالج حذف رسالة
   */
  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      const { messages } = state;
      const { setMessages: setMessagesState } = setters;

      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) {
        showWarning('خطأ', 'الرسالة غير موجودة');
        return;
      }

      // حذف الرسالة وجميع الرسائل التي تليها
      const updatedMessages = messages.slice(0, messageIndex);
      setMessagesState(updatedMessages);

      // حفظ في التاريخ
      if (chatHistory.currentSessionId && updatedMessages.length > 0) {
        chatHistory.updateSession(chatHistory.currentSessionId, updatedMessages);
      } else if (updatedMessages.length === 0) {
        chatHistory.setCurrentSessionId(null);
      }

      showSuccess('تم الحذف', 'تم حذف الرسالة بنجاح');
    },
    [state, setters, chatHistory, showSuccess, showWarning]
  );

  /**
   * معالج الإبلاغ عن رسالة
   */
  const handleReportMessage = useCallback(
    async (data: ReportData) => {
      try {
        // هنا يمكن إرسال البيانات إلى Backend
        // حالياً، سنحفظها محلياً فقط
        const reports = JSON.parse(
          StorageManager.safeGetItem('ai-chat-reports') || '[]'
        );
        reports.push({
          ...data,
          timestamp: new Date().toISOString(),
        });
        
        const jsonData = JSON.stringify(reports);
        const result = StorageManager.safeSetItem('ai-chat-reports', jsonData);
        
        if (result.success) {
          logger.info('تم حفظ الإبلاغ', { messageId: data.messageId });
          showSuccess('تم الإبلاغ', 'شكراً لك، تم إرسال الإبلاغ بنجاح');
        } else {
          logger.error('فشل حفظ الإبلاغ', undefined, { error: result.error });
          handleError(new Error(result.error || 'فشل حفظ الإبلاغ'), 'خطأ في إرسال الإبلاغ');
        }
      } catch (error) {
        logger.error('خطأ في إرسال الإبلاغ', error instanceof Error ? error : new Error(String(error)));
        handleError(error, 'خطأ في إرسال الإبلاغ');
      }
    },
    [handleError, showSuccess]
  );

  return {
    handleSend,
    handleClearChat,
    handleSelectSession,
    handleSelectTemplate,
    handleNavigate,
    handleDismissSuggestion,
    handleEditMessage,
    handleRegenerateResponse,
    handleDeleteMessage,
    handleReportMessage,
  };
}


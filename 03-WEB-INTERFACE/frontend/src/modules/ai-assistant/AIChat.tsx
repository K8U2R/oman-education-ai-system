import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { aiService } from '@/services/api/ai-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { handleError, showInfo } = useErrorHandler();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Check for commands
      if (message.startsWith('/')) {
        await handleCommand(message);
      } else {
        // Regular chat
        const response = await aiService.sendMessage([
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage.content },
        ]);

        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
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
  };

  const handleCommand = async (command: string) => {
    const [cmd] = command.slice(1).split(' ');

    switch (cmd.toLowerCase()) {
      case 'generate':
      case 'gen': {
        showInfo('توليد الكود', 'جاري توليد الكود...');
        // This would need access to current file/editor
        break;
      }
      case 'explain':
      case 'exp': {
        showInfo('شرح الكود', 'جاري شرح الكود...');
        break;
      }
      case 'refactor':
      case 'ref': {
        showInfo('إعادة الهيكلة', 'جاري إعادة هيكلة الكود...');
        break;
      }
      case 'fix': {
        showInfo('إصلاح الأخطاء', 'جاري إصلاح الأخطاء...');
        break;
      }
      case 'help': {
        const helpMessage: Message = {
          id: `msg-${Date.now()}-help`,
          role: 'assistant',
          content: `الأوامر المتاحة:
/generate [prompt] - توليد كود جديد
/explain - شرح الكود الحالي
/refactor [instructions] - إعادة هيكلة الكود
/fix - إصلاح الأخطاء
/help - عرض هذه المساعدة`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, helpMessage]);
        break;
      }
      default: {
        showInfo('أمر غير معروف', `الأمر "${cmd}" غير معروف. استخدم /help للحصول على قائمة الأوامر.`);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-ide-border">
      <div className="flex items-center gap-2 mb-2">
        <Bot className="w-4 h-4 text-ide-accent" />
        <h4 className="text-sm font-semibold">مساعد الذكاء الاصطناعي</h4>
      </div>
      <div className="max-h-32 overflow-y-auto mb-2 text-xs space-y-1" ref={messagesEndRef}>
        {messages.length === 0 ? (
          <p className="text-ide-text-secondary text-xs">
            كيف يمكنني مساعدتك اليوم؟ (أو /command)
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.role === 'user' ? 'text-ide-text' : 'text-ide-accent'
              }`}
            >
              {msg.role === 'assistant' && <Bot className="w-3 h-3 mt-0.5 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="break-words">{msg.content}</p>
                <span className="text-ide-text-secondary text-[10px]">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-ide-accent">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>جاري المعالجة...</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب رسالتك أو استخدم /command..."
          className="flex-1 px-2 py-1.5 text-xs rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-1 focus:ring-ide-accent"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className="p-1.5 bg-ide-accent text-white rounded-md hover:bg-ide-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="إرسال الرسالة"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Send className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AIChat;

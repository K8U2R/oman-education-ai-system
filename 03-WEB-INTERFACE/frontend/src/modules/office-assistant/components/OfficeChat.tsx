import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, FileUp, Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { OfficeAppType } from '../OfficeAssistantPage';
import { useAIChat } from '@/modules/ai-assistant/hooks/useAIChat';
import MessageItem from '@/modules/ai-assistant/components/MessageItem';
import { officeService } from '../services/office-service';

interface OfficeChatProps {
  appType: OfficeAppType;
}

const OfficeChat: React.FC<OfficeChatProps> = ({ appType }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() && !file) return;

    let content = message.trim();
    
    // إذا كان هناك ملف، أضف معلوماته للرسالة
    if (file) {
      content = `[ملف مرفق: ${file.name}]\n${content}`;
    }

    await sendMessage(content);
    
    // معالجة الطلب باستخدام Office Service
    if (file) {
      try {
        await officeService.processFile(appType, file, message);
        // إضافة النتيجة كرسالة من المساعد
        // سيتم التعامل معها في useAIChat
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }

    setMessage('');
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDownload = async () => {
    // تنزيل الملف المُنشأ
    try {
      const result = await officeService.generateFile(appType, messages);
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-ide-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-ide-accent" />
          <h2 className="text-lg font-semibold">محادثة AI</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={messages.length === 0}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearMessages}>
            مسح
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[400px] max-h-[600px]">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-ide-text-secondary">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>ابدأ المحادثة لإنشاء أو تحرير ملف Office</p>
            <p className="text-sm mt-2">مثال: "أنشئ مستند Word عن الذكاء الاصطناعي"</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-ide-text-secondary">
            <div className="w-4 h-4 border-2 border-ide-accent border-t-transparent rounded-full animate-spin" />
            <span>جاري المعالجة...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File Upload */}
      {file && (
        <div className="mb-4 p-3 bg-ide-bg border border-ide-border rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileUp className="w-4 h-4 text-ide-accent" />
            <span className="text-sm">{file.name}</span>
            <span className="text-xs text-ide-text-secondary">
              ({(file.size / 1024).toFixed(2)} KB)
            </span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-ide-text-secondary hover:text-ide-text"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept=".docx,.xlsx,.pptx,.msg,.one,.pub,.accdb"
            onChange={handleFileChange}
          />
          <Button variant="outline" size="sm" as="span">
            <FileUp className="w-4 h-4" />
          </Button>
        </label>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="اكتب طلبك هنا... (مثال: أنشئ مستند Word عن...)"
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={isLoading || (!message.trim() && !file)}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default OfficeChat;


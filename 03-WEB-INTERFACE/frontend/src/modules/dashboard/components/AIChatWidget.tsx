import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAIChat } from '@/modules/ai-assistant/hooks/useAIChat';

const AIChatWidget: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { messages, isLoading, sendMessage } = useAIChat();

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-ide-accent" />
          <h2 className="text-lg font-semibold">مساعد AI السريع</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <X className="w-4 h-4" /> : 'توسيع'}
        </Button>
      </div>

      {isExpanded && messages.length > 0 && (
        <div className="mb-4 max-h-48 overflow-y-auto space-y-2">
          {messages.slice(-3).map((msg) => (
            <div
              key={msg.id}
              className={`text-sm p-2 rounded ${
                msg.role === 'user'
                  ? 'bg-ide-accent/10 text-right'
                  : 'bg-ide-bg text-right'
              }`}
            >
              {msg.content.substring(0, 100)}
              {msg.content.length > 100 && '...'}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="اسأل AI..."
          className="flex-1"
          size="sm"
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default AIChatWidget;


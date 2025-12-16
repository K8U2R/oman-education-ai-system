import React, { useState, useMemo } from 'react';
import { History, X, Trash2, Clock, Search } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useChatHistory } from '../hooks/useChatHistory';
import { Message } from './MessageList';
import { formatRelativeTime } from '@/utils/helpers';

interface ChatHistoryProps {
  onSelectSession: (messages: Message[]) => void;
  onClose: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onSelectSession, onClose }) => {
  const { sessions, deleteSession, clearAllSessions } = useChatHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const query = searchQuery.toLowerCase();
    return sessions.filter(session =>
      session.title.toLowerCase().includes(query) ||
      session.messages.some(msg => msg.content.toLowerCase().includes(query))
    );
  }, [sessions, searchQuery]);

  const handleSelect = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      onSelectSession(session.messages);
      onClose();
    }
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
      deleteSession(sessionId);
    }
  };

  return (
    <Card className="max-w-2xl w-full max-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-ide-border">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-ide-accent" />
          <h2 className="text-xl font-bold">تاريخ المحادثات</h2>
        </div>
        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm('هل أنت متأكد من حذف جميع المحادثات؟')) {
                  clearAllSessions();
                }
              }}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
              حذف الكل
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 border-b border-ide-border">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ide-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المحادثات..."
            className="w-full px-10 py-2 rounded-lg bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent focus:border-ide-accent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ide-text-secondary hover:text-ide-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 chat-scrollbar">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 text-ide-text-secondary">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{searchQuery ? 'لا توجد نتائج' : 'لا توجد محادثات محفوظة'}</p>
          </div>
        ) : (
          filteredSessions
            .slice()
            .reverse()
            .map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelect(session.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-ide-accent/10 hover:border-ide-accent/50 ${
                  selectedId === session.id
                    ? 'bg-ide-accent/20 border-ide-accent'
                    : 'bg-ide-surface border-ide-border'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ide-text truncate mb-1">
                      {session.title}
                    </h3>
                    <p className="text-sm text-ide-text-secondary line-clamp-2 mb-2">
                      {session.messages[0]?.content || 'لا يوجد محتوى'}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-ide-text-secondary">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(session.updatedAt)}
                      </div>
                      <span>{session.messages.length} رسالة</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    className="p-2 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
                    title="حذف المحادثة"
                  >
                    <Trash2 className="w-4 h-4 text-ide-text-secondary hover:text-red-400" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </Card>
  );
};

export default ChatHistory;


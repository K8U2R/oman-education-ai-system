import React, { useState, useMemo } from 'react';
import {
  History,
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  Download,
  Sparkles,
  BarChart3,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useChatHistory } from '../hooks/useChatHistory';
import { Message } from './MessageList';
import { formatRelativeTime } from '@/utils/helpers';

interface ChatSidebarProps {
  messages: Message[];
  onSelectSession: (messages: Message[]) => void;
  onSelectTemplate: (text: string) => void;
  onExportChat: () => void;
  currentSessionId: string | null;
}

type SidebarView = 'history' | 'templates' | 'stats' | 'settings';

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  onSelectSession,
  onSelectTemplate,
  onExportChat,
  currentSessionId,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<SidebarView>('history');
  const { sessions, deleteSession, clearAllSessions } = useChatHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const query = searchQuery.toLowerCase();
    return sessions.filter(
      (session) =>
        session.title.toLowerCase().includes(query) ||
        session.messages.some((msg) => msg.content.toLowerCase().includes(query))
    );
  }, [sessions, searchQuery]);

  // إحصائيات المحادثة
  const stats = useMemo(() => {
    const userMessages = messages.filter((m) => m.role === 'user').length;
    const assistantMessages = messages.filter((m) => m.role === 'assistant').length;
    const totalChars = messages.reduce((acc, m) => acc + m.content.length, 0);
    const avgMessageLength = messages.length > 0 ? Math.round(totalChars / messages.length) : 0;

    return {
      totalMessages: messages.length,
      userMessages,
      assistantMessages,
      totalChars,
      avgMessageLength,
    };
  }, [messages]);

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      onSelectSession(session.messages);
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
      deleteSession(sessionId);
    }
  };

  const templates = [
    {
      id: 'react-project',
      name: 'مشروع React جديد',
      text: 'أنشئ مشروع React جديد مع TypeScript و Tailwind CSS',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'word-doc',
      name: 'مستند Word',
      text: 'أنشئ مستند Word جديد',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'code-help',
      name: 'مساعدة في الكود',
      text: 'ساعدني في كتابة كود',
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ];

  const sidebarItems = [
    { id: 'history' as SidebarView, icon: History, label: 'التاريخ' },
    { id: 'templates' as SidebarView, icon: FileText, label: 'القوالب' },
    { id: 'stats' as SidebarView, icon: BarChart3, label: 'الإحصائيات' },
    { id: 'settings' as SidebarView, icon: Settings, label: 'الإعدادات' },
  ];

  if (isCollapsed) {
    return (
      <aside className="w-12 sm:w-14 md:w-16 bg-ide-surface/95 backdrop-blur-sm border-r border-ide-border/50 flex flex-col items-center py-3 sm:py-4 gap-1.5 sm:gap-2 flex-shrink-0 min-w-0 chat-surface">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="mb-1 sm:mb-2 w-10 h-10 sm:w-12 sm:h-12 rounded-lg hover:bg-ide-accent/10"
          title="إظهار القائمة"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setIsCollapsed(false);
                setActiveView(item.id);
              }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all ${
                activeView === item.id
                  ? 'bg-ide-accent text-white'
                  : 'hover:bg-ide-border text-ide-text-secondary'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside className="w-64 sm:w-72 md:w-80 bg-ide-surface/95 backdrop-blur-sm border-r border-ide-border/50 flex flex-col flex-shrink-0 min-w-0 max-w-full chat-surface">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-ide-border/50 min-w-0">
        <h2 className="text-base sm:text-lg font-bold text-ide-text truncate min-w-0 flex-1 chat-text-primary">القائمة الجانبية</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-lg hover:bg-ide-border"
          title="طي القائمة"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ide-border/50 bg-ide-bg/30 min-w-0">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 sm:gap-1 py-2 sm:py-3 px-1 sm:px-2 transition-all min-w-0 ${
                activeView === item.id
                  ? 'bg-ide-accent/10 text-ide-accent border-b-2 border-ide-accent'
                  : 'text-ide-text-secondary hover:text-ide-text hover:bg-ide-surface/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium truncate w-full">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto chat-scrollbar min-h-0">
        {activeView === 'history' && (
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 min-w-0">
            {/* Search */}
            <div className="relative min-w-0">
              <MessageSquare className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-ide-text-secondary flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المحادثات..."
                className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 rounded-lg bg-ide-bg border border-ide-border text-ide-text text-xs sm:text-sm text-right focus:outline-none focus:ring-2 focus:ring-ide-accent focus:border-ide-accent min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ide-text-secondary hover:text-ide-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sessions List */}
            <div className="space-y-2">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8 text-ide-text-secondary">
                  <History className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{searchQuery ? 'لا توجد نتائج' : 'لا توجد محادثات محفوظة'}</p>
                </div>
              ) : (
                filteredSessions
                  .slice()
                  .reverse()
                  .map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session.id)}
                      className={`p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                        currentSessionId === session.id
                          ? 'bg-ide-accent/20 border-ide-accent'
                          : 'bg-ide-bg border-ide-border hover:bg-ide-surface hover:border-ide-accent/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-ide-text truncate mb-1">
                            {session.title}
                          </h3>
                          <p className="text-xs text-ide-text-secondary line-clamp-2 mb-2">
                            {session.messages[0]?.content || 'لا يوجد محتوى'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-ide-text-secondary">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(session.updatedAt)}
                            </div>
                            <span>•</span>
                            <span>{session.messages.length} رسالة</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSession(e, session.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
                          title="حذف المحادثة"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-ide-text-secondary hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Actions */}
            {sessions.length > 0 && (
              <div className="pt-4 border-t border-ide-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('هل أنت متأكد من حذف جميع المحادثات؟')) {
                      clearAllSessions();
                    }
                  }}
                  className="w-full text-red-400 hover:text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف جميع المحادثات
                </Button>
              </div>
            )}
          </div>
        )}

        {activeView === 'templates' && (
          <div className="p-4 space-y-3 min-w-0">
            <div className="flex items-center gap-2 mb-4 min-w-0">
              <FileText className="w-5 h-5 text-ide-accent flex-shrink-0" />
              <h3 className="text-base font-semibold truncate min-w-0">قوالب سريعة</h3>
            </div>
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.text)}
                className="w-full p-3 text-right rounded-lg border border-ide-border/50 bg-gradient-to-br from-ide-bg to-ide-surface hover:from-ide-accent/10 hover:to-ide-accent/5 hover:border-ide-accent/50 transition-all group min-w-0"
              >
                <div className="flex items-center gap-2 mb-1 min-w-0">
                  <div className="text-ide-accent group-hover:scale-110 transition-transform flex-shrink-0">
                    {template.icon}
                  </div>
                  <h4 className="font-semibold text-sm text-ide-text truncate min-w-0 flex-1">{template.name}</h4>
                </div>
                <p className="text-xs text-ide-text-secondary line-clamp-2">{template.text}</p>
              </button>
            ))}
          </div>
        )}

        {activeView === 'stats' && (
          <div className="p-4 space-y-4 min-w-0">
            <div className="flex items-center gap-2 mb-4 min-w-0">
              <BarChart3 className="w-5 h-5 text-ide-accent flex-shrink-0" />
              <h3 className="text-base font-semibold truncate min-w-0">إحصائيات المحادثة</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-0">
              <div className="p-3 rounded-lg bg-gradient-to-br from-ide-bg to-ide-surface border border-ide-border/50">
                <div className="text-2xl font-bold text-ide-accent mb-1">{stats.totalMessages}</div>
                <div className="text-xs text-ide-text-secondary">إجمالي الرسائل</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-ide-bg to-ide-surface border border-ide-border/50">
                <div className="text-2xl font-bold text-blue-400 mb-1">{stats.userMessages}</div>
                <div className="text-xs text-ide-text-secondary">رسائلك</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-ide-bg to-ide-surface border border-ide-border/50">
                <div className="text-2xl font-bold text-purple-400 mb-1">{stats.assistantMessages}</div>
                <div className="text-xs text-ide-text-secondary">ردود AI</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-ide-bg to-ide-surface border border-ide-border/50">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {stats.avgMessageLength}
                </div>
                <div className="text-xs text-ide-text-secondary">متوسط الطول</div>
              </div>
            </div>

            <div className="pt-4 border-t border-ide-border/50 space-y-2 min-w-0">
              <div className="flex items-center justify-between text-sm min-w-0 gap-2">
                <span className="text-ide-text-secondary truncate min-w-0">إجمالي الأحرف:</span>
                <span className="font-semibold text-ide-text flex-shrink-0">{stats.totalChars.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {activeView === 'settings' && (
          <div className="p-4 space-y-4 min-w-0">
            <div className="flex items-center gap-2 mb-4 min-w-0">
              <Settings className="w-5 h-5 text-ide-accent flex-shrink-0" />
              <h3 className="text-base font-semibold truncate min-w-0">الإعدادات السريعة</h3>
            </div>

            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onExportChat}
                disabled={messages.length === 0}
                className="w-full justify-end text-ide-text-secondary hover:text-ide-text hover:bg-ide-surface"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير المحادثة
              </Button>
            </div>

            <div className="pt-4 border-t border-ide-border/50">
              <div className="text-xs text-ide-text-secondary space-y-1">
                <p>• المحادثات تُحفظ تلقائياً</p>
                <p>• استخدم Ctrl+F للبحث</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;


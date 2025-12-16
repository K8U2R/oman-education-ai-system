import React from 'react';
import { Sparkles, PanelLeft, PanelRight, Search, History, Download, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import { UserMenu } from './UserMenu';
import ThemeToggle from '../ThemeToggle';

interface ChatHeaderProps {
  messagesCount: number;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onShowSearch: () => void;
  onShowHistory: () => void;
  onExportChat: () => void;
  onShowTemplates: () => void;
}

/**
 * مكون رأس صفحة المحادثة
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  messagesCount,
  showSidebar,
  onToggleSidebar,
  onShowSearch,
  onShowHistory,
  onExportChat,
  onShowTemplates,
}) => {
  return (
    <div className="flex-shrink-0 py-3 sm:py-4 md:py-5 border-b border-ide-border/50 bg-gradient-to-r from-ide-surface/40 via-ide-surface/30 to-ide-surface/40 backdrop-blur-md chat-surface">
      <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
          <div className="relative group flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-ide-accent via-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-ide-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl group-hover:shadow-ide-accent/30 chat-animate-scale-in">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-emerald-400 rounded-full border-2 border-ide-bg shadow-lg animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-emerald-400 rounded-full border-2 border-ide-bg animate-ping opacity-60" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-ide-text tracking-tight truncate chat-text-primary">مساعد AI الذكي</h1>
            <p className="text-xs sm:text-sm text-ide-text-secondary/80 truncate chat-text-secondary hidden sm:block">كيف يمكنني مساعدتك اليوم؟</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {messagesCount > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="text-ide-text-secondary hover:text-ide-accent hover:bg-ide-accent/10 transition-all duration-200 hover:scale-105 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2"
                title={showSidebar ? 'إخفاء القائمة الجانبية' : 'إظهار القائمة الجانبية'}
              >
                {showSidebar ? <PanelLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <PanelRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowSearch}
                className="text-ide-text-secondary hover:text-ide-accent hover:bg-ide-accent/10 transition-all duration-200 hover:scale-105 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 hidden sm:flex"
                title="بحث (Ctrl+F)"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowHistory}
                className="text-ide-text-secondary hover:text-ide-accent hover:bg-ide-accent/10 transition-all duration-200 hover:scale-105 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 hidden md:flex"
                title="تاريخ المحادثات"
              >
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              {messagesCount > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExportChat}
                  className="text-ide-text-secondary hover:text-ide-accent hover:bg-ide-accent/10 transition-all duration-200 hover:scale-105 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 hidden lg:flex"
                  title="تصدير المحادثة"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              )}
            </>
          )}
          {messagesCount === 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowTemplates}
              className="text-ide-text-secondary hover:text-ide-accent hover:bg-ide-accent/10 transition-all duration-200 hover:scale-105 rounded-lg px-3 py-2"
              title="قوالب سريعة"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline mr-1">قوالب</span>
            </Button>
          )}
          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </div>
  );
};


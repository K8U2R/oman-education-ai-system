import React, { useState } from 'react';
import { Menu, Search, Settings, User, X, Book } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIDE } from '@/core/state/useIDE';
import SearchPanel from '@/modules/search/SearchPanel';

const Header: React.FC = () => {
  const { toggleSidebar } = useIDE();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-ide-surface border-b border-ide-border">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-ide-border transition-colors"
          aria-label="تبديل الشريط الجانبي"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-ide-accent">F</span>
          <span className="text-lg font-semibold">lowForge</span>
          <span className="text-sm text-ide-text-secondary">IDE</span>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ide-text-secondary" />
          <input
            type="text"
            placeholder="ابحث عن الملفات، الأوامر..."
            className="w-full pl-10 pr-4 py-1.5 rounded-md bg-ide-bg border border-ide-border text-ide-text text-sm focus:outline-none focus:ring-2 focus:ring-ide-accent"
            onFocus={() => setShowSearch(true)}
          />
        </div>
        {showSearch && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowSearch(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-2 bg-ide-surface border border-ide-border rounded-lg shadow-xl z-50">
              <div className="p-2 border-b border-ide-border flex items-center justify-between">
                <span className="text-xs font-semibold">نتائج البحث</span>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-1 rounded hover:bg-ide-border transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <SearchPanel />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Link
          to="/docs"
          className="p-2 rounded-md hover:bg-ide-border transition-colors"
          aria-label="التوثيق"
          title="التوثيق"
        >
          <Book className="w-5 h-5" />
        </Link>
        <Link
          to="/dashboard"
          className="p-2 rounded-md hover:bg-ide-border transition-colors"
          aria-label="لوحة التحكم"
          title="لوحة التحكم"
        >
          <Settings className="w-5 h-5" />
        </Link>
        <Link
          to="/profile"
          className="p-2 rounded-md hover:bg-ide-border transition-colors"
          aria-label="الملف الشخصي"
          title="الملف الشخصي"
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
};

export default Header;


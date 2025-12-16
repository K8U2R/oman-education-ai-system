import React, { useState, useMemo } from 'react';
import { AlertCircle, X, Trash2, Filter, Search, SortAsc, SortDesc } from 'lucide-react';
import { useErrorStore } from './ErrorStore';
import ErrorDisplay from './ErrorDisplay';
import { ErrorLevel, ErrorCategory } from './ErrorDisplay';

const ErrorPanel: React.FC = () => {
  const { errors, clearAll, removeError, clearByLevel } = useErrorStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filterLevel, setFilterLevel] = useState<ErrorLevel | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<ErrorCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredErrors = useMemo(() => {
    let filtered = [...errors];

    // Filter by level
    if (filterLevel !== 'all') {
      filtered = filtered.filter((e) => e.level === filterLevel);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter((e) => e.category === filterCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.message.toLowerCase().includes(query) ||
          e.source?.toLowerCase().includes(query) ||
          e.errorCode?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
    });

    return filtered;
  }, [errors, filterLevel, filterCategory, searchQuery, sortOrder]);

  if (errors.length === 0) return null;

  const errorCount = errors.filter((e) => e.level === 'error').length;
  const warningCount = errors.filter((e) => e.level === 'warning').length;
  const infoCount = errors.filter((e) => e.level === 'info').length;
  const successCount = errors.filter((e) => e.level === 'success').length;

  return (
    <>
      {/* Error Indicator Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-red-900/80 hover:bg-red-900 text-white rounded-md shadow-lg transition-colors"
        aria-label="عرض الأخطاء"
      >
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm font-medium">
          {errorCount > 0 && `${errorCount} ${errorCount > 1 ? 'أخطاء' : 'خطأ'}`}
          {errorCount > 0 && warningCount > 0 && ' • '}
          {warningCount > 0 && `${warningCount} ${warningCount > 1 ? 'تحذيرات' : 'تحذير'}`}
        </span>
      </button>

      {/* Error Panel */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 w-[600px] max-h-[600px] bg-ide-surface border border-ide-border rounded-lg shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-ide-border">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              الأخطاء والتحذيرات
              <span className="text-sm font-normal text-ide-text-secondary">
                ({filteredErrors.length}/{errors.length})
              </span>
            </h3>
            <div className="flex items-center gap-2">
              {errors.length > 0 && (
                <>
                  <button
                    onClick={() => clearByLevel('error')}
                    className="p-1.5 rounded hover:bg-ide-border transition-colors"
                    aria-label="مسح الأخطاء"
                    title="مسح جميع الأخطاء"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearAll}
                    className="p-1.5 rounded hover:bg-ide-border transition-colors"
                    aria-label="مسح الكل"
                    title="مسح جميع الرسائل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded hover:bg-ide-border transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-4 py-2 border-b border-ide-border flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-ide-text-secondary">أخطاء: {errorCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="text-ide-text-secondary">تحذيرات: {warningCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-ide-text-secondary">معلومات: {infoCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-ide-text-secondary">نجاح: {successCount}</span>
            </div>
          </div>

          {/* Filters */}
          <div className="p-3 border-b border-ide-border space-y-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ide-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الأخطاء..."
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-ide-bg border border-ide-border rounded focus:outline-none focus:ring-2 focus:ring-ide-accent"
              />
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-ide-text-secondary" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as ErrorLevel | 'all')}
                className="flex-1 text-xs bg-ide-bg border border-ide-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ide-accent"
              >
                <option value="all">جميع المستويات</option>
                <option value="error">أخطاء</option>
                <option value="warning">تحذيرات</option>
                <option value="info">معلومات</option>
                <option value="success">نجاح</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as ErrorCategory | 'all')}
                className="flex-1 text-xs bg-ide-bg border border-ide-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ide-accent"
              >
                <option value="all">جميع الفئات</option>
                <option value="api">API</option>
                <option value="network">شبكة</option>
                <option value="validation">تحقق</option>
                <option value="authentication">مصادقة</option>
                <option value="authorization">صلاحيات</option>
                <option value="system">نظام</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                className="p-1.5 rounded hover:bg-ide-border transition-colors"
                title={sortOrder === 'newest' ? 'الأحدث أولاً' : 'الأقدم أولاً'}
              >
                {sortOrder === 'newest' ? (
                  <SortDesc className="w-4 h-4" />
                ) : (
                  <SortAsc className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Errors List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredErrors.length === 0 ? (
              <p className="text-sm text-ide-text-secondary text-center py-8">
                {errors.length === 0
                  ? 'لا توجد أخطاء'
                  : 'لا توجد نتائج تطابق الفلاتر المحددة'}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredErrors.map((error) => (
                  <ErrorDisplay
                    key={error.id}
                    error={error}
                    onDismiss={() => removeError(error.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorPanel;


import React from 'react';
import { Clock, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
}

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect?: (query: string) => void;
  onClear?: () => void;
  maxItems?: number;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelect,
  onClear,
  maxItems = 10,
}) => {
  const displayHistory = history.slice(0, maxItems);

  if (displayHistory.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ide-accent" />
          <h3 className="text-sm font-semibold">سجل البحث</h3>
        </div>
        {onClear && (
          <Button size="sm" variant="ghost" onClick={onClear}>
            <X className="w-4 h-4" />
            مسح
          </Button>
        )}
      </div>
      <div className="space-y-1">
        {displayHistory.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect?.(item.query)}
            className="w-full text-right px-3 py-2 rounded hover:bg-ide-border transition-colors text-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-ide-text">{item.query}</span>
              <span className="text-xs text-ide-text-secondary">
                {new Date(item.timestamp).toLocaleTimeString('ar')}
              </span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default SearchHistory;


import React from 'react';
import { History } from 'lucide-react';
import Card from '@/components/ui/Card';

interface CommandHistoryProps {
  history: string[];
  onSelect?: (command: string) => void;
  maxItems?: number;
}

const CommandHistory: React.FC<CommandHistoryProps> = ({
  history,
  onSelect,
  maxItems = 10,
}) => {
  const displayHistory = history.slice(0, maxItems);

  if (displayHistory.length === 0) {
    return null;
  }

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 max-h-48 overflow-y-auto">
      <div className="flex items-center gap-2 mb-2 p-2 border-b border-ide-border">
        <History className="w-4 h-4 text-ide-accent" />
        <span className="text-sm font-semibold">سجل الأوامر</span>
      </div>
      <div className="space-y-1">
        {displayHistory.map((command, index) => (
          <button
            key={index}
            onClick={() => onSelect?.(command)}
            className="w-full text-right px-3 py-2 rounded text-sm transition-colors hover:bg-ide-border text-ide-text"
          >
            {command}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default CommandHistory;


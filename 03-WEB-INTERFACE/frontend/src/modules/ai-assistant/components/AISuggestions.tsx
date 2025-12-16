import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import Card from '@/components/ui/Card';

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  action: () => void;
}

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  onSelect?: (suggestion: AISuggestion) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        <h3 className="text-sm font-semibold">اقتراحات AI</h3>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => {
              suggestion.action();
              onSelect?.(suggestion);
            }}
            className="w-full p-3 rounded-md border border-ide-border hover:border-ide-accent hover:bg-ide-accent/5 transition-colors text-right"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-ide-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                <p className="text-xs text-ide-text-secondary">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default AISuggestions;


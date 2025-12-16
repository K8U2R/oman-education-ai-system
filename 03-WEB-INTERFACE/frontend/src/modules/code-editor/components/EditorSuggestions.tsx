import React from 'react';
import { Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';

interface Suggestion {
  id: string;
  text: string;
  type: 'completion' | 'fix' | 'refactor';
}

interface EditorSuggestionsProps {
  suggestions: Suggestion[];
  onApply?: (suggestion: Suggestion) => void;
}

const EditorSuggestions: React.FC<EditorSuggestionsProps> = ({
  suggestions,
  onApply,
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="absolute bottom-4 left-4 right-4 z-10 max-h-48 overflow-auto">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-ide-accent" />
        <h4 className="text-sm font-semibold">اقتراحات AI</h4>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-2 rounded hover:bg-ide-border transition-colors cursor-pointer"
            onClick={() => onApply?.(suggestion)}
          >
            <p className="text-sm">{suggestion.text}</p>
            <span className="text-xs text-ide-text-secondary">
              {suggestion.type === 'completion' && 'إكمال'}
              {suggestion.type === 'fix' && 'إصلاح'}
              {suggestion.type === 'refactor' && 'إعادة هيكلة'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EditorSuggestions;


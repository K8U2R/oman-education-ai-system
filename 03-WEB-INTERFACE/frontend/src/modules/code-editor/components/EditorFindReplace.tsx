import React, { useState } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';

interface EditorFindReplaceProps {
  onFind?: (query: string, options: FindOptions) => void;
  onReplace?: (query: string, replacement: string, options: FindOptions) => void;
  onClose?: () => void;
}

interface FindOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
}

const EditorFindReplace: React.FC<EditorFindReplaceProps> = ({
  onFind,
  onReplace,
  onClose,
}) => {
  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [options, setOptions] = useState<FindOptions>({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  });
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);

  const handleFind = () => {
    if (findQuery && onFind) {
      onFind(findQuery, options);
      // Mock match count - in real implementation, get from Monaco Editor
      setMatchCount(5);
      setCurrentMatch(1);
    }
  };

  const handleReplace = () => {
    if (findQuery && replaceQuery && onReplace) {
      onReplace(findQuery, replaceQuery, options);
    }
  };

  const handleReplaceAll = () => {
    if (findQuery && replaceQuery && onReplace) {
      // Replace all occurrences
      onReplace(findQuery, replaceQuery, { ...options, replaceAll: true });
    }
  };

  const handleNext = () => {
    if (currentMatch < matchCount) {
      setCurrentMatch(currentMatch + 1);
      handleFind();
    }
  };

  const handlePrevious = () => {
    if (currentMatch > 1) {
      setCurrentMatch(currentMatch - 1);
      handleFind();
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-ide-surface border-b border-ide-border p-3 z-50">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-ide-text-secondary" />
          <Input
            value={findQuery}
            onChange={(e) => setFindQuery(e.target.value)}
            placeholder="بحث..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleFind();
              }
            }}
          />
          {matchCount > 0 && (
            <span className="text-sm text-ide-text-secondary whitespace-nowrap">
              {currentMatch} / {matchCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrevious}
            disabled={matchCount === 0}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleNext}
            disabled={matchCount === 0}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={options.caseSensitive}
            onChange={(e) => setOptions({ ...options, caseSensitive: e.target.checked })}
            title="حساس لحالة الأحرف"
          />
          <span className="text-xs text-ide-text-secondary">Aa</span>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowReplace(!showReplace)}
        >
          {showReplace ? 'إخفاء' : 'استبدال'}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {showReplace && (
        <div className="flex items-center gap-2 mt-2">
          <Input
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            placeholder="استبدال بـ..."
            className="flex-1"
          />
          <Button size="sm" onClick={handleReplace}>
            استبدال
          </Button>
          <Button size="sm" variant="secondary" onClick={handleReplaceAll}>
            استبدال الكل
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditorFindReplace;


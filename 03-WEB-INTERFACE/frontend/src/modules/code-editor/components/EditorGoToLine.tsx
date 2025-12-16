import React, { useState } from 'react';
import { Hash, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface EditorGoToLineProps {
  maxLines: number;
  onGoToLine?: (line: number) => void;
  onClose?: () => void;
}

const EditorGoToLine: React.FC<EditorGoToLineProps> = ({
  maxLines,
  onGoToLine,
  onClose,
}) => {
  const [lineNumber, setLineNumber] = useState('');

  const handleGoTo = () => {
    const line = parseInt(lineNumber, 10);
    if (line > 0 && line <= maxLines && onGoToLine) {
      onGoToLine(line);
      onClose?.();
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-ide-surface border-b border-ide-border p-3 z-50">
      <div className="flex items-center gap-2">
        <Hash className="w-4 h-4 text-ide-text-secondary" />
        <Input
          type="number"
          value={lineNumber}
          onChange={(e) => setLineNumber(e.target.value)}
          placeholder={`انتقل إلى السطر (1-${maxLines})`}
          className="flex-1"
          min={1}
          max={maxLines}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleGoTo();
            }
          }}
        />
        <Button size="sm" onClick={handleGoTo}>
          انتقل
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EditorGoToLine;


import React from 'react';
import { FileDiff, Plus, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber?: number;
}

const GitDiff: React.FC = () => {
  // Mock diff data
  const diffLines: DiffLine[] = [
    { type: 'unchanged', content: 'import React from \'react\';', lineNumber: 1 },
    { type: 'unchanged', content: '', lineNumber: 2 },
    { type: 'removed', content: 'const oldCode = () => {', lineNumber: 3 },
    { type: 'added', content: 'const newCode = () => {', lineNumber: 3 },
    { type: 'unchanged', content: '  return <div>Hello</div>;', lineNumber: 4 },
    { type: 'unchanged', content: '};', lineNumber: 5 },
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <FileDiff className="w-5 h-5 text-ide-accent" />
        <h3 className="text-lg font-semibold">الاختلافات (Diff)</h3>
      </div>
      <div className="bg-ide-bg rounded-lg border border-ide-border overflow-x-auto">
        <div className="font-mono text-sm">
          {diffLines.map((line, index) => (
            <div
              key={index}
              className={`flex items-start ${
                line.type === 'added'
                  ? 'bg-green-900/20 text-green-400'
                  : line.type === 'removed'
                  ? 'bg-red-900/20 text-red-400'
                  : 'text-ide-text'
              }`}
            >
              <div className="w-12 text-right px-2 py-1 text-ide-text-secondary border-r border-ide-border">
                {line.lineNumber}
              </div>
              <div className="w-8 text-center px-2 py-1 border-r border-ide-border">
                {line.type === 'added' && <Plus className="w-4 h-4 text-green-500" />}
                {line.type === 'removed' && <Minus className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex-1 px-2 py-1 whitespace-pre">{line.content}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GitDiff;


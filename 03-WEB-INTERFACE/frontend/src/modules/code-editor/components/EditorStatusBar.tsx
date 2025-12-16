import React from 'react';
import { FileText, GitBranch, AlertCircle } from 'lucide-react';

interface EditorStatusBarProps {
  language?: string;
  line?: number;
  column?: number;
  errors?: number;
  warnings?: number;
  branch?: string;
}

const EditorStatusBar: React.FC<EditorStatusBarProps> = ({
  language = 'typescript',
  line = 1,
  column = 1,
  errors = 0,
  warnings = 0,
  branch,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-1 bg-ide-surface border-t border-ide-border text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          <span>{language}</span>
        </div>
        <div>
          السطر {line}, العمود {column}
        </div>
        {errors > 0 && (
          <div className="flex items-center gap-1 text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>{errors} خطأ</span>
          </div>
        )}
        {warnings > 0 && (
          <div className="flex items-center gap-1 text-yellow-400">
            <AlertCircle className="w-3 h-3" />
            <span>{warnings} تحذير</span>
          </div>
        )}
      </div>
      {branch && (
        <div className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          <span>{branch}</span>
        </div>
      )}
    </div>
  );
};

export default EditorStatusBar;


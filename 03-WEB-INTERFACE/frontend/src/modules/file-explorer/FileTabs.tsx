import React from 'react';
import { X } from 'lucide-react';
import { useIDE } from '@/core/state/useIDE';

const FileTabs: React.FC = () => {
  const { openFiles, activeFile, setActiveFile, closeFile } = useIDE();

  return (
    <div className="flex items-center gap-1 bg-ide-surface border-b border-ide-border overflow-x-auto">
      {openFiles.map((filePath) => {
        const fileName = filePath.split('/').pop() || filePath;
        const isActive = filePath === activeFile;

        return (
          <div
            key={filePath}
            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer border-b-2 transition-colors ${
              isActive
                ? 'bg-ide-bg border-ide-accent text-ide-text'
                : 'border-transparent text-ide-text-secondary hover:text-ide-text hover:bg-ide-border'
            }`}
            onClick={() => setActiveFile(filePath)}
          >
            <span className="truncate max-w-[150px]">{fileName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(filePath);
              }}
              className="p-0.5 rounded hover:bg-ide-border transition-colors"
              aria-label="إغلاق الملف"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FileTabs;


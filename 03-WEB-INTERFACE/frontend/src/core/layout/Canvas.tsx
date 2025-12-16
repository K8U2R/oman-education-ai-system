import React from 'react';
import CodeEditor from '@/modules/code-editor/CodeEditor';
import FileTabs from '@/modules/file-explorer/FileTabs';
import { useIDE } from '@/core/state/useIDE';
import ErrorBoundary from '@/core/error/ErrorBoundary';

const Canvas: React.FC = () => {
  const { openFiles, activeFile } = useIDE();

  return (
    <ErrorBoundary>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* File Tabs */}
        {openFiles.length > 0 && <FileTabs />}

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          {activeFile ? (
            <ErrorBoundary
              fallback={
                <div className="h-full flex items-center justify-center text-ide-text-secondary p-4">
                  <div className="text-center">
                    <p className="text-lg mb-2 text-red-400">خطأ في تحميل المحرر</p>
                    <p className="text-sm">يرجى محاولة فتح الملف مرة أخرى</p>
                  </div>
                </div>
              }
            >
              <CodeEditor filePath={activeFile} />
            </ErrorBoundary>
          ) : (
            <div className="h-full flex items-center justify-center text-ide-text-secondary">
              <div className="text-center">
                <p className="text-lg mb-2">مرحباً بك في FlowForge IDE</p>
                <p className="text-sm">افتح ملفاً للبدء في التحرير</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Canvas;


import React from 'react';
import { File, Folder } from 'lucide-react';
import { useIDE } from '@/core/state/useIDE';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const FileOperations: React.FC = () => {
  const { createFile, createFolder } = useIDE();
  const { showSuccess } = useErrorHandler();

  const handleCreateFile = () => {
    const name = prompt('أدخل اسم الملف:');
    if (!name) return;
    createFile('', name);
    showSuccess('تم الإنشاء', `تم إنشاء الملف "${name}"`);
  };

  const handleCreateFolder = () => {
    const name = prompt('أدخل اسم المجلد:');
    if (!name) return;
    createFolder('', name);
    showSuccess('تم الإنشاء', `تم إنشاء المجلد "${name}"`);
  };

  return (
    <div className="p-2 border-b border-ide-border">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => handleCreateFile()}
          className="p-1.5 rounded hover:bg-ide-border transition-colors"
          title="إنشاء ملف"
          aria-label="إنشاء ملف"
        >
          <File className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleCreateFolder()}
          className="p-1.5 rounded hover:bg-ide-border transition-colors"
          title="إنشاء مجلد"
          aria-label="إنشاء مجلد"
        >
          <Folder className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FileOperations;


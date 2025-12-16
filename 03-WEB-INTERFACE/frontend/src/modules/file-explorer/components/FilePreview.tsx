import React from 'react';
import { File, Image, FileText, Code } from 'lucide-react';
import { getFileExtension } from '@/utils/helpers';

interface FilePreviewProps {
  file: {
    name: string;
    content?: string;
    type?: string;
  };
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const extension = getFileExtension(file.name);
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension);
  const isCode = ['js', 'ts', 'jsx', 'tsx', 'py', 'html', 'css', 'json'].includes(extension);
  const isText = ['txt', 'md', 'log'].includes(extension);

  const getIcon = () => {
    if (isImage) return Image;
    if (isCode) return Code;
    if (isText) return FileText;
    return File;
  };

  const Icon = getIcon();

  if (isImage && file.content) {
    return (
      <div className="flex items-center justify-center h-full">
        <img src={file.content} alt={file.name} className="max-w-full max-h-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-2 border-b border-ide-border">
        <Icon className="w-4 h-4 text-ide-accent" />
        <span className="text-sm font-medium">{file.name}</span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {file.content ? (
          <pre className="text-sm font-mono whitespace-pre-wrap">{file.content}</pre>
        ) : (
          <div className="flex items-center justify-center h-full text-ide-text-secondary">
            <p>لا يوجد محتوى للعرض</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;


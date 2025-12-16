import React from 'react';
import FileNode from './FileNode';
import { FileNode as FileNodeType } from '@/utils/types';

interface FileTreeProps {
  files: FileNodeType[];
  onFileSelect?: (file: FileNodeType) => void;
  onFolderToggle?: (folder: FileNodeType) => void;
}

const FileTree: React.FC<FileTreeProps> = ({
  files,
  onFileSelect,
  onFolderToggle,
}) => {
  return (
    <div className="space-y-1">
      {files.map((file) => (
        <FileNode
          key={file.id}
          node={file}
          onSelect={onFileSelect}
          onToggle={onFolderToggle}
        />
      ))}
    </div>
  );
};

export default FileTree;


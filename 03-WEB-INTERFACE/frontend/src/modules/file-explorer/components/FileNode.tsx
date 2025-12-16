import React, { useState } from 'react';
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from 'lucide-react';
import { FileNode as FileNodeType } from '@/utils/types';

interface FileNodeProps {
  node: FileNodeType;
  level?: number;
  onSelect?: (file: FileNodeType) => void;
  onToggle?: (folder: FileNodeType) => void;
}

const FileNode: React.FC<FileNodeProps> = ({
  node,
  level = 0,
  onSelect,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFolder = node.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
      if (onToggle) {
        onToggle(node);
      }
    } else {
      if (onSelect) {
        onSelect(node);
      }
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-ide-border cursor-pointer transition-colors ${
          level > 0 ? 'mr-4' : ''
        }`}
        style={{ paddingRight: `${level * 16}px` }}
        onClick={handleClick}
      >
        {isFolder && (
          <span className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        )}
        {!isFolder && <span className="w-4 h-4" />}
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-yellow-500" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-500" />
          )
        ) : (
          <File className="w-4 h-4 text-ide-text-secondary" />
        )}
        <span className="text-sm flex-1 truncate">{node.name}</span>
      </div>
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileNode;


import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { useIDE } from '@/core/state/useIDE';
import type { FileNode } from '@/core/state/IDEContext';

const FileExplorer: React.FC = () => {
  const { openFile, fileTree } = useIDE();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleContextMenu = (e: React.MouseEvent, _node: FileNode) => {
    e.preventDefault();
    // Context menu would be implemented here
  };

  const renderFileNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.path}>
        <div
          className="flex items-center gap-2 px-2 py-1 hover:bg-ide-border cursor-pointer text-sm group"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              openFile(node.path);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          {node.type === 'folder' ? (
            <>
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )
              ) : (
                <div className="w-4" />
              )}
              <Folder className="w-4 h-4 text-ide-accent flex-shrink-0" />
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="w-4 h-4 text-ide-text-secondary flex-shrink-0" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </div>
        {node.type === 'folder' && isExpanded && hasChildren && (
          <div>
            {node.children!.map((child) => renderFileNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-2">
        <h3 className="text-sm font-semibold mb-2 px-2">مستكشف الملفات</h3>
        <div>
          {fileTree.length > 0 ? (
            fileTree.map((node) => renderFileNode(node))
          ) : (
            <div className="px-2 py-4 text-center text-ide-text-secondary text-sm">
              لم يتم تحميل أي ملفات
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;


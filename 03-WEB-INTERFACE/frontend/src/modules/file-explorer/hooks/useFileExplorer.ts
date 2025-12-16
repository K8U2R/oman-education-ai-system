import { useState, useCallback } from 'react';
import { FileNode } from '@/utils/types';
import { useIDE } from '@/core/state/useIDE';

export function useFileExplorer() {
  const { openFile, setActiveFile } = useIDE();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const selectFile = useCallback(
    (file: FileNode) => {
      if (file.type === 'file') {
        openFile(file.path);
        setActiveFile(file.path);
      } else {
        toggleFolder(file.id);
      }
    },
    [openFile, setActiveFile, toggleFolder]
  );

  return {
    expandedFolders,
    toggleFolder,
    selectFile,
  };
}


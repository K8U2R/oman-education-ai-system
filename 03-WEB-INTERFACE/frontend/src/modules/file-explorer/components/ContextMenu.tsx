import React, { useEffect, useRef } from 'react';
import { FilePlus, FolderPlus, Trash2, Edit, Copy, Scissors, Clipboard } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onNewFile?: () => void;
  onNewFolder?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete,
  onCopy,
  onCut,
  onPaste,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const menuItems = [
    { label: 'ملف جديد', icon: FilePlus, onClick: onNewFile },
    { label: 'مجلد جديد', icon: FolderPlus, onClick: onNewFolder },
    { label: 'إعادة تسمية', icon: Edit, onClick: onRename },
    { label: 'نسخ', icon: Copy, onClick: onCopy },
    { label: 'قص', icon: Scissors, onClick: onCut },
    { label: 'لصق', icon: Clipboard, onClick: onPaste },
    { label: 'حذف', icon: Trash2, onClick: onDelete, danger: true },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-ide-surface border border-ide-border rounded-lg shadow-lg py-1 min-w-[150px]"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        if (!item.onClick) return null;
        return (
          <button
            key={index}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
            className={`w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-ide-border transition-colors ${
              item.danger ? 'text-red-400' : 'text-ide-text'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;


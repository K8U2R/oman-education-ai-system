import React from 'react';
import { Trash2, Download, Settings, Maximize2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface TerminalToolbarProps {
  onClear?: () => void;
  onDownload?: () => void;
  onSettings?: () => void;
  onMaximize?: () => void;
}

const TerminalToolbar: React.FC<TerminalToolbarProps> = ({
  onClear,
  onDownload,
  onSettings,
  onMaximize,
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-ide-surface border-b border-ide-border">
      <Button size="sm" variant="ghost" onClick={onClear} title="مسح">
        <Trash2 className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onDownload} title="تحميل">
        <Download className="w-4 h-4" />
      </Button>
      <div className="flex-1" />
      <Button size="sm" variant="ghost" onClick={onSettings} title="إعدادات">
        <Settings className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onMaximize} title="تكبير">
        <Maximize2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TerminalToolbar;


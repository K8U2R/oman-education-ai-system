import React from 'react';
import { Save, Undo, Redo, Format, Search, Settings } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EditorToolbarProps {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onFormat?: () => void;
  onSearch?: () => void;
  onSettings?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  onUndo,
  onRedo,
  onFormat,
  onSearch,
  onSettings,
  canUndo = false,
  canRedo = false,
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-ide-border bg-ide-surface">
      <Button
        size="sm"
        variant="ghost"
        onClick={onSave}
        title="حفظ (Ctrl+S)"
      >
        <Save className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-ide-border" />
      <Button
        size="sm"
        variant="ghost"
        onClick={onUndo}
        disabled={!canUndo}
        title="تراجع (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onRedo}
        disabled={!canRedo}
        title="إعادة (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-ide-border" />
      <Button
        size="sm"
        variant="ghost"
        onClick={onFormat}
        title="تنسيق الكود (Shift+Alt+F)"
      >
        <Format className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onSearch}
        title="بحث (Ctrl+F)"
      >
        <Search className="w-4 h-4" />
      </Button>
      <div className="flex-1" />
      <Button
        size="sm"
        variant="ghost"
        onClick={onSettings}
        title="إعدادات المحرر"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;


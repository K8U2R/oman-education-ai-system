import React, { useState, useEffect } from 'react';
import { Command, Search, Sparkles } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Command className="w-5 h-5 text-ide-accent" />
          <h2 className="text-lg font-semibold">لوحة الأوامر</h2>
        </div>
        <Input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(0);
          }}
          placeholder="ابحث عن أمر..."
          leftIcon={<Search className="w-4 h-4" />}
          autoFocus
        />
        <div className="max-h-64 overflow-y-auto space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-ide-text-secondary">
              <p>لا توجد نتائج</p>
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                onClick={() => {
                  command.action();
                  onClose();
                }}
                className={`w-full px-4 py-2 rounded-md text-right flex items-center gap-3 transition-colors ${
                  index === selectedIndex
                    ? 'bg-ide-accent text-white'
                    : 'hover:bg-ide-border text-ide-text'
                }`}
              >
                {command.icon || <Sparkles className="w-4 h-4" />}
                <div className="flex-1">
                  <div className="font-medium">{command.label}</div>
                  {command.description && (
                    <div className="text-xs opacity-75">{command.description}</div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CommandPalette;


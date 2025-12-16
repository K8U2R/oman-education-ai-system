import React from 'react';
import { Search, X, Image, Folder } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { DirectoryInputProps } from '../../types/input-props';

interface ChatSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCount: number;
  totalCount: number;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  folderInputRef: React.RefObject<HTMLInputElement>;
}

/**
 * مكون شريط البحث في المحادثة
 */
export const ChatSearchBar: React.FC<ChatSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  filteredCount,
  totalCount,
  onFileSelect,
  onFolderSelect,
  fileInputRef,
  folderInputRef,
}) => {
  return (
    <div className="px-6 pt-4 pb-4 border-b border-ide-border/50 animate-in fade-in slide-in-from-top-2 min-w-0">
      <div className="flex gap-2 items-center mb-3 min-w-0">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ide-text-secondary flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المحادثة..."
            className="w-full px-10 py-2 rounded-lg bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent focus:border-ide-accent min-w-0"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ide-text-secondary hover:text-ide-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFileSelect}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-[40px] w-[40px] p-0 rounded-lg hover:bg-ide-accent/10 hover:border-ide-accent/30 border border-ide-border/50 transition-all hover:scale-105"
            title="إضافة صور"
          >
            <Image className="w-4 h-4 text-ide-accent" />
          </Button>
          <input
            ref={folderInputRef}
            type="file"
            {...({ webkitdirectory: '', directory: '' } as DirectoryInputProps)}
            multiple
            onChange={onFolderSelect}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => folderInputRef.current?.click()}
            className="h-[40px] w-[40px] p-0 rounded-lg hover:bg-ide-accent/10 hover:border-ide-accent/30 border border-ide-border/50 transition-all hover:scale-105"
            title="إضافة مجلد"
          >
            <Folder className="w-4 h-4 text-ide-accent" />
          </Button>
        </div>
      </div>
      {searchQuery && (
        <p className="text-xs text-ide-text-secondary mt-2">
          {filteredCount} نتيجة من {totalCount} رسالة
        </p>
      )}
    </div>
  );
};


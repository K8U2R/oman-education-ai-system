import React from 'react';
import { Sparkles } from 'lucide-react';
import { ChatInput } from '../../text-input';

interface ChatWelcomeViewProps {
  message: string;
  setMessage: (msg: string) => void;
  selectedFiles: File[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSend: () => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  folderInputRef: React.RefObject<HTMLInputElement>;
  centerInputRef: React.RefObject<HTMLTextAreaElement>;
}

/**
 * مكون عرض الترحيب عند عدم وجود رسائل
 */
export const ChatWelcomeView: React.FC<ChatWelcomeViewProps> = ({
  message,
  setMessage,
  selectedFiles,
  onFileSelect,
  onFolderSelect,
  onRemoveFile,
  onSend,
  isLoading,
  fileInputRef,
  folderInputRef,
  centerInputRef,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 min-h-0 min-w-0">
      <div className="w-full max-w-full space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 min-w-0">
        <div className="text-center space-y-3 sm:space-y-4 min-w-0">
          <div className="relative inline-block">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-ide-accent via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-ide-accent/30 animate-in zoom-in chat-animate-scale-in">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-400 rounded-full border-2 sm:border-3 border-ide-surface shadow-lg animate-pulse" />
          </div>
          <div className="space-y-2 min-w-0 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ide-text tracking-tight truncate chat-text-primary">مرحباً بك</h2>
            <p className="text-sm sm:text-base md:text-lg text-ide-text-secondary/90 truncate chat-text-secondary">اكتب رسالتك أدناه للبدء</p>
          </div>
        </div>

        <ChatInput
          message={message}
          setMessage={setMessage}
          onSend={onSend}
          isLoading={isLoading}
          selectedFiles={selectedFiles}
          onFileSelect={onFileSelect}
          onFolderSelect={onFolderSelect}
          onRemoveFile={onRemoveFile}
          variant="center"
          fileInputRef={fileInputRef}
          folderInputRef={folderInputRef}
          inputRef={centerInputRef}
        />
      </div>
    </div>
  );
};


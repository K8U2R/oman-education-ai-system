import { useEffect } from 'react';
import { KeyboardShortcutsConfig } from '../types/text-input.types';

/**
 * Hook لإدارة اختصارات لوحة المفاتيح في صفحة الشات
 */
export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  const {
    onFocusInput,
    onClearChat,
    onCloseModal,
    onSendMessage,
    onSearch,
  } = config;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      // Ctrl/Cmd + K: Focus input
      if (ctrlOrCmd && event.key === 'k' && onFocusInput) {
        event.preventDefault();
        onFocusInput();
        return;
      }

      // Ctrl/Cmd + L: Clear chat
      if (ctrlOrCmd && event.key === 'l' && onClearChat) {
        event.preventDefault();
        onClearChat();
        return;
      }

      // Ctrl/Cmd + F: Search
      if (ctrlOrCmd && event.key === 'f' && onSearch) {
        event.preventDefault();
        onSearch();
        return;
      }

      // Escape: Close modals
      if (event.key === 'Escape' && onCloseModal) {
        onCloseModal();
        return;
      }

      // Ctrl/Cmd + Enter: Send message (if not in input)
      if (ctrlOrCmd && event.key === 'Enter' && onSendMessage) {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT') {
          event.preventDefault();
          onSendMessage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onFocusInput, onClearChat, onCloseModal, onSendMessage, onSearch]);
}


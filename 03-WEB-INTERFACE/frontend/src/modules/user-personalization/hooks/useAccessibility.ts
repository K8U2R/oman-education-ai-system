/**
 * useAccessibility Hook
 * Hook لإدارة إمكانية الوصول
 */

import { useEffect, useCallback } from 'react';
import {
  safeFocus,
  focusNext,
  focusPrevious,
  getFocusableElements,
  announceToScreenReader,
} from '../utils/accessibility';

interface UseAccessibilityOptions {
  enableKeyboardNavigation?: boolean;
  enableScreenReader?: boolean;
  containerRef?: React.RefObject<HTMLElement>;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    enableKeyboardNavigation = true,
    enableScreenReader = true,
    containerRef,
  } = options;

  // Keyboard Navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const container = containerRef?.current || document;

      // Tab navigation
      if (event.key === 'Tab' && !event.shiftKey) {
        const focusableElements = getFocusableElements(container as HTMLElement);
        const currentIndex = focusableElements.indexOf(target);
        
        if (currentIndex === focusableElements.length - 1) {
          event.preventDefault();
          safeFocus(focusableElements[0]);
        }
      }

      // Shift+Tab navigation
      if (event.key === 'Tab' && event.shiftKey) {
        const focusableElements = getFocusableElements(container as HTMLElement);
        const currentIndex = focusableElements.indexOf(target);
        
        if (currentIndex === 0) {
          event.preventDefault();
          safeFocus(focusableElements[focusableElements.length - 1]);
        }
      }

      // Arrow keys navigation
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const focusableElements = getFocusableElements(container as HTMLElement);
        const currentIndex = focusableElements.indexOf(target);
        
        if (currentIndex !== -1) {
          event.preventDefault();
          if (event.key === 'ArrowDown') {
            focusNext(target);
          } else {
            focusPrevious(target);
          }
        }
      }

      // Escape to close modals
      if (event.key === 'Escape') {
        const modal = container.querySelector('[role="dialog"]');
        if (modal) {
          (modal as HTMLElement).focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableKeyboardNavigation, containerRef]);

  // Screen Reader Announcements
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (enableScreenReader) {
        announceToScreenReader(message, priority);
      }
    },
    [enableScreenReader]
  );

  return {
    announce,
    safeFocus,
    focusNext,
    focusPrevious,
    getFocusableElements,
  };
};


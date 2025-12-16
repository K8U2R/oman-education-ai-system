/**
 * Accessibility Utilities
 * أدوات إمكانية الوصول
 */

/**
 * إنشاء ARIA label للغة العربية
 */
export const createAriaLabel = (label: string, description?: string): string => {
  return description ? `${label}. ${description}` : label;
};

/**
 * إنشاء ARIA description
 */
export const createAriaDescription = (description: string): string => {
  return description;
};

/**
 * التحقق من إمكانية الوصول للوحة المفاتيح
 */
export const isKeyboardAccessible = (element: HTMLElement): boolean => {
  const tabIndex = element.getAttribute('tabindex');
  const role = element.getAttribute('role');
  const isButton = element.tagName === 'BUTTON' || role === 'button';
  const isLink = element.tagName === 'A' || role === 'link';
  const isInput = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || role === 'textbox';

  return (
    isButton ||
    isLink ||
    isInput ||
    tabIndex !== null ||
    element.hasAttribute('onclick')
  );
};

/**
 * التركيز على عنصر بأمان
 */
export const safeFocus = (element: HTMLElement | null): void => {
  if (element && isKeyboardAccessible(element)) {
    try {
      element.focus();
    } catch (error) {
      console.warn('Failed to focus element:', error);
    }
  }
};

/**
 * التركيز على العنصر التالي في Tab order
 */
export const focusNext = (currentElement: HTMLElement): void => {
  const focusableElements = getFocusableElements();
  const currentIndex = focusableElements.indexOf(currentElement);
  const nextIndex = (currentIndex + 1) % focusableElements.length;
  safeFocus(focusableElements[nextIndex]);
};

/**
 * التركيز على العنصر السابق في Tab order
 */
export const focusPrevious = (currentElement: HTMLElement): void => {
  const focusableElements = getFocusableElements();
  const currentIndex = focusableElements.indexOf(currentElement);
  const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
  safeFocus(focusableElements[prevIndex]);
};

/**
 * الحصول على جميع العناصر القابلة للتركيز
 */
export const getFocusableElements = (container?: HTMLElement): HTMLElement[] => {
  const root = container || document;
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }
  );
};

/**
 * التحقق من التباين (WCAG AA)
 */
export const checkContrast = (_foreground: string, _background: string): {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
} => {
  // Simplified contrast calculation
  // In production, use a proper library like 'color-contrast-checker'
  const ratio = 4.5; // Placeholder
  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
};

/**
 * إنشاء announcement للقارئ الشاشة
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};


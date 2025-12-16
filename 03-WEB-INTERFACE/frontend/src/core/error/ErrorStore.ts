import { create } from 'zustand';
import { ErrorMessage, ErrorLevel, ErrorCategory } from './ErrorDisplay';

interface ErrorStore {
  errors: ErrorMessage[];
  addError: (error: Omit<ErrorMessage, 'id' | 'timestamp'>) => void;
  removeError: (id: string) => void;
  clearAll: () => void;
  clearByLevel: (level: ErrorLevel) => void;
  clearByCategory: (category: ErrorCategory) => void;
  getErrorsByLevel: (level: ErrorLevel) => ErrorMessage[];
  getErrorsByCategory: (category: ErrorCategory) => ErrorMessage[];
  getRecentErrors: (count?: number) => ErrorMessage[];
}

export const useErrorStore = create<ErrorStore>((set, get) => ({
  errors: [],

  addError: (error) => {
    const newError: ErrorMessage = {
      ...error,
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      dismissible: error.dismissible !== false,
    };

    set((state) => ({
      errors: [...state.errors, newError],
    }));

    // Auto-dismiss success messages after 5 seconds
    if (error.level === 'success') {
      setTimeout(() => {
        get().removeError(newError.id);
      }, 5000);
    }

    // Log to console
    console[error.level === 'error' ? 'error' : error.level === 'warning' ? 'warn' : 'log'](
      `[${error.level.toUpperCase()}] ${error.title}: ${error.message}`,
      error.details
    );
  },

  removeError: (id) => {
    set((state) => ({
      errors: state.errors.filter((error) => error.id !== id),
    }));
  },

  clearAll: () => {
    set({ errors: [] });
  },

  clearByLevel: (level) => {
    set((state) => ({
      errors: state.errors.filter((error) => error.level !== level),
    }));
  },

  getErrorsByLevel: (level) => {
    return get().errors.filter((error) => error.level === level);
  },

  clearByCategory: (category) => {
    set((state) => ({
      errors: state.errors.filter((error) => error.category !== category),
    }));
  },

  getErrorsByCategory: (category) => {
    return get().errors.filter((error) => error.category === category);
  },

  getRecentErrors: (count = 10) => {
    const allErrors = [...get().errors];
    allErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return allErrors.slice(0, count);
  },
}));


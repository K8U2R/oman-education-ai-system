/**
 * 
 * useAutoSave Hook
 * Hook للحفظ التلقائي للتفضيلات
 */

import { useEffect, useRef } from 'react';
import { UserPreferences, UserSettings, UserProfile } from '@/services/user/user-personalization-service';

interface UseAutoSaveOptions {
  enabled?: boolean;
  delay?: number; // milliseconds
  onSave?: () => void;
  onError?: (error: Error) => void;
}

export const useAutoSave = <T extends UserPreferences | UserSettings | UserProfile>(
  data: T | null,
  updateFn: (data: Partial<T>) => Promise<T>,
  options: UseAutoSaveOptions = {}
) => {
  const { enabled = true, delay = 2000, onSave, onError } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDataRef = useRef<T | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousDataRef.current = data;
      return;
    }

    // Skip if disabled or no data
    if (!enabled || !data) {
      return;
    }

    // Skip if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await updateFn(data);
        previousDataRef.current = data;
        onSave?.();
      } catch (error) {
        onError?.(error as Error);
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, delay, updateFn, onSave, onError]);

  return {
    isSaving: false, // Can be enhanced to track saving state
  };
};


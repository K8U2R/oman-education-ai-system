/**
 * useErrorBoundary Hook
 * Hook لاستخدام Error Boundary مع navigation
 */

import { useState, useEffect, useCallback } from 'react';

export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error: Error) => {
    setError(error);
  }, []);

  return { captureError, resetError };
}


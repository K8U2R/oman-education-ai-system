/**
 * useCache Hook
 * Hook لإدارة Cache
 */

import { useState, useCallback, useEffect } from 'react';
import { cacheManager } from '../utils/cache';

interface UseCacheOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  duration?: number;
  enabled?: boolean;
}

export const useCache = <T>(options: UseCacheOptions<T>) => {
  const { key, fetcher, duration, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = cacheManager.get<T>(key);
    if (cached) {
      setData(cached);
      return;
    }

    // Fetch from API
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      cacheManager.set(key, result, duration);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, duration, enabled]);

  const invalidate = useCallback(() => {
    cacheManager.delete(key);
    setData(null);
  }, [key]);

  const refresh = useCallback(() => {
    invalidate();
    fetchData();
  }, [invalidate, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    invalidate,
    refresh,
  };
};


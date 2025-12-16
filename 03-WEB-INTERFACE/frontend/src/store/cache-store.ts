import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CacheState {
  cache: Record<string, { value: unknown; timestamp: number; ttl: number }>;
  setCache: (key: string, value: unknown, ttl?: number) => void;
  getCache: <T>(key: string) => T | null;
  clearCache: (key?: string) => void;
  clearAll: () => void;
}

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      cache: {},

      setCache: (key: string, value: unknown, ttl: number = 5 * 60 * 1000) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [key]: {
              value,
              timestamp: Date.now(),
              ttl,
            },
          },
        }));
      },

      getCache: <T>(key: string): T | null => {
        const item = get().cache[key];
        if (!item) return null;

        const now = Date.now();
        if (now - item.timestamp > item.ttl) {
          get().clearCache(key);
          return null;
        }

        return item.value as T;
      },

      clearCache: (key?: string) => {
        if (key) {
          set((state) => {
            // Destructuring to remove specific key from cache object
            // The unused variable is intentional - we only need the rest
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [key]: _removed, ...rest } = state.cache;
            return { cache: rest };
          });
        } else {
          set({ cache: {} });
        }
      },

      clearAll: () => {
        set({ cache: {} });
      },
    }),
    {
      name: 'cache-storage',
      partialize: (state) => ({ cache: state.cache }),
    }
  )
);


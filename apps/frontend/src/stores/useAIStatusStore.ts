import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiClient } from '@/infrastructure/api/api-client';
import type { LogEntry } from '@/presentation/components/layout/AIStatusIndicator/components/DevConsole';

interface AIUsageData {
    used: number;
    limit: number;
    resetDate: string;
    tier: 'free' | 'professional' | 'enterprise';
}

interface AIStatusState {
    // Usage Data
    usage: AIUsageData | null;
    isLoading: boolean;
    fetchUsage: () => Promise<void>;

    // Dev Console Logs
    logs: LogEntry[];
    addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
    clearLogs: () => void;
}

export const useAIStatusStore = create<AIStatusState>()(
    devtools((set) => ({
        usage: null,
        isLoading: false,
        logs: [],

        fetchUsage: async () => {
            set({ isLoading: true });
            try {
                const response = await apiClient.get('/ai/usage') as any;
                // Map backend response
                const data = response.data?.tokens ? {
                    used: response.data.tokens.used,
                    limit: response.data.tokens.limit,
                    resetDate: response.data.tokens.resetDate,
                    tier: response.data.tier
                } : null;

                if (data) set({ usage: data });
            } catch (error) {
                console.error('Failed to fetch AI usage:', error);
            } finally {
                set({ isLoading: false });
            }
        },

        addLog: (log) => {
            set((state) => ({
                logs: [
                    ...state.logs,
                    {
                        id: Math.random().toString(36).substring(7),
                        timestamp: Date.now(),
                        ...log,
                    },
                ].slice(-50),
            }));
        },

        clearLogs: () => set({ logs: [] }),
    }))
);

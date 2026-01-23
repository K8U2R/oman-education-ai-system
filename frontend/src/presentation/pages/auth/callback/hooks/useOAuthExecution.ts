/**
 * useOAuthExecution - Sovereign Auth Life-cycle Hook
 * @law Law-9 (Documentation)
 */

import { useState, useEffect } from 'react';
import { apiClient } from '@/infrastructure/api/api-client';

/**
 * Executes the OAuth code exchange logic.
 * 
 * @param {string | null} code - The OAuth code from provider.
 * @param {string | null} state - The state token for CSRF protection.
 * @returns {Object} Hook state including loading, error, and timeout flags.
 */
export const useOAuthExecution = (code: string | null, state: string | null) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeoutError, setTimeoutError] = useState(false);

    useEffect(() => {
        if (!code) {
            setError('Missing OAuth code from provider');
            setIsLoading(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            if (isLoading) {
                setTimeoutError(true);
                setIsLoading(false);
            }
        }, 10000);

        const completeExchange = async () => {
            try {
                const response = await apiClient.post<any>('/auth/oauth/callback', { code, state, provider: 'google' });
                if (!response.success) throw new Error(response.message || 'Verification failed');
            } catch (err: any) {
                setError(err.response?.data?.error || err.message || 'Fatal comms error');
            } finally {
                setIsLoading(false);
                clearTimeout(timeoutId);
            }
        };

        completeExchange();
        return () => clearTimeout(timeoutId);
    }, [code, state]);

    return { isLoading, error, timeoutError };
};

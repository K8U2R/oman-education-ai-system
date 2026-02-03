/**
 * Sentinel Context - Share Sentinel instance across app
 * @law Law-7 (Diagnostic Protocol)
 */

import { createContext, useContext } from 'react';
import type { SentinelCore } from './core/SentinelCore';

export const SentinelContext = createContext<SentinelCore | null>(null);

/**
 * Hook to access Sentinel instance
 */
export function useSentinel(): SentinelCore | null {
    return useContext(SentinelContext);
}

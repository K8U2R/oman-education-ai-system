/**
 * Sentinel Provider - Wraps app with diagnostic system
 * @law Law-7 (Diagnostic Protocol) - Dev-only diagnostics
 */

import { useEffect, useState, Suspense, lazy } from 'react';
import { createSentinel } from './index';
import { SentinelContext } from './SentinelContext';
import type { SentinelCore } from './index';

// Lazy load HUD for zero production impact
const SovereignHUD = lazy(() =>
    import('./ui/SovereignHUD').then(m => ({ default: m.SovereignHUD }))
);

/**
 * Sentinel Provider Component
 * 
 * Wraps the application and provides diagnostic capabilities
 * Only active in development mode
 */
export function SentinelProvider({ children }: { children: React.ReactNode }) {
    const [sentinel, setSentinel] = useState<SentinelCore | null>(null);

    useEffect(() => {
        // Initialize Sentinel
        const instance = createSentinel();

        if (instance) {
            instance.initialize().then(() => {
                console.log('[Sentinel] 🛡️ Sovereign Sentinel Active');
                console.log('[Sentinel] Type: sentinel.open() to show HUD');
                setSentinel(instance);
            }).catch(error => {
                console.error('[Sentinel] Failed to initialize:', error);
            });
            // Cleanup on unmount
            return () => {
                instance.shutdown();
            };
        }
        return undefined;
    }, []);

    return (
        <SentinelContext.Provider value={sentinel}>
            {children}

            {/* Lazy-loaded HUD (dev-only) */}
            {sentinel && (
                <Suspense fallback={null}>
                    <SovereignHUD sentinel={sentinel} />
                </Suspense>
            )}
        </SentinelContext.Provider>
    );
}

/**
 * Sentinel Route Wrapper
 * Provides sentinel instance to SentinelPage via React Context
 */

import { SentinelPage } from '@/infrastructure/diagnostics/ui/SentinelPage';
import { useSentinel } from '@/infrastructure/diagnostics/SentinelContext';

export function SentinelRoute() {
    const sentinel = useSentinel();

    if (!sentinel) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem',
                padding: '2rem',
                textAlign: 'center',
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>⏳ Initializing Sentinel...</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Please wait while the diagnostic system loads
                </p>
            </div>
        );
    }

    return <SentinelPage sentinel={sentinel} />;
}

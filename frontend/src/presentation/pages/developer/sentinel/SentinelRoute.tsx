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
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center bg-bg-app">
                <h2 className="text-2xl font-semibold text-text-primary">⏳ جاري تهيئة نظام Sentinel...</h2>
                <p className="text-text-secondary">
                    يرجى الانتظار بينما يتم تحميل نظام التشخيص
                </p>
            </div>
        );
    }

    return <SentinelPage sentinel={sentinel} />;
}

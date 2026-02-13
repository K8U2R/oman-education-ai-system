/**
 * Sentinel Route Wrapper
 * Provides sentinel instance to SentinelPage via React Context
 */

import { useTranslation } from 'react-i18next';
import { SentinelPage } from '../../../../infrastructure/diagnostics/ui/SentinelPage';
import { useSentinel } from '../../../../infrastructure/diagnostics/SentinelContext';

export function SentinelRoute() {
    const sentinel = useSentinel();
    const { t } = useTranslation();


    if (!sentinel) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center bg-bg-app">
                <h2 className="text-2xl font-semibold text-text-primary">{t('system.sentinel.loading_title')}</h2>
                <p className="text-text-secondary">
                    {t('system.sentinel.loading_desc')}
                </p>
            </div>
        );
    }

    return <SentinelPage sentinel={sentinel} />;
}


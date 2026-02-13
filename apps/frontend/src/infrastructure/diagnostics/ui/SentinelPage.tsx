/**
 * Sentinel Developer Page
 * @law Law-7 (Diagnostic Protocol) - Full-page diagnostic interface
 * 
 * Accessible at: http://localhost:5174/__sentinel
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SentinelCore } from '../core/SentinelCore';
import { SovereignHUD } from '../ui/SovereignHUD';

interface SentinelPageProps {
    sentinel: SentinelCore;
}

/**
 * Dedicated page for Sentinel diagnostics
 * 
 * Always shows HUD in expanded state
 * Accessible via: /__sentinel route
 */
export function SentinelPage({ sentinel }: SentinelPageProps) {
    const { t } = useTranslation();

    useEffect(() => {
        // Force HUD to be visible and expanded on this page
        (window as any).sentinelPageMode = true;
    }, []);

    return (
        <div className="sentinel-page">
            <div className="sentinel-page__header">
                <h1 className="sentinel-page__title">
                    {t('system.sentinel.title')}
                </h1>
                <p className="sentinel-page__description">
                    {t('system.sentinel.subtitle')}
                </p>
            </div>

            {/* HUD Component - Always Visible */}
            <SovereignHUD sentinel={sentinel} alwaysVisible={true} />

            <div className="sentinel-page__quick-access">
                <h3 className="sentinel-page__quick-access-title">
                    {t('system.sentinel.quick_access')}
                </h3>
                <ul className="sentinel-page__quick-access-list">
                    <li>💻 {t('system.sentinel.console')}: <code>window.sentinel</code></li>
                    <li>🔗 {t('system.sentinel.url')}: <code>actions/sentinel</code></li>
                    <li>⌨️ {t('system.sentinel.shortcut')}: <code>Ctrl+Shift+S</code></li>
                </ul>
            </div>
        </div>
    );
}

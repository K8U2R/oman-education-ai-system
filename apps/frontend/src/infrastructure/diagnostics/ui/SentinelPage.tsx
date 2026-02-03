/**
 * Sentinel Developer Page
 * @law Law-7 (Diagnostic Protocol) - Full-page diagnostic interface
 * 
 * Accessible at: http://localhost:5174/__sentinel
 */

import { useEffect } from 'react';
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
    useEffect(() => {
        // Force HUD to be visible and expanded on this page
        (window as any).sentinelPageMode = true;
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg-primary)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                maxWidth: '1200px',
                width: '100%',
                textAlign: 'center',
                marginBottom: '2rem',
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                    marginBottom: '1rem',
                }}>
                    🛡️ Sovereign Sentinel Developer Console
                </h1>
                <p style={{
                    fontSize: '1.125rem',
                    color: 'var(--color-text-secondary)',
                }}>
                    Real-time system diagnostics and monitoring
                </p>
            </div>

            {/* HUD Component - Always Visible */}
            <SovereignHUD sentinel={sentinel} alwaysVisible={true} />

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '600px',
                width: '100%',
            }}>
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    color: 'var(--color-text-main)',
                }}>
                    📍 Quick Access
                </h3>
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                }}>
                    <li>💻 Console: <code>window.sentinel</code> (if needed)</li>
                    <li>🔗 URL: <code>http://localhost:5174/__sentinel</code></li>
                    <li>⌨️ Shortcut: <code>Ctrl+Shift+S</code> (from any page)</li>
                </ul>
            </div>
        </div>
    );
}

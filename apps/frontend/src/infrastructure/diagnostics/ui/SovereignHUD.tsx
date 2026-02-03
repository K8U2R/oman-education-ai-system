/**
 * Sovereign HUD - Main Overlay Component
 * @law Law-7 (Diagnostic Protocol) - Dev-only diagnostic interface
 * @law Law-11 (Structural Integrity) - Modular component architecture
 */

import { useState, useEffect } from 'react';
import { X, Shield, Eye, Globe, Zap, AlertTriangle } from 'lucide-react';
import { SentinelCore } from '../core/SentinelCore';
import type { DiagnosticEvent } from '../core/SentinelCore';
import styles from './SovereignHUD.module.scss';

interface HUDProps {
    sentinel: SentinelCore;
    alwaysVisible?: boolean; // Force visible on dev page
}

type TabType = 'visual' | 'network' | 'performance' | 'system';

/**
 * Sovereign HUD - Developer diagnostic overlay
 * 
 * Activated via Ctrl+Shift+S keyboard shortcut
 */
export function SovereignHUD({ sentinel, alwaysVisible = false }: HUDProps) {
    const [visible, setVisible] = useState(alwaysVisible);
    const [collapsed, setCollapsed] = useState(!alwaysVisible);
    const [activeTab, setActiveTab] = useState<TabType>('visual');
    const [visualIssues, setVisualIssues] = useState(0);
    const [networkIssues] = useState(0);
    const [performanceIssues] = useState(0);

    /**
     * Keyboard shortcut handler: Ctrl+Shift+S
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                setVisible(prev => !prev);

                // Auto-expand when opening
                if (!visible) {
                    setCollapsed(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [visible]);

    /**
     * Global console commands: window.sentinel
     */
    useEffect(() => {
        (window as any).sentinel = {
            open: () => {
                setVisible(true);
                setCollapsed(false);
            },
            close: () => setVisible(false),
            toggle: () => setVisible(prev => !prev),
        };

        console.log('💡 Sentinel Commands:');
        console.log('  sentinel.open()');
        console.log('  sentinel.close()');
        console.log('  sentinel.toggle()');

        return () => {
            delete (window as any).sentinel;
        };
    }, []);


    /**
     * Listen to Sentinel events
     */
    useEffect(() => {
        const handleEvent = (event: DiagnosticEvent) => {
            if (event.type === 'violation:detected' && event.module === 'visual') {
                setVisualIssues(event.data.count);
            }
        };

        const unsubscribe = sentinel.on('*', handleEvent);
        return unsubscribe;
    }, [sentinel]);

    /**
     * Get total issue count
     */
    const totalIssues = visualIssues + networkIssues + performanceIssues;

    /**
     * Get visual guardian report
     */
    const visualReport = sentinel.getModule('visual')?.getReport();

    if (!visible) {
        return null;
    }

    return (
        <div className={styles.hudOverlay}>
            {collapsed ? (
                // Mini Badge (Collapsed State)
                <div
                    className={styles.miniBadge}
                    onClick={() => setCollapsed(false)}
                >
                    <Shield size={16} />
                    <span className={styles.count}>{totalIssues}</span>
                </div>
            ) : (
                // Expanded Panel
                <div className={styles.hudPanel}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.title}>
                            <Shield size={20} />
                            <span>Sovereign Sentinel</span>
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.collapseBtn}
                                onClick={() => setCollapsed(true)}
                                title="Collapse"
                            >
                                ─
                            </button>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setVisible(false)}
                                title="Close (Ctrl+Shift+S)"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'visual' ? styles.active : ''}`}
                            onClick={() => setActiveTab('visual')}
                        >
                            <Eye size={16} />
                            <span>Visual</span>
                            {visualIssues > 0 && (
                                <span className={styles.badge}>{visualIssues}</span>
                            )}
                        </button>

                        <button
                            className={`${styles.tab} ${activeTab === 'network' ? styles.active : ''}`}
                            onClick={() => setActiveTab('network')}
                        >
                            <Globe size={16} />
                            <span>Network</span>
                            {networkIssues > 0 && (
                                <span className={styles.badge}>{networkIssues}</span>
                            )}
                        </button>

                        <button
                            className={`${styles.tab} ${activeTab === 'performance' ? styles.active : ''}`}
                            onClick={() => setActiveTab('performance')}
                        >
                            <Zap size={16} />
                            <span>Performance</span>
                            {performanceIssues > 0 && (
                                <span className={styles.badge}>{performanceIssues}</span>
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    <div className={styles.content}>
                        {activeTab === 'visual' && (
                            <div className={styles.tabContent}>
                                <h3>Visual Guardian Report</h3>

                                {visualIssues === 0 ? (
                                    <div className={styles.success}>
                                        ✅ No Hex violations detected
                                    </div>
                                ) : (
                                    <div className={styles.violations}>
                                        <div className={styles.summary}>
                                            <AlertTriangle size={16} className={styles.warning} />
                                            <span>{visualIssues} Hex color violations</span>
                                        </div>

                                        <div className={styles.violationList}>
                                            {visualReport?.hexViolations.slice(0, 5).map((violation, idx) => (
                                                <div key={idx} className={styles.violationItem}>
                                                    <div className={styles.violationHeader}>
                                                        <code>{violation.token}</code>
                                                        <span className={styles.hexValue}>{violation.hexValue}</span>
                                                    </div>
                                                    <div className={styles.violationHint}>
                                                        {violation.fixRecommendation}
                                                    </div>
                                                </div>
                                            ))}

                                            {visualIssues > 5 && (
                                                <div className={styles.more}>
                                                    +{visualIssues - 5} more violations...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'network' && (
                            <div className={styles.tabContent}>
                                <h3>Network Interceptor</h3>
                                <div className={styles.placeholder}>
                                    🌐 Coming in Phase 2
                                </div>
                            </div>
                        )}

                        {activeTab === 'performance' && (
                            <div className={styles.tabContent}>
                                <h3>Performance Vitals</h3>
                                <div className={styles.placeholder}>
                                    ⚡ Coming in Phase 2
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className={styles.hint}>
                            Console: <kbd>sentinel.toggle()</kbd> للتبديل
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

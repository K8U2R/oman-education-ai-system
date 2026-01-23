/**
 * Visual Guardian Module - Phase 1 Implementation
 * @law Law-6 (Visual Sovereign) - Ensures OKLCH compliance
 * @law Law-7 (Diagnostic Protocol) - Accurate visual diagnostics
 */

import type { SentinelCore } from '../../core/SentinelCore';

export interface ColorViolation {
    token: string;
    hexValue: string;
    currentValue: string;
    severity: 'critical' | 'error' | 'warning';
    message: string;
    sourceHint: string;
    fixRecommendation: string;
}

export interface VisualReport {
    hexViolations: ColorViolation[];
    totalIssues: number;
    lastScan: number;
}

/**
 * Visual Guardian - Monitors visual compliance
 */
export class VisualGuardian {
    private sentinel: SentinelCore;
    private violations: ColorViolation[] = [];
    private scanInterval: number | null = null;
    private readonly HEX_COLOR_PATTERN = /#[0-9a-fA-F]{3,8}/g;

    constructor(sentinel: SentinelCore) {
        this.sentinel = sentinel;
    }

    /**
     * Start visual monitoring
     */
    public async start(): Promise<void> {
        console.log('[VisualGuardian] 👁️ Starting visual compliance monitoring...');

        // Initial scan
        await this.scan();

        // Periodic scans every 5 seconds
        this.scanInterval = window.setInterval(() => {
            this.scan();
        }, 5000);
    }

    /**
     * Stop monitoring
     */
    public async stop(): Promise<void> {
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        console.log('[VisualGuardian] 🛑 Stopped');
    }

    /**
     * Scan for visual violations
     */
    private async scan(): Promise<void> {
        this.violations = [];

        // Get computed styles from root
        const root = document.documentElement;
        const computedStyle = window.getComputedStyle(root);

        // Scan CSS custom properties
        const properties = Array.from(computedStyle).filter(prop => prop.startsWith('--'));

        properties.forEach(token => {
            const value = computedStyle.getPropertyValue(token).trim();

            if (this.HEX_COLOR_PATTERN.test(value)) {
                const hexValue = value.match(this.HEX_COLOR_PATTERN)?.[0] || value;

                this.violations.push({
                    token,
                    hexValue,
                    currentValue: value,
                    severity: 'error',
                    message: `❌ Hex color detected: ${token}`,
                    sourceHint: 'تحقق من ملفات SCSS للمصدر الفعلي',
                    fixRecommendation: 'استبدل القيمة بـ OKLCH في الملف المصدر',
                });
            }
        });

        // Emit event if violations found
        if (this.violations.length > 0) {
            this.sentinel.emit({
                type: 'violation:detected',
                module: 'visual',
                data: {
                    count: this.violations.length,
                    violations: this.violations,
                },
            });
        }
    }

    /**
     * Get current violations
     */
    public getViolations(): ColorViolation[] {
        return [...this.violations];
    }

    /**
     * Get diagnostic report
     */
    public getReport(): VisualReport {
        return {
            hexViolations: this.getViolations(),
            totalIssues: this.violations.length,
            lastScan: Date.now(),
        };
    }

    /**
     * Force a scan
     */
    public async forceScan(): Promise<void> {
        await this.scan();
    }
}

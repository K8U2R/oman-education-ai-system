/**
 * Performance Vitals Module - Phase 1 Stub
 * @law Law-7 (Diagnostic Protocol) - Performance monitoring
 */

import type { SentinelCore } from '../../core/SentinelCore';

/**
 * Performance Vitals - Monitors runtime performance (Phase 1 stub)
 */
export class PerformanceVitals {
    constructor(_sentinel: SentinelCore) {
        // Reserved for future use
    }

    public async start(): Promise<void> {
        console.log('[PerformanceVitals] ⚡ Performance monitoring ready (Phase 2)');
    }

    public async stop(): Promise<void> {
        // Placeholder
    }

    public getReport() {
        return {
            fps: 60,
            memory: 0,
            renders: 0,
        };
    }
}

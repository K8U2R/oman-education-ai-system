/**
 * Sentinel Core Engine - Singleton Pattern
 * @law Law-7 (Diagnostic Protocol) - Central diagnostic orchestration
 * @law Law-12 (Operational Protocols) - System health monitoring
 * 
 * The heart of the Sovereign Sentinel system. Manages all diagnostic modules
 * and provides centralized event coordination.
 */

import { VisualGuardian } from '../modules/visual/VisualGuardian';
import { NetworkInterceptor } from '../modules/network/NetworkInterceptor';
import { PerformanceVitals } from '../modules/performance/PerformanceVitals';

/**
 * Helper to check if Sentinel logging is enabled
 */
const shouldLog = () => import.meta.env.VITE_ENABLE_SENTINEL_LOGS === 'true';

/**
 * Sentinel configuration interface
 */
export interface SentinelConfig {
    enabled: boolean;
    environment: 'development' | 'staging' | 'production';
    modules: {
        visual: boolean;
        network: boolean;
        performance: boolean;
    };
}

/**
 * Diagnostic event types for inter-module communication
 */
export type DiagnosticEvent =
    | { type: 'violation:detected'; module: string; data: any }
    | { type: 'performance:warning'; metric: string; value: number }
    | { type: 'network:failure'; request: string; error: any }
    | { type: 'hud:toggle'; visible: boolean };

type EventCallback = (event: DiagnosticEvent) => void;

/**
 * Sovereign Sentinel Core Engine
 * 
 * Singleton class that orchestrates all diagnostic modules and provides
 * a centralized event bus for communication.
 */
export class SentinelCore {
    private static instance: SentinelCore | null = null;

    private config: SentinelConfig;
    private modules: {
        visual?: VisualGuardian;
        network?: NetworkInterceptor;
        performance?: PerformanceVitals;
    } = {};

    private eventListeners: Map<string, EventCallback[]> = new Map();
    private initialized: boolean = false;

    /**
     * Private constructor (Singleton pattern)
     */
    private constructor(config: SentinelConfig) {
        this.config = config;
    }

    /**
     * Get or create Sentinel instance
     */
    public static getInstance(config?: SentinelConfig): SentinelCore {
        if (!SentinelCore.instance) {
            if (!config) {
                throw new Error('SentinelCore: Initial configuration required');
            }
            SentinelCore.instance = new SentinelCore(config);
        }
        return SentinelCore.instance;
    }

    /**
     * Check if Sentinel should be enabled based on environment
     */
    public static shouldEnable(): boolean {
        // Development mode
        if (import.meta.env.DEV) {
            return true;
        }

        // Manual override via localStorage
        if (typeof window !== 'undefined') {
            const override = localStorage.getItem('ENABLE_SENTINEL');
            if (override === 'true') {
                return true;
            }
        }

        // Production emergency key (from URL)
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const key = params.get('sentinel_key');
            if (key === import.meta.env.VITE_SENTINEL_SECRET) {
                return true;
            }
        }

        return false;
    }

    /**
     * Initialize all enabled modules
     */
    public async initialize(): Promise<void> {
        if (this.initialized) {
            if (shouldLog()) console.warn('[Sentinel] Already initialized');
            return;
        }

        if (shouldLog()) console.log('[Sentinel] 🛡️ Initializing Sovereign Sentinel Core...');

        try {
            // Initialize Visual Guardian
            if (this.config.modules.visual) {
                const { VisualGuardian } = await import('../modules/visual/VisualGuardian');
                this.modules.visual = new VisualGuardian(this);
                await this.modules.visual.start();
                if (shouldLog()) console.log('[Sentinel] ✅ Visual Guardian loaded');
            }

            // Initialize Network Interceptor
            if (this.config.modules.network) {
                const { NetworkInterceptor } = await import('../modules/network/NetworkInterceptor');
                this.modules.network = new NetworkInterceptor(this);
                await this.modules.network.start();
                if (shouldLog()) console.log('[Sentinel] ✅ Network Interceptor loaded');
            }

            // Initialize Performance Vitals
            if (this.config.modules.performance) {
                const { PerformanceVitals } = await import('../modules/performance/PerformanceVitals');
                this.modules.performance = new PerformanceVitals(this);
                await this.modules.performance.start();
                if (shouldLog()) console.log('[Sentinel] ✅ Performance Vitals loaded');
            }

            this.initialized = true;
            if (shouldLog()) console.log('[Sentinel] 🚀 All modules ready');
        } catch (error) {
            console.error('[Sentinel] ❌ Initialization failed:', error);
            throw error;
        }
    }

    /**
     * Shutdown all modules
     */
    public async shutdown(): Promise<void> {
        if (shouldLog()) console.log('[Sentinel] 🛑 Shutting down...');

        if (this.modules.visual) {
            await this.modules.visual.stop();
        }
        if (this.modules.network) {
            await this.modules.network.stop();
        }
        if (this.modules.performance) {
            await this.modules.performance.stop();
        }

        this.initialized = false;
        this.eventListeners.clear();

        if (shouldLog()) console.log('[Sentinel] ✅ Shutdown complete');
    }

    /**
     * Event Bus - Subscribe to diagnostic events
     */
    public on(eventType: string, callback: EventCallback): () => void {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }

        this.eventListeners.get(eventType)!.push(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.eventListeners.get(eventType);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
    }

    /**
     * Event Bus - Emit diagnostic events
     */
    public emit(event: DiagnosticEvent): void {
        const listeners = this.eventListeners.get(event.type);
        if (listeners) {
            listeners.forEach(callback => callback(event));
        }

        // Also emit to wildcard listeners
        const wildcardListeners = this.eventListeners.get('*');
        if (wildcardListeners) {
            wildcardListeners.forEach(callback => callback(event));
        }
    }

    /**
     * Get current diagnostic report
     */
    public getReport() {
        return {
            timestamp: new Date().toISOString(),
            environment: this.config.environment,
            modules: {
                visual: this.modules.visual?.getReport() || null,
                network: this.modules.network?.getReport() || null,
                performance: this.modules.performance?.getReport() || null,
            }
        };
    }

    /**
     * Get module instance
     */
    public getModule<T extends keyof SentinelCore['modules']>(name: T): SentinelCore['modules'][T] {
        return this.modules[name];
    }

    /**
     * Check if initialized
     */
    public isInitialized(): boolean {
        return this.initialized;
    }
}

/**
 * Factory function for creating Sentinel instance
 */
export function createSentinel(overrideConfig?: Partial<SentinelConfig>): SentinelCore | null {
    if (!SentinelCore.shouldEnable()) {
        if (shouldLog()) console.log('[Sentinel] 🚫 Disabled (not in dev mode)');
        return null;
    }

    const config: SentinelConfig = {
        enabled: true,
        environment: import.meta.env.DEV ? 'development' : import.meta.env.MODE as any,
        modules: {
            visual: true,
            network: true,
            performance: true,
        },
        ...overrideConfig,
    };

    return SentinelCore.getInstance(config);
}

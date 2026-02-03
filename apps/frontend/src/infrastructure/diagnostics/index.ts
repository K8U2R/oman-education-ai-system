/**
 * Sentinel Diagnostics - Main Export
 * @law Law-7 (Diagnostic Protocol)
 */

export { SentinelCore, createSentinel } from './core/SentinelCore';
export { SovereignHUD } from './ui/SovereignHUD';
export { SentinelProvider } from './SentinelProvider';
export { SentinelContext, useSentinel } from './SentinelContext';
export { VisualGuardian } from './modules/visual/VisualGuardian';
export { NetworkInterceptor } from './modules/network/NetworkInterceptor';
export { PerformanceVitals } from './modules/performance/PerformanceVitals';
export type { SentinelConfig, DiagnosticEvent } from './core/SentinelCore';

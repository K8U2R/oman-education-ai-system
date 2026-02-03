import { Store } from 'express-session';

/**
 * Session Store Interface
 * Abstraction for session storage backends
 * 
 * @compliance LAW_02 - Strict Typing
 * @compliance LAW_13 - DI Integrity
 */
export interface ISessionStore {
    /**
     * Get the underlying store instance
     * @returns The express-session compatible store
     */
    getStore(): Store;

    /**
     * Connect to the store backend
     * @throws Error if connection fails
     */
    connect(): Promise<void>;

    /**
     * Gracefully disconnect from the store
     */
    disconnect(): Promise<void>;

    /**
     * Health check for the store
     * @returns true if connection is healthy, false otherwise
     */
    isHealthy(): Promise<boolean>;
}

import Redis from 'ioredis';
import { ICacheProvider } from '@/domain/interfaces/adapters/cache/ICacheProvider.js';
import { ENV_CONFIG } from '@/infrastructure/config/env.config.js';
import { logger } from '@/shared/utils/logger.js';

export class RedisAdapter implements ICacheProvider {
    private client: Redis;
    private isConnected = false;

    constructor() {
        // Law 08: Fail-Safe Configuration
        this.client = new Redis({
            host: ENV_CONFIG.REDIS_HOST,
            port: ENV_CONFIG.REDIS_PORT,
            password: ENV_CONFIG.REDIS_PASSWORD,
            lazyConnect: true, // Don't crash on startup if Redis is down
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay; // Exponential backoff max 2s
            },
            maxRetriesPerRequest: 1 // Fail fast for individual requests
        });

        this.setupEventListeners();
        this.connect();
    }

    private setupEventListeners() {
        this.client.on('connect', () => {
            this.isConnected = true;
            logger.info('Redis Connected 🚀');
        });

        this.client.on('error', (err: Error) => {
            this.isConnected = false;
            // Silent log to avoid spamming
            if ((err as any).code === 'ECONNREFUSED') {
                logger.warn('Redis Connection Failed (Cache disabled)');
            } else {
                logger.error('Redis Error', { error: err.message });
            }
        });

        this.client.on('close', () => {
            this.isConnected = false;
        });
    }

    private async connect() {
        try {
            await this.client.connect();
        } catch (_error) {
            // Handled by event listener
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.isConnected) return null; // Fail-Safe: Bypass cache if down

        try {
            const result = await this.client.get(key);
            if (!result) return null;
            return JSON.parse(result) as T;
        } catch (_error) {
            return null; // Treat parse error or fetch error as cache miss
        }
    }

    async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
        if (!this.isConnected) return; // Fail-Safe

        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.client.set(key, serialized, 'EX', ttlSeconds);
            } else {
                await this.client.set(key, serialized);
            }
        } catch (_error) {
            logger.warn('Failed to set cache key', { key });
        }
    }

    async del(key: string): Promise<void> {
        if (!this.isConnected) return;

        try {
            await this.client.del(key);
        } catch (_error) {
            logger.warn('Failed to delete cache key', { key });
        }
    }

    async checkHealth(): Promise<boolean> {
        return this.isConnected;
    }
}

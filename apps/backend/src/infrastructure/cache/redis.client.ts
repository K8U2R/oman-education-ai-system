/**
 * Redis Client Wrapper - لف عميل Redis
 * 
 * Singleton Redis client with connection management and error handling
 */

import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { logger } from '@/shared/utils/logger.js';

export class RedisClient {
    private static instance: RedisClient;
    private client: RedisClientType;
    private isConnected = false;

    private constructor() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

        this.client = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        logger.error('❌ Redis: Max reconnection attempts reached');
                        return new Error('Max retries reached');
                    }
                    const delay = Math.min(retries * 50, 500);
                    logger.warn(`⚠️ Redis: Reconnecting... attempt ${retries}, delay ${delay}ms`);
                    return delay;
                }
            }
        });

        // Event handlers
        this.client.on('error', (err) => {
            logger.error('❌ Redis Error:', err);
            this.isConnected = false;
        });

        this.client.on('connect', () => {
            logger.info('🔌 Redis: Connecting...');
        });

        this.client.on('ready', () => {
            logger.info('✅ Redis: Connected and ready');
            this.isConnected = true;
        });

        this.client.on('reconnecting', () => {
            logger.warn('🔄 Redis: Reconnecting...');
        });
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            try {
                await this.client.connect();
                logger.info('✅ Redis Client connected successfully');
            } catch (error) {
                logger.error('❌ Failed to connect Redis:', error);
                throw error;
            }
        }
    }

    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.client.disconnect();
            this.isConnected = false;
            logger.info('🔌 Redis Client disconnected');
        }
    }

    public getClient(): RedisClientType {
        return this.client;
    }

    public connected(): boolean {
        return this.isConnected;
    }
}

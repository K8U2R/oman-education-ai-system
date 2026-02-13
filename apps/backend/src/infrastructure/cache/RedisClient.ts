/**
 * Redis Client Service
 * @law Law-2 (Zod Contracts) - Environment validation
 * @law Law-9 (Documentation) - JSDoc headers
 */

import Redis, { type RedisOptions } from 'ioredis'
import { logger } from '../../shared/utils/logger.js'
import { ENV_CONFIG as env } from '../config/environment/env.config.js'

class RedisClient {
    private static instance: RedisClient
    private client: Redis | null = null
    private isConnected: boolean = false

    private constructor() {
        // Private constructor for singleton
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient()
        }
        return RedisClient.instance
    }

    /**
     * Initialize Redis connection
     */
    public async connect(): Promise<void> {
        if (this.client && this.isConnected) {
            logger.warn('Redis client already connected')
            return
        }

        const redisConfig: RedisOptions = {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            password: env.REDIS_PASSWORD || undefined,
            db: env.REDIS_DB || 0,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000)
                logger.warn(`Redis retry attempt ${times}, waiting ${delay}ms`)
                return delay
            },
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            lazyConnect: false,
        }

        try {
            this.client = new Redis(redisConfig)

            this.client.on('connect', () => {
                logger.info('Redis client connecting...')
            })

            this.client.on('ready', () => {
                this.isConnected = true
                logger.info('✅ Redis client connected and ready')
            })

            this.client.on('error', (err) => {
                logger.error('Redis client error:', err)
                this.isConnected = false
            })

            this.client.on('close', () => {
                logger.warn('Redis client connection closed')
                this.isConnected = false
            })

            this.client.on('reconnecting', () => {
                logger.info('Redis client reconnecting...')
            })

            // Wait for connection
            await this.client.ping()
            logger.info('Redis ping successful')
        } catch (error) {
            logger.error('Failed to connect to Redis:', error)
            throw new Error(`Redis connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    /**
     * Get the Redis client instance
     */
    public getClient(): Redis {
        if (!this.client || !this.isConnected) {
            throw new Error('Redis client not connected. Call connect() first.')
        }
        return this.client
    }

    /**
     * Check if Redis is connected
     */
    public async isHealthy(): Promise<boolean> {
        try {
            if (!this.client) return false
            const result = await this.client.ping()
            return result === 'PONG'
        } catch {
            return false
        }
    }

    /**
     * Disconnect from Redis
     */
    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.quit()
            this.client = null
            this.isConnected = false
            logger.info('Redis client disconnected')
        }
    }

    /**
     * Utility: Set with expiration (TTL)
     */
    public async setex(key: string, ttl: number, value: string): Promise<void> {
        const client = this.getClient()
        await client.setex(key, ttl, value)
    }

    /**
     * Utility: Get value
     */
    public async get(key: string): Promise<string | null> {
        const client = this.getClient()
        return await client.get(key)
    }

    /**
     * Utility: Delete key
     */
    public async del(key: string): Promise<number> {
        const client = this.getClient()
        return await client.del(key)
    }

    /**
     * Utility: Check if key exists
     */
    public async exists(key: string): Promise<boolean> {
        const client = this.getClient()
        const result = await client.exists(key)
        return result === 1
    }

    /**
     * Utility: Increment counter (atomic)
     */
    public async incr(key: string): Promise<number> {
        const client = this.getClient()
        return await client.incr(key)
    }

    /**
     * Utility: Set expiration on existing key
     */
    public async expire(key: string, ttl: number): Promise<boolean> {
        const client = this.getClient()
        const result = await client.expire(key, ttl)
        return result === 1
    }
}

export const redisClient = RedisClient.getInstance()

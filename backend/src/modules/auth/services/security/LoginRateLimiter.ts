import { RedisCacheAdapter } from "@/infrastructure/adapters/cache/RedisCacheAdapter.js";
import { logger } from "@/shared/utils/logger.js";

export class LoginRateLimiter {

    private readonly redis: RedisCacheAdapter;
    private readonly MAX_ATTEMPTS = 5;
    private readonly WINDOW_SECONDS = 15 * 60; // 15 minutes

    constructor() {
        this.redis = new RedisCacheAdapter();
    }

    async checkLimit(ip: string, email: string): Promise<void> {
        const key = `auth:ratelimit:${ip}`;
        const attempts = await this.redis.get<number>(key);

        if (attempts && attempts >= this.MAX_ATTEMPTS) {
            logger.warn(`Rate limit exceeded for IP: ${ip}, Email: ${email}`);
            throw new Error("Too many login attempts. Please try again later.");
        }
    }

    async recordSuccess(ip: string, _email: string): Promise<void> {
        const key = `auth:ratelimit:${ip}`;
        await this.redis.delete(key);
    }

    async recordFailedAttempt(ip: string, email: string): Promise<void> {
        const key = `auth:ratelimit:${ip}`;
        const attempts = (await this.redis.get<number>(key)) || 0;

        await this.redis.set(key, attempts + 1, this.WINDOW_SECONDS);
        logger.warn(`Login failed for ${email} from ${ip}. Attempts: ${attempts + 1}`);
    }
}

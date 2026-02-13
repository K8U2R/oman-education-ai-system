import { container } from "@/infrastructure/di/Container.js";
import { RedisAdapter } from "@/infrastructure/adapters/cache/RedisAdapter.js";
import { RedisClient } from "@/infrastructure/cache/redis.client.js";

export function registerCacheModule(): void {
  // Singleton because Redis manages its own connection pool
  container.registerSingleton("ICacheProvider", RedisAdapter);

  // Register RedisClient for distributed rate limiting
  container.registerSingleton("RedisClient", () => {
    const redis = RedisClient.getInstance();
    // Non-blocking connection - will reconnect automatically
    redis.connect().catch(err => {
      console.error('Redis connection failed on startup:', err);
    });
    return redis;
  });

  console.log("🚀 Rapid Memory: Redis Adapter Registered");
  console.log("💾 Cache Module: Redis Client Registered");
}

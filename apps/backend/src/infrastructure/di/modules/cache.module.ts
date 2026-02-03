import { container } from "@/infrastructure/di/Container.js";
import { RedisAdapter } from "@/infrastructure/adapters/cache/RedisAdapter.js";

export function registerCacheModule(): void {
    // Singleton because Redis manages its own connection pool
    container.registerSingleton("ICacheProvider", RedisAdapter);
    console.log("🚀 Rapid Memory: Redis Adapter Registered");
}

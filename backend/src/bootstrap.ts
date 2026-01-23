/**
 * Bootstrap - إقلاع النظام
 *
 * Handles all initialization logic before the server starts.
 * Updated to use the central ENV_CONFIG engine for all environment checks.
 */

import { logger } from "./shared/utils/logger.js";
import { getSettings } from "./shared/configuration/index.js";
import { initializeServices } from "./infrastructure/di/index.js";
import { getConfigManager as _getConfigManager } from "./infrastructure/config/ConfigManager.js";
import { ENV_CONFIG as _ENV_CONFIG } from "./infrastructure/config/env.config.js";

/**
 * Sovereign Bootstrap Sequence
 */
export async function bootstrap() {
  console.log('\n' + '═'.repeat(80));
  console.log('🚀 SYSTEM BOOTSTRAP STARTED');
  console.log('═'.repeat(80) + '\n');

  logger.info("🚀 Bootstrapping Oman Education AI System...");

  // 1. Centralized Environment Integrity Check (Automatic via Import of env.config.ts)
  console.log('⏳ Step 1/5: Loading Environment Configuration...');
  const { ENV_CONFIG } = await import("./infrastructure/config/env.config.js");
  console.log(`   ✅ Environment: ${ENV_CONFIG.NODE_ENV}`);
  console.log(`   ✅ Port: ${ENV_CONFIG.PORT}`);
  console.log(`   ✅ Database: ${ENV_CONFIG.DATABASE_URL ? 'Configured' : '❌ Not Configured'}`);
  console.log(`   ✅ Redis: ${ENV_CONFIG.REDIS_HOST}:${ENV_CONFIG.REDIS_PORT}`);
  console.log(`   ✅ Frontend CORS: ${ENV_CONFIG.CORS_ORIGIN}`);

  // 2. Initialize Dependency Injection Container
  console.log('\n📦 Step 2/5: Initializing Dependency Injection Container...');
  initializeServices();
  logger.info("✅ Dependency Injection Container initialized");
  console.log('   ✅ All services registered\n');

  // 3. Initialize AI Provider
  console.log('🤖 Step 3/5: Initializing AI Provider...');
  try {
    if (ENV_CONFIG.AI_DEFAULT_PROVIDER === "openai") {
      if (!ENV_CONFIG.OPENAI_API_KEY) {
        console.log('   ⚠️  OpenAI API Key not configured - AI features disabled');
        throw new Error('No API key');
      }
      const { createAIProvider } =
        await import("./infrastructure/adapters/ai/AIProviderFactory.js");
      const aiProvider = await createAIProvider();
      (globalThis as unknown & { setAIProvider?: (provider: unknown) => void }).setAIProvider?.(aiProvider);
      logger.info("✅ AI Provider initialized");
      console.log('   ✅ OpenAI Provider ready\n');
    } else {
      console.log(`   ℹ️  AI Provider: ${ENV_CONFIG.AI_DEFAULT_PROVIDER || 'None'}\n`);
    }
  } catch (error) {
    logger.warn("⚠️ AI Provider failed (Degradation Mode Active)", { error });
    console.log('   ⚠️  Running in degradation mode (AI features disabled)\n');
  }

  // 4. Verify Critical Services
  console.log('🔍 Step 4/5: Verifying Critical Services...');

  try {
    const { container } = await import("./infrastructure/di/index.js");
    const databaseAdapter = container.resolve<any>("DatabaseAdapter");

    console.log('   📊 Database: Checking connection to Database Core...');
    const dbHealth = await Promise.race([
      databaseAdapter.healthCheck(),
      new Promise<boolean>((_, reject) => setTimeout(() => reject(new Error("BOOT_TIMEOUT: Database Core did not respond within 10s")), 10000))
    ]);

    if (!dbHealth) {
      throw new Error("Database Core Service returned unhealthy status");
    }
    console.log('   ✅ Database: Connected and Healthy');
  } catch (error) {
    console.error(`   ❌ Database: Connection Failed!`);
    throw error;
  }

  console.log('   💾 Redis/Memurai: Verification skipped (Non-blocking)');
  console.log('   ✅ Service verification complete\n');

  // 5. Load Settings
  console.log('⚙️  Step 5/5: Loading Application Settings...');
  const settings = getSettings();
  console.log('   ✅ Settings loaded successfully\n');

  console.log('═'.repeat(80));
  console.log('✅ BOOTSTRAP COMPLETE');
  console.log('═'.repeat(80) + '\n');

  return settings;
}

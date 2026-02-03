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
  logger.info(`
🚀 SYSTEM BOOTSTRAP STARTED
════════════════════════════════════════════════════════════════════════════════
`);

  logger.info("🚀 Bootstrapping Oman Education AI System...");

  // 1. Centralized Environment Integrity Check (Automatic via Import of env.config.ts)
  logger.info('⏳ Step 1/5: Loading Environment Configuration...');
  const { ENV_CONFIG } = await import("./infrastructure/config/env.config.js");
  logger.info(`   ✅ Environment: ${ENV_CONFIG.NODE_ENV}`);
  logger.info(`   ✅ Port: ${ENV_CONFIG.PORT}`);
  logger.info(`   ✅ Database: ${ENV_CONFIG.DATABASE_URL ? 'Configured' : '❌ Not Configured'}`);
  logger.info(`   ✅ Redis: ${ENV_CONFIG.REDIS_HOST}:${ENV_CONFIG.REDIS_PORT}`);
  logger.info(`   ✅ Frontend CORS: ${ENV_CONFIG.CORS_ORIGIN}`);

  // 2. Initialize Dependency Injection Container
  logger.info('\n📦 Step 2/5: Initializing Dependency Injection Container...');
  initializeServices();
  logger.info("✅ Dependency Injection Container initialized");
  logger.info('   ✅ All services registered\n');

  // 3. Initialize AI Provider
  logger.info('🤖 Step 3/5: Initializing AI Provider...');
  try {
    if (ENV_CONFIG.AI_DEFAULT_PROVIDER === "openai") {
      if (!ENV_CONFIG.OPENAI_API_KEY) {
        logger.info('   ⚠️  OpenAI API Key not configured - AI features disabled');
        throw new Error('No API key');
      }
      const { createAIProvider } =
        await import("./infrastructure/adapters/ai/AIProviderFactory.js");
      const aiProvider = await createAIProvider();
      (globalThis as unknown & { setAIProvider?: (provider: unknown) => void }).setAIProvider?.(aiProvider);
      logger.info("✅ AI Provider initialized");
      logger.info('   ✅ OpenAI Provider ready\n');
    } else {
      logger.info(`   ℹ️  AI Provider: ${ENV_CONFIG.AI_DEFAULT_PROVIDER || 'None'}\n`);
    }
  } catch (error) {
    logger.warn("⚠️ AI Provider failed (Degradation Mode Active)", { error });
    logger.info('   ⚠️  Running in degradation mode (AI features disabled)\n');
  }

  // 4. Verify Critical Services
  logger.info('🔍 Step 4/5: Verifying Critical Services...');

  const MAX_RETRIES = 10;
  const RETRY_DELAY_MS = 3000;
  let dbConnected = false;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { container } = await import("./infrastructure/di/index.js");
      const databaseAdapter = container.resolve<{ healthCheck: () => Promise<boolean> }>("DatabaseAdapter");

      logger.info(`   📊 Database: Checking connection (Attempt ${attempt}/${MAX_RETRIES})...`);

      const dbHealth = await Promise.race([
        databaseAdapter.healthCheck(),
        new Promise<boolean>((_, reject) => setTimeout(() => reject(new Error("BOOT_TIMEOUT: Database Core did not respond within 10s")), 10000))
      ]);

      if (dbHealth) {
        logger.info('   ✅ Database: Connected and Healthy');
        dbConnected = true;
        break;
      }

      throw new Error("Database Core Service returned unhealthy status");
    } catch (error) {
      const isLastAttempt = attempt === MAX_RETRIES;
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (isLastAttempt) {
        logger.error(`   ❌ Database: Final connection attempt failed!`);
        throw error;
      }

      logger.warn(`   ⚠️ Database: Attempt ${attempt} failed (${errorMessage}). Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  if (!dbConnected) {
    throw new Error("Failed to establish stable connection to Database Core after multiple attempts.");
  }

  logger.info('   💾 Redis/Memurai: Verification skipped (Non-blocking)');
  logger.info('   ✅ Service verification complete\n');

  // 5. Load Settings
  logger.info('⚙️  Step 5/5: Loading Application Settings...');
  const settings = getSettings();
  logger.info('   ✅ Settings loaded successfully\n');

  logger.info(`
✅ BOOTSTRAP COMPLETE
════════════════════════════════════════════════════════════════════════════════
`);

  return settings;
}

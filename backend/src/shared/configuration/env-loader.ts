/**
 * Environment Loader - محمّل المتغيرات البيئية
 *
 * يحمّل المتغيرات البيئية من ملف .env
 */

import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

export function loadEnvironment(env?: string): void {
  const nodeEnv = env || process.env.NODE_ENV || "development";

  // Try to load .env.{NODE_ENV} first
  const envFile = resolve(process.cwd(), `.env.${nodeEnv}`);
  if (existsSync(envFile)) {
    dotenv.config({ path: envFile, override: true });
    return;
  }

  // Fallback to .env
  const defaultEnvFile = resolve(process.cwd(), ".env");
  if (existsSync(defaultEnvFile)) {
    dotenv.config({ path: defaultEnvFile, override: false });
  }

  // Always load .env (for defaults)
  dotenv.config();
}

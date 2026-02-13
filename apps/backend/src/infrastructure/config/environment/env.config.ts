/**
 * Central Environment Configuration Engine
 *
 * @law Law-5 (Config Law) - ONLY file allowed to touch process.env
 * @law Law-10 (Modularity) - Uses new Modular Env System
 */

import { loadEnv } from "../../../../env/loader.js";

// Load, Aggregate, Validate, and Lock Configuration
const env = loadEnv();

export const ENV_CONFIG = env;

console.log("🛡️ Sovereign Configuration Verified & Locked (Modular System)");

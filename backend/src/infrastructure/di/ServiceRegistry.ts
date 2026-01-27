/**
 * Service Registry - Orchestrator
 * Constitutional Authority: LAWS.md - Law 3 (Cluster Sovereignty)
 * 
 * This file acts ONLY as an orchestrator. Direct service imports are BANNED here.
 */

import { registerInfrastructureModule } from "./modules/infrastructure.module.js";
import { registerAuthModule } from "./modules/auth.module.js";
import { registerSystemModule } from "./modules/system.module.js";
import { registerCommunicationModule } from "./modules/communication.module.js";
import { registerEducationModule } from "./modules/education.module.js";
import { registerAIModule } from "./modules/ai.module.js";
import { registerEmailModule } from "./modules/email.module.js";
import { registerCacheModule } from "./modules/cache.module.js";
import { registerSecurityModule } from "./modules/security.module.js";

/**
 * Initialize all Sovereign Modules
 */
export function registerServices(): void {
  // 1. Infrastructure first (Core Adapters)
  registerInfrastructureModule();
  registerCacheModule(); // Rapid Memory
  registerAIModule(); // Neural Core
  registerEmailModule(); // Communication Core

  // 2. Domain Clusters
  registerAuthModule();
  registerSystemModule();
  registerCommunicationModule();
  registerSecurityModule();
  registerEducationModule();
}

/**
 * Bootstrap DI Container
 */
export function initializeServices(): void {
  registerServices();
}

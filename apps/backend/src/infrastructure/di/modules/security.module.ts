import { container } from "../Container.js";
import { SecurityService } from "@/modules/security/index.js";
import { SecurityAnalyticsService } from "@/modules/security/services/SecurityAnalyticsService.js";
import { SecurityMonitoringService } from "@/modules/security/services/SecurityMonitoringService.js";
import { prisma } from "@/infrastructure/database/client.js";

/**
 * Security Module - وحدة الأمان
 * Registers security services and strategies.
 */
export function registerSecurityModule(): void {
  container.register(
    "SecurityService",
    (_c) => {
      return new SecurityService(prisma);
    },
    "singleton",
  );

  container.register(
    "SecurityAnalyticsService",
    () => new SecurityAnalyticsService(),
    "singleton",
  );

  container.register(
    "SecurityMonitoringService",
    () => new SecurityMonitoringService(),
    "singleton",
  );

  console.log("🔒 Security Module Registered");
}

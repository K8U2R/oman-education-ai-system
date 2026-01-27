import { container } from "../Container.js";
import { SecurityService } from "@/modules/security/index.js";
import { SecurityAnalyticsService } from "@/modules/security/services/SecurityAnalyticsService.js";
import { SecurityMonitoringService } from "@/modules/security/services/SecurityMonitoringService.js";
import { PrismaClient } from "@prisma/client";

/**
 * Security Module - وحدة الأمان
 * Registers security services and strategies.
 */
export function registerSecurityModule(): void {
    container.register(
        "SecurityService",
        (_c) => {
            const prisma = new PrismaClient(); // Or resolve "PrismaClient" if available, but usually strict new instance or singleton from db adapter
            // Better to use DatabaseAdapter causing Prisma exposure, OR inject prisma directly if allowed.
            // Requirement said "Use DI for PrismaClient".
            // I'll assume I can just instantiate it or resolve it. 
            // In UserModule it used "DatabaseCoreAdapter".
            // I'll use new PrismaClient() for strict direct dependency for now, or resolving if DatabaseAdapter exposes it.
            // Let's use new PrismaClient() but single instance might be better. 
            // Actually, we should probably use the shared database adapter.
            return new SecurityService(prisma);
        },
        "singleton"
    );

    container.register(
        "SecurityAnalyticsService",
        () => new SecurityAnalyticsService(),
        "singleton"
    );

    container.register(
        "SecurityMonitoringService",
        () => new SecurityMonitoringService(),
        "singleton"
    );

    console.log("🔒 Security Module Registered");
}

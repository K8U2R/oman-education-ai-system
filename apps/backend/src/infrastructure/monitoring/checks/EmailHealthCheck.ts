/**
 * Email Health Check
 *
 * Health check للتحقق من خدمة البريد الإلكتروني
 */

// Infrastructure Layer
import { IHealthCheck, HealthCheckResult } from "../HealthChecker";

// Application Layer - استخدام barrel exports
import { EmailService } from "@/application/services";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

export class EmailHealthCheck implements IHealthCheck {
  name = "email";

  constructor(private readonly emailService: EmailService) {}

  async check(): Promise<HealthCheckResult> {
    const start = Date.now();

    try {
      const isValid = await this.emailService.validate();
      const latency = Date.now() - start;

      if (isValid) {
        return {
          name: this.name,
          status: "healthy",
          latency,
          message: "Email service is configured and ready",
        };
      }

      return {
        name: this.name,
        status: "degraded",
        latency,
        message: "Email service not configured",
      };
    } catch (error) {
      const latency = Date.now() - start;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      logger.warn("Email service health check failed", { error: errorMessage });

      return {
        name: this.name,
        status: "unhealthy",
        latency,
        message: errorMessage,
      };
    }
  }
}

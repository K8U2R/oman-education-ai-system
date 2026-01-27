import { container } from "@/infrastructure/di/Container.js";
import { NodemailerAdapter } from "@/infrastructure/adapters/email/NodemailerAdapter.js";
import { ConsoleAdapter } from "@/infrastructure/adapters/email/ConsoleAdapter.js";
import { ENV_CONFIG } from "@/infrastructure/config/env.config.js";

export function registerEmailModule(): void {
    // Config-driven switching (Strategy Pattern)
    if (ENV_CONFIG.EMAIL_PROVIDER === 'console') {
        container.registerFactory("IEmailProvider", () => new ConsoleAdapter("dev@oman-edu.ai", "Dev System"));
        // container.registerSingleton("IEmailProvider", ConsoleAdapter);
        console.log("📨 Email Channel: Console Mode (Dev)");
    } else {
        container.registerSingleton("IEmailProvider", NodemailerAdapter);
        console.log(`📨 Email Channel: SMTP Mode (${ENV_CONFIG.SMTP_HOST})`);
    }
}

import { container } from "../Container.js";
import { NodemailerAdapter } from "../../adapters/email/NodemailerAdapter.js";
import { SendGridAdapter } from "../../adapters/email/SendGridAdapter.js";
import { ConsoleAdapter } from "../../adapters/email/ConsoleAdapter.js";
import { ENV_CONFIG } from "../../config/env.config.js";

export function registerEmailModule(): void {
  // Config-driven email provider selection (Strategy Pattern)
  const provider = ENV_CONFIG.EMAIL_PROVIDER;

  if (provider === "sendgrid") {
    container.registerSingleton("IEmailProvider", SendGridAdapter);
    console.log("📨 Email Channel: SendGrid (Production)");
  } else if (provider === "smtp") {
    container.registerSingleton("IEmailProvider", NodemailerAdapter);
    console.log(
      `📨 Email Channel: SMTP Mode (${ENV_CONFIG.SMTP_HOST || "configured"})`,
    );
  } else {
    // Default: console mode for development
    container.registerFactory(
      "IEmailProvider",
      () => new ConsoleAdapter("dev@oman-edu.ai", "Dev System"),
    );
    console.log("📨 Email Channel: Console Mode (Dev)");
  }
}

import { container } from "../Container.js";
import { DatabaseCoreAdapter } from "../../adapters/db/DatabaseCoreAdapter.js";
import { NodemailerAdapter } from "../../adapters/email/NodemailerAdapter.js";
import { GoogleOAuthAdapter } from "../../adapters/db/GoogleOAuthAdapter.js";

/**
 * Infrastructure Module - وحدة البنية التحتية
 * Handles registration of core adapters and shared providers.
 */
export function registerInfrastructureModule(): void {
  // Database Core Adapter
  container.register(
    "DatabaseAdapter",
    () => new DatabaseCoreAdapter(),
    "singleton",
  );

  // Email Provider Adapter
  container.register(
    "EmailProvider",
    () => new NodemailerAdapter(),
    "singleton",
  );

  container.register(
    "GoogleOAuthAdapter",
    () => new GoogleOAuthAdapter(),
    "singleton",
  );
}

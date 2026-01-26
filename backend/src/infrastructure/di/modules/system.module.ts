import { container } from "../Container.js";
import { ChangelogService } from "../../../application/services/system/changelog/ChangelogService.js";
import { ChangelogHandler } from "../../../presentation/api/handlers/system/changelog.handler.js";

/**
 * System Module - وحدة النظام
 * Handles core platform features, changelogs, and monitoring.
 */
export function registerSystemModule(): void {
    // Services
    container.register(
        "ChangelogService",
        (c) => new ChangelogService(),
        "singleton",
    );

    // Handlers
    container.register(
        "ChangelogHandler",
        (c) => new ChangelogHandler(c.resolve("ChangelogService")),
        "singleton",
    );
}

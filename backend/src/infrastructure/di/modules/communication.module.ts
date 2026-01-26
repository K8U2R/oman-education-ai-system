import { container } from "../Container.js";
import { EmailService } from "../../../application/services/communication/index.js";
import { NotificationRepository } from "../../repositories/NotificationRepository.js";

/**
 * Communication Module - وحدة الاتصالات
 * Handles email dispatching and internal notifications.
 */
export function registerCommunicationModule(): void {
    // Services
    container.register(
        "EmailService",
        (c) => new EmailService(c.resolve("EmailProvider")),
        "singleton",
    );

    // Repositories
    container.register(
        "NotificationRepository",
        (c) => new NotificationRepository(c.resolve("DatabaseAdapter")),
        "transient",
    );
}

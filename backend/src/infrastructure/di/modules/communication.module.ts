import { container } from "../Container.js";
import { EmailService } from "../../../application/services/communication/index.js";
import { NotificationRepository } from "../../repositories/NotificationRepository.js";
import { NotificationService } from "@/modules/communication/index.js";
// import { logger } from "@/shared/utils/logger.js";

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

    container.register(
        "NotificationService",
        (_c) => new NotificationService(),
        "singleton"
    );

    // Repositories
    container.register(
        "NotificationRepository",
        (c) => new NotificationRepository(c.resolve("DatabaseAdapter")),
        "transient",
    );
}

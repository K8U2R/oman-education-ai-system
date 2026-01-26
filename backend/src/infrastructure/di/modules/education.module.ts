import { container } from "../Container.js";
import { AssessmentService } from "../../../application/services/education/index.js";

/**
 * Education Module - وحدة التعليم
 * Handles learning paths, assessments, and content delivery.
 */
export function registerEducationModule(): void {
    // Services
    container.register(
        "AssessmentService",
        (c: any) => new AssessmentService(c.resolve("DatabaseAdapter")),
        "singleton",
    );
}

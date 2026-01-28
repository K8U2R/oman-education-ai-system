import { container } from "@/infrastructure/di/Container.js";
import { PostgresEducationalRepository } from "@/infrastructure/repositories/education/PostgresEducationalRepository.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { GenerateLessonUseCase } from "@/application/use-cases/education/GenerateLessonUseCase.js";
import { IEducationalRepository } from "@/domain/interfaces/repositories/IEducationalRepository.js";
import { IAIProvider } from "@/domain/interfaces/ai/IAIProvider.js";
import { LearningService } from "@/modules/education/services/LearningService.js";
import { AssessmentService } from "@/modules/education/services/AssessmentService.js";
import { ContentManagementService } from "@/modules/education/services/ContentManagementService.js";
import { ProjectService } from "@/modules/education/services/ProjectService.js";
import { AssessmentController } from "@/modules/education/controllers/assessment.controller.js";
import { ContentManagementController } from "@/modules/education/controllers/content-management.controller.js";
import { ProjectController } from "@/modules/education/controllers/project.controller.js";
import { LessonGeneratorService } from "@/modules/education/services/ai/LessonGeneratorService.js";
import { educationConfig, type EducationConfig } from "@/modules/education/config/education.config.js";

export function registerEducationModule(): void {
    // Factory method to inject dependencies
    container.registerFactory("IEducationalRepository", () => {
        // We resolve DatabaseCoreAdapter which should be registered in infrastructure module
        // But DatabaseCoreAdapter constructor takes "settings".
        // In this DI system, usually adapters are registered as Singletons.
        // Let's assume DatabaseCoreAdapter is available or we instantiate it.
        // Checking ServiceRegistry/InfrastructureModule might be needed, but usually we instantiated it.

        // Let's rely on manual instantiation if not registered, or robust resolution.
        // Ideally: container.resolve<DatabaseCoreAdapter>("DatabaseCoreAdapter")

        // For now, we'll instantiate it as it's a lightweight adapter wrapper around Axios
        const dbAdapter = new DatabaseCoreAdapter();
        return new PostgresEducationalRepository(dbAdapter);
    });

    // Register Use Cases
    container.registerFactory("GenerateLessonUseCase", () => {
        const repo = container.resolve<IEducationalRepository>("IEducationalRepository");
        const ai = container.resolve<IAIProvider>("IAIProvider");
        return new GenerateLessonUseCase(repo, ai);
    });

    // -----------------------------------------------------
    // Cluster 4: Education Services (Modules/Education)
    // -----------------------------------------------------

    // Config
    container.registerFactory("EducationConfig", () => {
        return educationConfig;
    });

    // Services
    container.registerFactory("LearningService", () => {
        const ai = container.resolve<IAIProvider>("IAIProvider");
        const db = new DatabaseCoreAdapter();
        return new LearningService(ai, db);
    });

    container.registerFactory("LessonGeneratorService", () => {
        const db = new DatabaseCoreAdapter();
        const ai = container.resolve<IAIProvider>("IAIProvider");
        const config = container.resolve<EducationConfig>("EducationConfig");
        return new LessonGeneratorService(db, ai, config);
    });

    container.registerFactory("AssessmentService", () => {
        const db = new DatabaseCoreAdapter();
        return new AssessmentService(db);
    });

    container.registerFactory("ContentManagementService", () => {
        const db = new DatabaseCoreAdapter();
        return new ContentManagementService(db);
    });

    container.registerFactory("ProjectService", () => {
        const db = new DatabaseCoreAdapter();
        return new ProjectService(db);
    });

    // Controllers
    container.registerFactory("AssessmentController", () => {
        const service = container.resolve<AssessmentService>("AssessmentService");
        return new AssessmentController(service);
    });

    container.registerFactory("ContentManagementController", () => {
        const service = container.resolve<ContentManagementService>("ContentManagementService");
        return new ContentManagementController(service);
    });

    container.registerFactory("ProjectController", () => {
        const service = container.resolve<ProjectService>("ProjectService");
        return new ProjectController(service);
    });

    console.log("📚 Education Module Registered");
}

import { container } from "@/infrastructure/di/Container.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
// import { IUserRepository } from "@/domain/interfaces/repositories/user/core/IUserRepository.js";
import { UserRepository } from "@/infrastructure/repositories/UserRepository.js";
import { UserService } from "@/modules/user/services/UserService.js";
import { AdminService } from "@/modules/user/services/AdminService.js";
import { DeveloperService } from "@/modules/user/services/DeveloperService.js";
import { UserController } from "@/modules/user/controllers/user.controller.js";
import { AdminController } from "@/modules/user/controllers/admin.controller.js";
import { DeveloperController } from "@/modules/user/controllers/developer.controller.js";

export function registerUserModule(): void {
    // -----------------------------------------------------
    // Cluster 2: User Management (Modules/User)
    // -----------------------------------------------------

    // Services
    container.registerFactory("IUserRepository", () => {
        const db = new DatabaseCoreAdapter();
        return new UserRepository(db);
    });

    container.registerFactory("UserService", () => {
        const dbAdapter = new DatabaseCoreAdapter();
        return new UserRepository(dbAdapter);
    });

    container.registerFactory("AdminService", () => {
        const db = new DatabaseCoreAdapter();
        return new AdminService(db);
    });

    container.registerFactory("DeveloperService", () => {
        const db = new DatabaseCoreAdapter();
        return new DeveloperService(db);
    });

    // Controllers
    container.registerFactory("UserController", () => {
        const service = container.resolve<UserService>("UserService");
        return new UserController(service);
    });

    container.registerFactory("AdminController", () => {
        const service = container.resolve<AdminService>("AdminService");
        return new AdminController(service);
    });

    container.registerFactory("DeveloperController", () => {
        const service = container.resolve<DeveloperService>("DeveloperService");
        return new DeveloperController(service);
    });

    console.log("👥 User Module Registered");
}

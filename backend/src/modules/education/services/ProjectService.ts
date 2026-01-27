import { EnhancedBaseService } from "@/application/services/system/base/EnhancedBaseService.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import { CreateProjectDTO, UpdateProjectDTO } from "../dto/project.dto.js";

export class ProjectService extends EnhancedBaseService {
    constructor(databaseAdapter: DatabaseCoreAdapter) {
        super(databaseAdapter);
    }

    protected getServiceName(): string {
        return "ProjectService";
    }

    async createProject(data: CreateProjectDTO): Promise<any> {
        return { id: "new-project", ...data };
    }

    async getProjects(_filters: { created_by?: string }): Promise<{ projects: any[] }> {
        return { projects: [] };
    }

    async getProject(id: string): Promise<any> {
        return { id, title: "Placeholder Project", created_by: "system" };
    }

    async updateProject(_id: string, data: UpdateProjectDTO, _userId: string): Promise<any> {
        return { updated: true, ...data };
    }

    async deleteProject(_id: string, _userId: string): Promise<void> {
        return;
    }

    async getProjectProgress(_id: string): Promise<any> {
        return { progress: 0 };
    }
}

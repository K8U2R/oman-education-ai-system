import { EnhancedBaseService } from "@/application/services/system/base/EnhancedBaseService.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import { IUserRepository } from "@/domain/interfaces/repositories/user/core/IUserRepository.js";
import { UpdateProfileDTO } from "../dto/user.dto.js";

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  role: string;
}

export class UserService extends EnhancedBaseService {
  constructor(
    private readonly userRepo: IUserRepository,
    databaseAdapter: DatabaseCoreAdapter,
  ) {
    super(databaseAdapter);
  }

  protected getServiceName(): string {
    return "UserService";
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    return this.executeWithEnhancements(
      async () => {
        const user = await this.userRepo.findById(userId);
        if (!user) return null;

        return {
          id: user.id.toString(), // Ensure ID is string
          email: user.email as any,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: user.role,
        };
      },
      { performanceTracking: true },
      { operation: "getProfile" },
    );
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileDTO,
  ): Promise<UserProfile | null> {
    return this.executeWithEnhancements(
      async () => {
        const updated = await this.userRepo.update(userId, data);
        if (!updated) return null;

        return {
          id: updated.id.toString(),
          email: updated.email as any,
          firstName: updated.firstName,
          lastName: updated.lastName,
          username: updated.username,
          avatarUrl: updated.avatarUrl,
          role: updated.role,
        };
      },
      { performanceTracking: true },
      { operation: "updateProfile" },
    );
  }

  async listUsers(
    limit: number = 50,
    offset: number = 0,
  ): Promise<{ users: UserProfile[]; total: number }> {
    return this.executeWithEnhancements(
      async () => {
        const users = await this.userRepo.findAll(limit, offset);
        const total = await this.userRepo.count();

        const profiles = users.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: user.role,
        }));

        return { users: profiles, total };
      },
      { performanceTracking: true },
      { operation: "listUsers" },
    );
  }

  async banUser(userId: string): Promise<void> {
    return this.executeWithEnhancements(
      async () => {
        await this.userRepo.updateStatus(userId, "banned");
      },
      { performanceTracking: true },
      { operation: "banUser" },
    );
  }

  async searchUsers(query: string): Promise<UserProfile[]> {
    return this.executeWithEnhancements(
      async () => {
        const users = await this.userRepo.search(query);
        return users.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: user.role,
        }));
      },
      { performanceTracking: true },
      { operation: "searchUsers" },
    );
  }
}

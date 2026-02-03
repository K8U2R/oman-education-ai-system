import { IWhitelistRepository } from "@/domain/interfaces/repositories/auth/access/IWhitelistRepository.js";
import { WhitelistEntryDto, WhitelistFilter } from "@/domain/types/auth/index.js";
import { AppError } from "@/core/errors/AppError.js";
import { ValidationUtils } from "@/shared/utils/ValidationUtils.js";
import { logger } from "@/shared/utils/logger.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { EnhancedBaseService } from "@/application/services/system/base/EnhancedBaseService.js";

export class WhitelistService extends EnhancedBaseService {
    constructor(
        private readonly whitelistRepository: IWhitelistRepository,
        databaseAdapter: DatabaseCoreAdapter
    ) {
        super(databaseAdapter);
    }

    protected getServiceName(): string {
        return "WhitelistService";
    }

    async getAllEntries(filter: WhitelistFilter): Promise<WhitelistEntryDto[]> {
        return this.executeWithEnhancements(
            async () => {
                logger.debug("Fetching whitelist entries", { filter });
                const entries = await this.whitelistRepository.findAll({
                    isActive: filter.is_active,
                    permissionLevel: filter.permission_level,
                    includeExpired: filter.include_expired
                });
                return entries.map(e => e.toData());
            },
            { retryable: true },
            { operation: "getAllEntries" }
        );
    }

    async findById(id: string): Promise<WhitelistEntryDto | null> {
        return this.executeWithEnhancements(
            async () => {
                if (!id) throw new AppError("ID is required", "MISSING_ID", 400);
                const entry = await this.whitelistRepository.findById(id);
                return entry ? entry.toData() : null;
            },
            { retryable: true },
            { operation: "findById", metadata: { id } }
        );
    }

    /**
     * التحقق من حالة القائمة البيضاء
     */
    async checkStatus(email: string): Promise<{ allowed: boolean }> {
        return this.executeWithEnhancements(
            async () => {
                const cleanEmail = email.trim().toLowerCase();

                if (!ValidationUtils.isValidEmail(cleanEmail)) {
                    throw new AppError("Invalid email format", "INVALID_EMAIL", 400);
                }

                const entry = await this.whitelistRepository.findByEmail(cleanEmail);

                if (!entry) {
                    logger.info("Whitelist check failed: Email not found", { email: cleanEmail });
                    return { allowed: false };
                }

                if (!entry.isActive()) {
                    logger.info("Whitelist check failed: Entry inactive", { email: cleanEmail });
                    return { allowed: false };
                }

                if (entry.isExpired()) {
                    logger.info("Whitelist check failed: Entry expired", { email: cleanEmail });
                    return { allowed: false };
                }

                logger.info("Whitelist check passed", { email: cleanEmail, level: entry.getPermissionLevel().getValue() });
                return { allowed: true };
            },
            { retryable: true },
            { operation: "checkStatus", metadata: { email } }
        );
    }

    async getEntry(id: string): Promise<WhitelistEntryDto> {
        return this.executeWithEnhancements(
            async () => {
                if (!id) throw new AppError("ID is required", "MISSING_ID", 400);
                const entry = await this.whitelistRepository.findById(id);
                if (!entry) throw new AppError("Whitelist entry not found", "NOT_FOUND", 404);
                return entry.toData();
            },
            { retryable: true },
            { operation: "getEntry", metadata: { id } }
        );
    }

    async createEntry(data: any): Promise<WhitelistEntryDto> {
        return this.executeWithEnhancements(
            async () => {
                if (!ValidationUtils.isValidEmail(data.email)) {
                    throw new AppError("Invalid email format", "INVALID_EMAIL", 400);
                }

                logger.info("Creating whitelist entry", { email: data.email });
                const entry = await this.whitelistRepository.create(data);
                return entry.toData();
            },
            { retryable: false },
            { operation: "createEntry", metadata: { email: data.email } }
        );
    }

    async updateEntry(id: string, data: any): Promise<WhitelistEntryDto> {
        return this.executeWithEnhancements(
            async () => {
                if (!id) throw new AppError("ID is required", "MISSING_ID", 400);
                const entry = await this.whitelistRepository.update(id, data);
                return entry.toData();
            },
            { retryable: false },
            { operation: "updateEntry", metadata: { id } }
        );
    }

    async deleteEntry(id: string): Promise<void> {
        return this.executeWithEnhancements(
            async () => {
                if (!id) throw new AppError("ID is required", "MISSING_ID", 400);
                logger.info("Deleting whitelist entry", { id });
                await this.whitelistRepository.delete(id);
            },
            { retryable: false },
            { operation: "deleteEntry", metadata: { id } }
        );
    }

    async deactivateEntry(id: string): Promise<WhitelistEntryDto> {
        return this.executeWithEnhancements(
            async () => {
                if (!id) throw new AppError("ID is required", "MISSING_ID", 400);
                const entry = await this.whitelistRepository.update(id, { is_active: false });
                return entry.toData();
            },
            { retryable: false },
            { operation: "deactivateEntry", metadata: { id } }
        );
    }

    async activateEntry(id: string): Promise<WhitelistEntryDto> {
        return this.executeWithEnhancements(
            async () => {
                if (!id) throw new AppError("ID is required", "MISSING_ID", 400);
                const entry = await this.whitelistRepository.update(id, { is_active: true });
                return entry.toData();
            },
            { retryable: false },
            { operation: "activateEntry", metadata: { id } }
        );
    }

    async findExpiredEntries(): Promise<WhitelistEntryDto[]> {
        return this.executeWithEnhancements(
            async () => {
                const entries = await this.whitelistRepository.findExpired();
                return entries.map(e => e.toData());
            },
            { retryable: true },
            { operation: "findExpiredEntries" }
        );
    }
}

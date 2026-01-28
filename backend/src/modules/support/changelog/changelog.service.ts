import type { PrismaClient } from "@prisma/client";
import { BaseService } from "@/application/services/system/base/BaseService.js";
import { CreateChangelogDto } from "@/presentation/api/dto/system/changelog/create-changelog.dto.js";
import { ChangelogResponseDto } from "@/presentation/api/dto/system/changelog/changelog-response.dto.js";

/**
 * Changelog Service - خدمة سجل التغييرات
 * 
 * Handles business logic for system updates and user feedback.
 * Constitutional Authority: Law-3 (Cluster Sovereignty) & Law-10 (Documentation)
 */
// Defined locally to strict type the loose usages
type DbChangelogEntry = {
    id: string;
    version: string;
    title: string;
    slug: string;
    summary: string | null;
    content_html: string;
    category: string;
    status: string;
    is_for_students: boolean;
    is_for_teachers: boolean;
    is_for_developers: boolean;
    published_at: Date | null;
    created_at: Date;
    users: {
        id: string;
        first_name: string | null;
        last_name: string | null;
    } | null;
    changelog_feedback: Array<{
        id: string;
        created_at: Date;
        user_id: string | null;
        entry_id: string;
        reaction_type: string | null;
        comment_text: string | null;
    }> | null;
};

export class ChangelogService extends BaseService {
    // Law 01 (Iron Wall) & Law 02 (Strict Typing): Injected dependency, no internal instantiation.
    constructor(private readonly prisma: PrismaClient) {
        super();
    }

    protected getServiceName(): string {
        return "ChangelogService";
    }

    /**
     * جلب سجل التغييرات العام
     */
    async getChangelogFeed(filters: {
        category?: string;
        status?: string;
        is_for_students?: boolean;
        is_for_teachers?: boolean;
        is_for_developers?: boolean;
    }): Promise<ChangelogResponseDto[]> {
        return this.execute(async () => {
            const entries = await this.prisma.changelog_entries.findMany({
                where: {
                    status: (filters.status as any) || "published",
                    ...(filters.category && { category: filters.category as any }),
                    ...(filters.is_for_students !== undefined && { is_for_students: filters.is_for_students }),
                    ...(filters.is_for_teachers !== undefined && { is_for_teachers: filters.is_for_teachers }),
                    ...(filters.is_for_developers !== undefined && { is_for_developers: filters.is_for_developers }),
                },
                orderBy: {
                    published_at: "desc",
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                        },
                    },
                    changelog_feedback: true,
                },
            });

            return entries.map((entry: DbChangelogEntry) => this.mapToDto(entry));
        }, "getChangelogFeed");
    }

    /**
     * إنشاء إدخال جديد (للمشرفين فقط)
     */
    async createEntry(data: CreateChangelogDto, authorId: string): Promise<ChangelogResponseDto> {
        return this.execute(async () => {
            const entry = await this.prisma.changelog_entries.create({
                data: {
                    ...data,
                    category: data.category,
                    status: data.status,
                    author_id: authorId,
                    published_at: data.status === "published" ? new Date() : (data.published_at ? new Date(data.published_at) : null),
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                        },
                    },
                    changelog_feedback: true,
                },
            });

            return this.mapToDto(entry);
        }, "createEntry");
    }

    /**
     * Alias for getChangelogFeed to match Controller expectation
     */
    async getAll(filters: any = {}): Promise<ChangelogResponseDto[]> {
        return this.getChangelogFeed(filters);
    }

    /**
     * Alias for createEntry to match Controller expectation
     */
    async create(data: CreateChangelogDto, authorId: string = "system"): Promise<ChangelogResponseDto> {
        return this.createEntry(data, authorId);
    }

    /**
     * Helper to execute and wrap logic in base service error handling
     */
    private async execute<T>(operation: () => Promise<T>, name: string): Promise<T> {
        try {
            this.logOperation(name);
            return await operation();
        } catch (error) {
            return this.handleServiceError(error, name);
        }
    }

    /**
     * Maps Prisma entity to DTO to prevent internal leak (Law-4)
     */
    private mapToDto(entry: DbChangelogEntry): ChangelogResponseDto {
        return {
            id: entry.id,
            version: entry.version,
            title: entry.title,
            slug: entry.slug,
            summary: entry.summary || "",
            content_html: entry.content_html,
            category: entry.category,
            status: entry.status,
            is_for_students: entry.is_for_students,
            is_for_teachers: entry.is_for_teachers,
            is_for_developers: entry.is_for_developers,
            published_at: entry.published_at,
            created_at: entry.created_at,
            author: entry.users ? {
                id: entry.users.id,
                name: `${entry.users.first_name || ""} ${entry.users.last_name || ""}`.trim() || "System",
            } : null,
            feedback_stats: entry.changelog_feedback ? {
                reactions: this.summarizeReactions(entry.changelog_feedback),
                total_comments: entry.changelog_feedback.length,
            } : undefined,
        };
    }

    private summarizeReactions(feedback: Array<{ reaction_type: string | null }> | null): Record<string, number> {
        if (!feedback) return {};
        return feedback.reduce((acc: Record<string, number>, curr) => {
            if (curr.reaction_type) {
                acc[curr.reaction_type] = (acc[curr.reaction_type] || 0) + 1;
            }
            return acc;
        }, {});
    }
}

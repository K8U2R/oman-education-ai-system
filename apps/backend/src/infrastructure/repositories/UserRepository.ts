/**
 * User Repository - مستودع المستخدم
 * 
 * @law Law-2 (Isolation) - Data Persistence Layer
 * @law Law-10 (Scalability) - Domain Persistence Implementation
 */

import { IUserRepository } from "@/domain/interfaces/repositories/user/core/IUserRepository.js";
import { User } from "../../domain/entities/User.js";
import { UserData } from "../../domain/types/auth/auth.types.js";
import { BaseRepository } from "./BaseRepository.js";
import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter.js";

export class UserRepository extends BaseRepository implements IUserRepository {
    constructor(databaseAdapter: DatabaseCoreAdapter) {
        super(databaseAdapter);
    }

    protected getRepositoryName(): string {
        return "UserRepository";
    }

    /**
     * البحث عن مستخدم بالمعرف
     */
    async findById(id: string): Promise<User | null> {
        return this.executeWithErrorHandling(
            async () => {
                const userData = await this.findOne<UserData>("users", { id });
                return userData ? User.fromData(userData) : null;
            },
            "findById",
            { id }
        );
    }

    /**
     * جلب جميع المستخدمين مع دعم التصفح
     */
    async findAll(limit = 20, offset = 0): Promise<User[]> {
        return this.executeWithErrorHandling(
            async () => {
                const usersData = await this.databaseAdapter.find<UserData>(
                    "users",
                    {},
                    { limit, offset }
                );
                return usersData.map(User.fromData);
            },
            "findAll",
            { limit, offset }
        );
    }

    /**
     * البحث عن مستخدمين (البحث البسيط حالياً)
     */
    async search(query: string): Promise<User[]> {
        return this.executeWithErrorHandling(
            async () => {
                // البحث البسيط باستخدام البريد الإلكتروني أو اسم المستخدم كبداية
                // ملاحظة: قد يحتاج المحول الأساسي (DatabaseCoreAdapter) إلى دعم للبحث المتقدم
                const usersData = await this.databaseAdapter.find<UserData>("users", {
                    $or: [
                        { email: { $ilike: `%${query}%` } },
                        { username: { $ilike: `%${query}%` } },
                        { first_name: { $ilike: `%${query}%` } },
                        { last_name: { $ilike: `%${query}%` } }
                    ]
                });
                return usersData.map(User.fromData);
            },
            "search",
            { query }
        );
    }

    /**
     * تحديث بيانات المستخدم
     */
    async update(id: string, data: Partial<User>): Promise<User> {
        return this.executeWithErrorHandling(
            async () => {
                // تحويل الحقول من camelCase إلى snake_case للتوافق مع قاعدة البيانات
                const updatePayload: Record<string, unknown> = {
                    updated_at: new Date().toISOString()
                };

                if (data.firstName !== undefined) updatePayload.first_name = data.firstName;
                if (data.lastName !== undefined) updatePayload.last_name = data.lastName;
                if (data.username !== undefined) updatePayload.username = data.username;
                if (data.avatarUrl !== undefined) updatePayload.avatar_url = data.avatarUrl;
                if (data.isActive !== undefined) updatePayload.is_active = data.isActive;
                if (data.isVerified !== undefined) updatePayload.is_verified = data.isVerified;
                if (data.role !== undefined) updatePayload.role = data.role;

                const updated = await this.modify<UserData>("users", { id }, updatePayload);
                return User.fromData(updated);
            },
            "update",
            { id, data }
        );
    }

    /**
     * تحديث حالة المستخدم
     */
    async updateStatus(id: string, status: "active" | "banned" | "suspended"): Promise<void> {
        return this.executeWithErrorHandling(
            async () => {
                const isActive = status === "active";
                await this.modify<UserData>("users", { id }, {
                    is_active: isActive,
                    updated_at: new Date().toISOString()
                });
            },
            "updateStatus",
            { id, status }
        );
    }

    /**
     * حساب إجمالي المستخدمين
     */
    async count(): Promise<number> {
        return this.executeWithErrorHandling(
            async () => {
                return await this.databaseAdapter.count("users", {});
            },
            "count"
        );
    }
}

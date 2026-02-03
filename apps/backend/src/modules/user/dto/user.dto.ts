import { z } from "zod";

/**
 * Update Profile DTO
 */
export const UpdateProfileRequestSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().optional(),
    avatarUrl: z.string().url().optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileRequestSchema>;

/**
 * Search Users DTO
 */
export const SearchUsersRequestSchema = z.object({
    query: z.string().min(1, "Query is required"),
});

export type SearchUsersDTO = z.infer<typeof SearchUsersRequestSchema>;

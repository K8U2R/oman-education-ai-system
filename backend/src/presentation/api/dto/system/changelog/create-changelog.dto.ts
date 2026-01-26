import { z } from "zod";

/**
 * Validates the creation of a new changelog entry.
 * Constitutional Authority: Law-5 (Anti-Hallucination Protocol)
 */
export const CreateChangelogSchema = z.object({
    version: z.string().min(1, "الإصدار مطلوب").max(50),
    title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
    slug: z.string().min(3, "الرابط المختصر مطلوب"),
    content_html: z.string().min(10, "المحتوى مطلوب"),
    category: z.enum(["new", "improved", "fixed", "breaking", "internal"]),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    is_for_students: z.boolean().default(true),
    is_for_teachers: z.boolean().default(false),
    is_for_developers: z.boolean().default(false),
    published_at: z.string().optional().nullable(),
});

export type CreateChangelogDto = z.infer<typeof CreateChangelogSchema>;

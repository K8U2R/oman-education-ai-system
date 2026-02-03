import { LessonStatus, AIMetadata } from "@/domain/types/education-types.js";

/**
 * Educational Lesson Entity - الدرس التعليمي
 * 
 * The atomic unit of learning content.
 * Can be AI-generated or manually written.
 */
export class EducationalLesson {
    constructor(
        public id: string,
        public unitId: string,
        public title: string,
        public orderIndex: number,
        public content: string,
        public status: LessonStatus,
        public aiMetadata: AIMetadata | null,
        public createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(
        id: string,
        unitId: string,
        title: string,
        orderIndex: number
    ): EducationalLesson {
        const now = new Date();
        return new EducationalLesson(
            id,
            unitId,
            title,
            orderIndex,
            "", // Empty content initially
            LessonStatus.DRAFT,
            null,
            now,
            now
        );
    }

    public updateContent(content: string): void {
        this.content = content;
        this.updatedAt = new Date();
    }

    public setAIContent(content: string, metadata: AIMetadata): void {
        this.content = content;
        this.aiMetadata = metadata;
        this.status = LessonStatus.REVIEW_REQUIRED; // AI content needs review
        this.updatedAt = new Date();
    }

    public publish(): void {
        if (this.content.length < 10) {
            throw new Error("Cannot publish empty lesson");
        }
        this.status = LessonStatus.PUBLISHED;
        this.updatedAt = new Date();
    }
}

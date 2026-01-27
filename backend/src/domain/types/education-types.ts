/**
 * Education Types - تعريفات الأنواع التعليمية
 * 
 * Enums and Types for the Education Module.
 */

export enum LessonStatus {
    DRAFT = 'DRAFT',
    GENERATING_AI = 'GENERATING_AI',
    REVIEW_REQUIRED = 'REVIEW_REQUIRED',
    PUBLISHED = 'PUBLISHED'
}

export enum EducationLevel {
    GRADE_1 = 'GRADE_1',
    GRADE_2 = 'GRADE_2',
    GRADE_3 = 'GRADE_3',
    GRADE_4 = 'GRADE_4',
    GRADE_5 = 'GRADE_5',
    GRADE_6 = 'GRADE_6',
    GRADE_7 = 'GRADE_7',
    GRADE_8 = 'GRADE_8',
    GRADE_9 = 'GRADE_9',
    GRADE_10 = 'GRADE_10',
    GRADE_11 = 'GRADE_11',
    GRADE_12 = 'GRADE_12'
}

export interface AIMetadata {
    model: string;
    promptUsed: string;
    tokensConsumed: number;
    generatedAt: Date;
    version: string;
}

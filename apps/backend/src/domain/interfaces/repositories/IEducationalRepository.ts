import { EducationalTrack } from "@/domain/entities/education/EducationalTrack.js";
import { EducationalUnit } from "@/domain/entities/education/EducationalUnit.js";
import { EducationalLesson } from "@/domain/entities/education/EducationalLesson.js";
import { AIMetadata } from "@/domain/types/education-types.js";

/**
 * IEducationalRepository - عقد تخزين البيانات التعليمية
 * 
 * Defines the contract for enforcing Law 04 (Persistence Ignorance).
 * The domain layer doesn't care if we use SQL, Mongo, or Files.
 */
export interface IEducationalRepository {
    // Track Management
    createTrack(track: EducationalTrack): Promise<EducationalTrack>;
    getTrackById(trackId: string): Promise<EducationalTrack | null>;
    getTrackStructure(trackId: string): Promise<EducationalTrack | null>; // Deep load

    // Unit Management
    addUnit(unit: EducationalUnit): Promise<EducationalUnit>;
    getUnitsByTrackId(trackId: string): Promise<EducationalUnit[]>;

    // Lesson Management
    addLesson(lesson: EducationalLesson): Promise<EducationalLesson>;
    getLessonById(lessonId: string): Promise<EducationalLesson | null>;

    /**
     * Updates only the content and AI metadata of a lesson
     */
    updateLessonContent(
        lessonId: string,
        content: string,
        aiMetadata: AIMetadata | null
    ): Promise<void>;

    /**
     * Updates lesson status (e.g., PUBLISHED)
     */
    updateLessonStatus(
        lessonId: string,
        status: string
    ): Promise<void>;
}

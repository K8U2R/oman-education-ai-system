import { IEducationalRepository } from "@/domain/interfaces/repositories/IEducationalRepository.js";
import { EducationalTrack } from "@/domain/entities/education/EducationalTrack.js";
import { EducationalUnit } from "@/domain/entities/education/EducationalUnit.js";
import { EducationalLesson } from "@/domain/entities/education/EducationalLesson.js";
import { AIMetadata, EducationLevel, LessonStatus } from "@/domain/types/education-types.js";
import { BaseRepository } from "@/infrastructure/repositories/BaseRepository.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";

// DB Row Typings
interface TrackRow {
    id: string;
    teacher_id: string;
    title: string;
    description: string;
    level: string;
    subject: string;
    created_at: string;
    updated_at: string;
}

interface UnitRow {
    id: string;
    track_id: string;
    title: string;
    order_index: number;
    topics: string[];
    created_at: string;
    updated_at: string;
}

interface LessonRow {
    id: string;
    unit_id: string;
    title: string;
    order_index: number;
    content: string;
    status: string;
    ai_metadata: unknown;
    created_at: string;
    updated_at: string;
}

export class PostgresEducationalRepository
    extends BaseRepository
    implements IEducationalRepository {
    constructor(databaseAdapter: DatabaseCoreAdapter) {
        super(databaseAdapter);
    }

    protected getRepositoryName(): string {
        return "PostgresEducationalRepository";
    }

    // --- Mappers ---

    private mapTrackToDomain(row: TrackRow): EducationalTrack {
        return new EducationalTrack(
            row.id,
            row.title,
            row.description,
            row.level as EducationLevel,
            row.subject,
            row.teacher_id,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }

    private mapUnitToDomain(row: UnitRow): EducationalUnit {
        return new EducationalUnit(
            row.id,
            row.track_id,
            row.title,
            row.order_index,
            row.topics || [],
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }

    private mapLessonToDomain(row: LessonRow): EducationalLesson {
        return new EducationalLesson(
            row.id,
            row.unit_id,
            row.title,
            row.order_index,
            row.content || "",
            row.status as LessonStatus,
            row.ai_metadata as AIMetadata,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }

    // --- Implementation ---

    async createTrack(track: EducationalTrack): Promise<EducationalTrack> {
        const payload = {
            id: track.id,
            teacher_id: track.teacherId,
            title: track.title,
            description: track.description,
            level: track.level,
            subject: track.subject,
            created_at: track.createdAt.toISOString(),
            updated_at: track.updatedAt.toISOString()
        };

        const result = await this.insert<TrackRow>('educational_tracks', payload);
        return this.mapTrackToDomain(result);
    }

    async getTrackById(trackId: string): Promise<EducationalTrack | null> {
        const result = await this.findOne<TrackRow>('educational_tracks', { id: trackId });
        if (!result) return null;
        return this.mapTrackToDomain(result);
    }

    async getTrackStructure(trackId: string): Promise<EducationalTrack | null> {
        // Since we don't have Join capability in the core adapter yet,
        // we will implement a "Shallow Load" for now, or fetch children if needed.
        // The interface defines returning the Track. 
        // If the domain 'EducationalTrack' object was Aggregate Root containing units, we would load them.
        // But currently EducationalTrack class does NOT have 'units' array in its definition (Check Entity).
        // It's a flat entity. So we just return the track.

        // Wait, Use Case might expect navigating. But based on `EducationalTrack.ts` defined in previous step,
        // it only has basic fields.

        return this.getTrackById(trackId);
    }

    async addUnit(unit: EducationalUnit): Promise<EducationalUnit> {
        const payload = {
            id: unit.id,
            track_id: unit.trackId,
            title: unit.title,
            order_index: unit.orderIndex,
            topics: unit.topics,
            created_at: unit.createdAt.toISOString(),
            updated_at: unit.updatedAt.toISOString()
        };

        const result = await this.insert<UnitRow>('educational_units', payload);
        return this.mapUnitToDomain(result);
    }

    async getUnitsByTrackId(trackId: string): Promise<EducationalUnit[]> {
        const results = await this.findMany<UnitRow>('educational_units', { track_id: trackId });
        return results.map(row => this.mapUnitToDomain(row));
    }

    async addLesson(lesson: EducationalLesson): Promise<EducationalLesson> {
        const payload = {
            id: lesson.id,
            unit_id: lesson.unitId,
            title: lesson.title,
            order_index: lesson.orderIndex,
            content: lesson.content,
            status: lesson.status,
            ai_metadata: lesson.aiMetadata,
            created_at: lesson.createdAt.toISOString(),
            updated_at: lesson.updatedAt.toISOString()
        };

        const result = await this.insert<LessonRow>('educational_lessons', payload);
        return this.mapLessonToDomain(result);
    }

    async getLessonById(lessonId: string): Promise<EducationalLesson | null> {
        const result = await this.findOne<LessonRow>('educational_lessons', { id: lessonId });
        if (!result) return null;
        return this.mapLessonToDomain(result);
    }

    async updateLessonContent(lessonId: string, content: string, aiMetadata: AIMetadata | null): Promise<void> {
        await this.modify(
            'educational_lessons',
            { id: lessonId },
            {
                content,
                ai_metadata: aiMetadata,
                updated_at: new Date().toISOString()
            }
        );
    }

    async updateLessonStatus(lessonId: string, status: string): Promise<void> {
        await this.modify(
            'educational_lessons',
            { id: lessonId },
            {
                status,
                updated_at: new Date().toISOString()
            }
        );
    }
}

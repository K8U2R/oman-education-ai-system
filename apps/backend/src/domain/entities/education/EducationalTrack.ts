import { EducationLevel } from "@/domain/types/education-types.js";

/**
 * Educational Track Entity - المسار التعليمي
 *
 * Represents a complete course or curriculum track (e.g., "Grade 10 Mathematics").
 * The Root of the educational hierarchy.
 */
export class EducationalTrack {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public level: EducationLevel,
    public subject: string,
    public teacherId: string, // Owner
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Factory method to create a new Track
   */
  static create(
    id: string,
    title: string,
    description: string,
    level: EducationLevel,
    subject: string,
    teacherId: string,
  ): EducationalTrack {
    const now = new Date();
    return new EducationalTrack(
      id,
      title,
      description,
      level,
      subject,
      teacherId,
      now,
      now,
    );
  }
}

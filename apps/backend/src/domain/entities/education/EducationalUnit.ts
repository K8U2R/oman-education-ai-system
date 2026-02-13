/**
 * Educational Unit Entity - الوحدة التعليمية
 *
 * Represents a chapter or module within a Track.
 * Contains multiple Lessons.
 */
export class EducationalUnit {
  constructor(
    public id: string,
    public trackId: string,
    public title: string,
    public orderIndex: number,
    public topics: string[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    id: string,
    trackId: string,
    title: string,
    orderIndex: number,
    topics: string[] = [],
  ): EducationalUnit {
    const now = new Date();
    return new EducationalUnit(
      id,
      trackId,
      title,
      orderIndex,
      topics,
      now,
      now,
    );
  }
}

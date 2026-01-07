/**
 * Lesson Entity - كيان الدرس
 *
 * Domain Entity يمثل الدرس في النظام
 */

import { Lesson as LessonData } from '../types/lesson.types'

export class Lesson {
  constructor(
    public readonly id: string,
    public readonly subjectId: string,
    public readonly gradeLevelId: string,
    public readonly title: string,
    public readonly content?: string,
    public readonly order: number = 0,
    public readonly difficultyLevel?: string,
    public readonly tags?: string[],
    public readonly isPublished: boolean = false
  ) {}

  /**
   * التحقق من أن الدرس منشور
   */
  get isAvailable(): boolean {
    return this.isPublished
  }

  /**
   * التحقق من أن الدرس يحتوي على محتوى
   */
  hasContent(): boolean {
    return !!this.content && this.content.length > 0
  }

  /**
   * التحقق من أن الدرس يحتوي على tags معينة
   */
  hasTag(tag: string): boolean {
    return this.tags?.includes(tag) ?? false
  }

  /**
   * إنشاء Lesson من LessonData
   */
  static fromData(data: LessonData): Lesson {
    return new Lesson(
      data.id,
      data.subject_id,
      data.grade_level_id,
      data.title,
      data.content,
      data.order,
      data.difficulty_level,
      data.tags,
      data.is_published ?? false
    )
  }

  /**
   * تحويل Lesson إلى LessonData
   */
  toData(): LessonData {
    return {
      id: this.id,
      subject_id: this.subjectId,
      grade_level_id: this.gradeLevelId,
      title: this.title,
      content: this.content,
      order: this.order,
      difficulty_level: this.difficultyLevel,
      tags: this.tags,
      is_published: this.isPublished,
    }
  }
}

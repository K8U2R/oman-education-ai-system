/**
 * ILessonRepository - واجهة مستودع الدروس
 *
 * Domain Interface لمستودع الدروس
 */

import { Lesson } from '../../entities/Lesson'
import {
  LessonExplanation,
  LessonExamples,
  LessonVideos,
  LessonMindMap,
} from '../../types/lesson.types'

export interface ILessonRepository {
  /**
   * الحصول على جميع الدروس
   */
  getLessons(subjectId?: string, gradeLevelId?: string): Promise<Lesson[]>

  /**
   * الحصول على درس محدد
   */
  getLesson(lessonId: string): Promise<Lesson>

  /**
   * الحصول على شرح الدرس
   */
  getLessonExplanation(
    lessonId: string,
    language?: string,
    style?: string
  ): Promise<LessonExplanation>

  /**
   * الحصول على أمثلة الدرس
   */
  getLessonExamples(
    lessonId: string,
    count?: number,
    difficulty?: string,
    language?: string
  ): Promise<LessonExamples>

  /**
   * الحصول على فيديوهات الدرس
   */
  getLessonVideos(lessonId: string, platform?: string, maxResults?: number): Promise<LessonVideos>

  /**
   * الحصول على خريطة ذهنية للدرس
   */
  getLessonMindMap(lessonId: string, format?: string, language?: string): Promise<LessonMindMap>
}

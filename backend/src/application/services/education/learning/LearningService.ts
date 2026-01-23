/**
 * Learning Service - خدمة التعلم
 *
 * Application Service لمساعد التعلم مع تكامل AI
 *
 * @example
 * ```typescript
 * const service = new LearningService(aiProvider, databaseAdapter)
 * const explanation = await service.getLessonExplanation('lesson-123', 'ar', 'simple')
 * ```
 */

import type { IAIProvider } from "@/domain";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import { logger } from "@/shared/utils/logger";
import {
  LearningLesson,
  LessonExplanation,
  LessonExample,
  LessonExamples,
  LessonVideos,
  LessonMindMap,
  MindMapNode,
  MindMapEdge,
} from "@/domain/types";
import { EnhancedBaseService } from "../base/EnhancedBaseService";

export class LearningService extends EnhancedBaseService {
  /**
   * إنشاء Learning Service
   *
   * @param aiProvider - AI Provider (OpenAI/Anthropic)
   * @param databaseAdapter - Database Core Adapter
   */
  constructor(
    private readonly aiProvider: IAIProvider,
    databaseAdapter: DatabaseCoreAdapter,
  ) {
    super(databaseAdapter);
  }

  /**
   * Get service name
   */
  protected getServiceName(): string {
    return "LearningService";
  }

  /**
   * الحصول على شرح الدرس باستخدام AI
   *
   * @param lessonId - معرف الدرس
   * @param language - اللغة (ar/en)
   * @param style - نمط الشرح (simple/detailed/interactive)
   * @returns LessonExplanation
   */
  async getLessonExplanation(
    lessonId: string,
    language: string = "ar",
    style: string = "simple",
  ): Promise<LessonExplanation> {
    return this.executeWithEnhancements(
      async () => {
        // جلب الدرس من قاعدة البيانات
        const lesson = await this.databaseAdapter.findOne<LearningLesson>(
          "lessons",
          { id: lessonId },
        );

        if (!lesson) {
          throw new Error(`الدرس غير موجود: ${lessonId}`);
        }

        // بناء System Prompt حسب النمط
        const stylePrompts: Record<string, string> = {
          simple: "اشرح بطريقة بسيطة ومباشرة، استخدم أمثلة واضحة",
          detailed: "قدم شرحاً مفصلاً وشاملاً مع أمثلة متعددة وتطبيقات عملية",
          interactive:
            "قدم شرحاً تفاعلياً مع أسئلة وأجوبة، شجع على التفكير النقدي",
        };

        const systemPrompt = `أنت مساعد تعليمي ذكي. مهمتك شرح الدروس بطريقة تعليمية فعالة.
${stylePrompts[style] || stylePrompts.simple}
اللغة المطلوبة: ${language === "ar" ? "العربية" : "English"}
كن واضحاً، منسقاً، ومشجعاً للطلاب.`;

        const userPrompt = `اشرح الدرس التالي:
العنوان: ${lesson.title}
${lesson.content ? `المحتوى: ${lesson.content}` : ""}
${lesson.difficulty_level ? `المستوى: ${lesson.difficulty_level}` : ""}`;

        // استخدام AI للحصول على الشرح
        const aiResponse = await this.aiProvider.chatCompletion({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          maxTokens: 2000,
        });

        return {
          lesson_id: lessonId,
          explanation: aiResponse.content,
          language,
          style,
        };
      },
      {
        cacheWarming: ["lessons"],
        performanceTracking: true,
        retryable: true,
      },
      {
        operation: "getLessonExplanation",
        metadata: {
          lessonId,
          language,
          style,
        },
      },
    );
  }

  /**
   * الحصول على أمثلة للدرس باستخدام AI
   *
   * @param lessonId - معرف الدرس
   * @param count - عدد الأمثلة المطلوبة
   * @param difficulty - مستوى الصعوبة
   * @param language - اللغة
   * @returns LessonExamples
   */
  async getLessonExamples(
    lessonId: string,
    count: number = 5,
    difficulty?: string,
    language: string = "ar",
  ): Promise<LessonExamples> {
    try {
      // جلب الدرس
      const lesson = await this.databaseAdapter.findOne<LearningLesson>(
        "lessons",
        { id: lessonId },
      );

      if (!lesson) {
        throw new Error(`الدرس غير موجود: ${lessonId}`);
      }

      const systemPrompt = `أنت مساعد تعليمي ذكي. مهمتك إنشاء أمثلة تعليمية فعالة.
اللغة: ${language === "ar" ? "العربية" : "English"}
قم بإنشاء ${count} أمثلة ${difficulty ? `بمستوى صعوبة ${difficulty}` : "بمستويات مختلفة"}.
كل مثال يجب أن يحتوي على:
1. السؤال
2. الحل
3. الشرح

أرجع النتيجة بصيغة JSON.`;

      const userPrompt = `أنشئ أمثلة للدرس التالي:
العنوان: ${lesson.title}
${lesson.content ? `المحتوى: ${lesson.content}` : ""}`;

      const aiResponse = await this.aiProvider.chatCompletion({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 3000,
      });

      // محاولة تحليل JSON من الرد
      let examples: LessonExample[] = [];
      try {
        const jsonMatch = aiResponse.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          examples = JSON.parse(jsonMatch[0]);
        } else {
          // إذا لم يكن JSON، نقوم بإنشاء أمثلة يدوياً
          examples = this.parseExamplesFromText(aiResponse.content, count);
        }
      } catch {
        examples = this.parseExamplesFromText(aiResponse.content, count);
      }

      return {
        lesson_id: lessonId,
        examples: examples.map((ex, index) => ({
          id: index + 1,
          question: ex.question || `سؤال ${index + 1}`,
          solution: ex.solution || "الحل",
          explanation: ex.explanation || "الشرح",
          difficulty: ex.difficulty || difficulty || "medium",
        })),
        count: examples.length,
      };
    } catch (error) {
      logger.error("Failed to get lesson examples", {
        error: error instanceof Error ? error.message : "Unknown error",
        lessonId,
        count,
        difficulty,
      });
      throw error;
    }
  }

  /**
   * الحصول على فيديوهات للدرس
   *
   * @param lessonId - معرف الدرس
   * @param platform - المنصة (youtube/vimeo)
   * @param maxResults - الحد الأقصى للنتائج
   * @returns LessonVideos
   */
  async getLessonVideos(
    lessonId: string,
    platform?: string,
    _maxResults: number = 10,
  ): Promise<LessonVideos> {
    try {
      // جلب الدرس
      const lesson = await this.databaseAdapter.findOne<LearningLesson>(
        "lessons",
        { id: lessonId },
      );

      if (!lesson) {
        throw new Error(`الدرس غير موجود: ${lessonId}`);
      }

      // TODO: تكامل مع YouTube/Vimeo API
      // حالياً نرجع قائمة فارغة
      return {
        lesson_id: lessonId,
        videos: [],
        count: 0,
        source: "placeholder",
      };
    } catch (error) {
      logger.error("Failed to get lesson videos", {
        error: error instanceof Error ? error.message : "Unknown error",
        lessonId,
        platform,
      });
      throw error;
    }
  }

  /**
   * الحصول على Mind Map للدرس باستخدام AI
   *
   * @param lessonId - معرف الدرس
   * @param format - الصيغة (json/image/svg)
   * @param language - اللغة
   * @returns LessonMindMap
   */
  async getLessonMindMap(
    lessonId: string,
    format: string = "json",
    language: string = "ar",
  ): Promise<LessonMindMap> {
    try {
      // جلب الدرس
      const lesson = await this.databaseAdapter.findOne<LearningLesson>(
        "lessons",
        { id: lessonId },
      );

      if (!lesson) {
        throw new Error(`الدرس غير موجود: ${lessonId}`);
      }

      const systemPrompt = `أنت مساعد تعليمي ذكي. مهمتك إنشاء Mind Map تعليمي.
اللغة: ${language === "ar" ? "العربية" : "English"}
أنشئ Mind Map منظم يوضح المفاهيم الرئيسية والفرعية للدرس.
أرجع النتيجة بصيغة JSON مع nodes و edges.`;

      const userPrompt = `أنشئ Mind Map للدرس التالي:
العنوان: ${lesson.title}
${lesson.content ? `المحتوى: ${lesson.content}` : ""}`;

      const aiResponse = await this.aiProvider.chatCompletion({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6,
        maxTokens: 2000,
      });

      // محاولة تحليل JSON
      let nodes: MindMapNode[] = [];
      let edges: MindMapEdge[] = [];

      try {
        const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          nodes = parsed.nodes || [];
          edges = parsed.edges || [];
        }
      } catch {
        // إذا فشل التحليل، ننشئ Mind Map بسيط
        nodes = [{ id: "root", label: lesson.title, type: "root" }];
        edges = [];
      }

      return {
        lesson_id: lessonId,
        nodes,
        edges,
        format: format as "json" | "image" | "svg",
      };
    } catch (error) {
      logger.error("Failed to get lesson mind map", {
        error: error instanceof Error ? error.message : "Unknown error",
        lessonId,
        format,
      });
      throw error;
    }
  }

  /**
   * الحصول على جميع الدروس
   *
   * @param subjectId - معرف المادة (اختياري)
   * @param gradeLevelId - معرف المستوى (اختياري)
   * @param page - رقم الصفحة
   * @param perPage - عدد العناصر في الصفحة
   * @returns قائمة الدروس
   */
  async getLessons(
    subjectId?: string,
    gradeLevelId?: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<{
    data: LearningLesson[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  }> {
    return this.executeWithEnhancements(
      async () => {
        const offset = (page - 1) * perPage;
        const conditions: Record<string, unknown> = {};

        if (subjectId) conditions.subject_id = subjectId;
        if (gradeLevelId) conditions.grade_level_id = gradeLevelId;

        const [lessons, total] = await Promise.all([
          this.databaseAdapter.find<LearningLesson>("lessons", conditions, {
            limit: perPage,
            offset,
            orderBy: { column: "order", direction: "asc" },
          }),
          this.databaseAdapter.count("lessons", conditions),
        ]);
        const totalPages = Math.ceil(total / perPage);

        return {
          data: lessons,
          total,
          page,
          per_page: perPage,
          total_pages: totalPages,
        };
      },
      {
        cacheWarming: ["lessons"],
        performanceTracking: true,
      },
      {
        operation: "getLessons",
        metadata: {
          subjectId,
          gradeLevelId,
          page,
          perPage,
        },
      },
    );
  }

  /**
   * الحصول على درس بالمعرف
   *
   * @param lessonId - معرف الدرس
   * @returns LearningLesson - الدرس المطلوب
   */
  async getLesson(lessonId: string): Promise<LearningLesson> {
    return this.executeWithEnhancements(
      async () => {
        const lesson = await this.databaseAdapter.findOne<LearningLesson>(
          "lessons",
          { id: lessonId },
        );

        if (!lesson) {
          throw new Error(`الدرس غير موجود: ${lessonId}`);
        }

        return lesson;
      },
      {
        cacheWarming: ["lessons"],
        performanceTracking: true,
      },
      {
        operation: "getLesson",
        metadata: {
          lessonId,
        },
      },
    );
  }

  /**
   * تحليل الأمثلة من النص
   *
   * @private
   */
  private parseExamplesFromText(text: string, count: number): LessonExample[] {
    const examples: LessonExample[] = [];
    const lines = text.split("\n").filter((line) => line.trim());

    let currentExample: Partial<LessonExample> = {};
    let exampleIndex = 0;

    for (const line of lines) {
      if (line.match(/سؤال|question|مثال|example/i)) {
        if (currentExample.question) {
          examples.push({
            id: exampleIndex++,
            question: currentExample.question || "",
            solution: currentExample.solution || "",
            explanation: currentExample.explanation || "",
            difficulty: currentExample.difficulty || "medium",
          });
        }
        currentExample = { question: line.replace(/^.*?:/, "").trim() };
      } else if (line.match(/حل|solution/i)) {
        currentExample.solution = line.replace(/^.*?:/, "").trim();
      } else if (line.match(/شرح|explanation/i)) {
        currentExample.explanation = line.replace(/^.*?:/, "").trim();
      } else if (currentExample.question && !currentExample.solution) {
        currentExample.solution = line.trim();
      } else if (currentExample.solution && !currentExample.explanation) {
        currentExample.explanation = line.trim();
      }

      if (examples.length >= count) break;
    }

    // إضافة آخر مثال
    if (currentExample.question && examples.length < count) {
      examples.push({
        id: exampleIndex++,
        question: currentExample.question || "",
        solution: currentExample.solution || "",
        explanation: currentExample.explanation || "",
        difficulty: currentExample.difficulty || "medium",
      });
    }

    return examples;
  }
}

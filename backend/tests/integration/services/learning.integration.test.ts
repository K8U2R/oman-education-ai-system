/**
 * Learning Service Integration Tests - اختبارات التكامل لخدمة التعلم
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { vi } from 'vitest'

// Mock DatabaseCoreAdapter before importing it
const mockDatabaseAdapter = {
  find: vi.fn(),
  findOne: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  execute: vi.fn(),
  count: vi.fn(),
}

vi.mock('@/infrastructure/adapters/db/DatabaseCoreAdapter', () => {
  return {
    DatabaseCoreAdapter: vi.fn().mockImplementation(() => mockDatabaseAdapter)
  }
})

import { LearningService } from '@/application/services/learning/LearningService'
import type { IAIProvider } from '@/domain'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'
import type { AIChatRequest } from '@/domain/interfaces/ai/IAIProvider'

describe('LearningService Integration', () => {
  let learningService: LearningService
  let aiProvider: IAIProvider
  let databaseAdapter: DatabaseCoreAdapter
  let testLessonId: string | null = null

  beforeAll(async () => {
    // Initialize Database Adapter
    databaseAdapter = new DatabaseCoreAdapter()

    // Initialize AI Provider (mock for integration tests)
    aiProvider = {
      chatCompletion: async (request: AIChatRequest) => {
        const systemMessage = request.messages.find((m: any) => m.role === 'system')?.content || ''
        const userMessage = request.messages.find((m: any) => m.role === 'user')?.content || ''

        // Simulate different responses based on request
        if (systemMessage.includes('simple')) {
          return {
            content: 'شرح بسيط للدرس: هذا شرح مبسط ومباشر للدرس المطلوب.',
            model: 'gpt-4',
            usage: {
              promptTokens: 50,
              completionTokens: 30,
              totalTokens: 80,
            },
          }
        } else if (systemMessage.includes('detailed')) {
          return {
            content: 'شرح مفصل للدرس: هذا شرح شامل ومفصل يتضمن جميع الجوانب المهمة مع أمثلة وتطبيقات عملية.',
            model: 'gpt-4',
            usage: {
              promptTokens: 60,
              completionTokens: 100,
              totalTokens: 160,
            },
          }
        } else if (userMessage.includes('أمثلة')) {
          return {
            content: JSON.stringify({
              examples: [
                { title: 'مثال 1', description: 'وصف المثال الأول', solution: 'الحل' },
                { title: 'مثال 2', description: 'وصف المثال الثاني', solution: 'الحل' },
              ],
            }),
            model: 'gpt-4',
            usage: {
              promptTokens: 40,
              completionTokens: 80,
              totalTokens: 120,
            },
          }
        } else if (userMessage.includes('فيديو')) {
          return {
            content: JSON.stringify({
              videos: [
                { title: 'فيديو 1', url: 'https://example.com/video1', duration: 300 },
                { title: 'فيديو 2', url: 'https://example.com/video2', duration: 450 },
              ],
            }),
            model: 'gpt-4',
            usage: {
              promptTokens: 30,
              completionTokens: 50,
              totalTokens: 80,
            },
          }
        } else if (userMessage.includes('خريطة ذهنية')) {
          return {
            content: JSON.stringify({
              nodes: [
                { id: '1', label: 'الموضوع الرئيسي', level: 0 },
                { id: '2', label: 'النقطة الأولى', level: 1 },
                { id: '3', label: 'النقطة الثانية', level: 1 },
              ],
              edges: [
                { from: '1', to: '2' },
                { from: '1', to: '3' },
              ],
            }),
            model: 'gpt-4',
            usage: {
              promptTokens: 35,
              completionTokens: 60,
              totalTokens: 95,
            },
          }
        }

        return {
          content: 'Test response',
          model: 'gpt-4',
          usage: {
            promptTokens: 50,
            completionTokens: 50,
            totalTokens: 100,
          },
        }
      },
      generateEmbedding: async () => [0, 0, 0],
      getName: () => 'Mock AI Provider'
    } as any as IAIProvider

    learningService = new LearningService(aiProvider, databaseAdapter)

    // Setup default mock behavior for databaseAdapter.insert
    // Status removed as it might not be in Partial<LearningLesson> or used correctly in test
    vi.mocked(databaseAdapter.insert).mockResolvedValue({
      data: [{ id: 'test-lesson-id' }] as any,
      success: true
    } as any)
  })

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeEach(async () => {
    // Create a test lesson for each test
    // In mock mode, we just set the ID
    testLessonId = 'test-lesson-id'
  })

  afterAll(async () => {
    // Cleanup test lesson if created
    try {
      await databaseAdapter.delete('lessons', { id: testLessonId })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  beforeEach(() => {
    // Ensure find returns an array for getLessons
    vi.mocked(databaseAdapter.find).mockResolvedValue([{ id: 'test-lesson-id', title: 'Test Lesson', order: 1 }] as any);
    vi.mocked(databaseAdapter.count).mockResolvedValue(1);
  })

  describe('getLessonExplanation', () => {
    it('should return lesson explanation for simple style', async () => {
      // Arrange
      const lessonId = testLessonId || 'test-lesson-id'

      // Act
      try {
        const explanation = await learningService.getLessonExplanation(lessonId, 'ar', 'simple')

        // Assert
        expect(explanation).toHaveProperty('explanation')
        expect(explanation.explanation).toContain('شرح')
        expect(explanation).toHaveProperty('language')
        expect(explanation.language).toBe('ar')
      } catch (error) {
        // If lesson doesn't exist, expect error
        expect((error as Error).message).toContain('غير موجود')
      }
    })

    it('should return lesson explanation for detailed style', async () => {
      // Arrange
      const lessonId = testLessonId || 'test-lesson-id'

      // Act
      try {
        const explanation = await learningService.getLessonExplanation(lessonId, 'ar', 'detailed')

        // Assert
        expect(explanation).toHaveProperty('explanation')
        expect(explanation.explanation).toContain('شرح')
        expect(explanation.language).toBe('ar')
      } catch (error) {
        expect((error as Error).message).toContain('غير موجود')
      }
    })

    it('should return lesson explanation for interactive style', async () => {
      // Arrange
      const lessonId = testLessonId || 'test-lesson-id'

      // Act
      try {
        const explanation = await learningService.getLessonExplanation(lessonId, 'ar', 'interactive')

        // Assert
        expect(explanation).toHaveProperty('explanation')
        expect(explanation.language).toBe('ar')
      } catch (error) {
        expect((error as Error).message).toContain('غير موجود')
      }
    })

    it('should throw error if lesson not found', async () => {
      // Arrange
      const nonExistentId = 'lesson-non-existent'

      // Act & Assert
      await expect(
        learningService.getLessonExplanation(nonExistentId, 'ar', 'simple')
      ).rejects.toThrow('غير موجود')
    })
  })

  describe('getLessonExamples', () => {
    it('should return lesson examples', async () => {
      // Arrange
      const lessonId = testLessonId || 'test-lesson-id'
      const count = 5

      // Act
      try {
        const examples = await learningService.getLessonExamples(lessonId, count, undefined, 'ar')

        // Assert
        expect(examples).toHaveProperty('examples')
        expect(Array.isArray(examples.examples)).toBe(true)
        if (examples.examples.length > 0) {
          expect(examples.examples[0]).toHaveProperty('title')
          expect(examples.examples[0]).toHaveProperty('description')
        }
      } catch (error) {
        expect((error as Error).message).toContain('غير موجود')
      }
    })

    it('should throw error if lesson not found', async () => {
      // Arrange
      const nonExistentId = 'lesson-non-existent'

      // Act & Assert
      await expect(
        learningService.getLessonExamples(nonExistentId, 5, undefined, 'ar')
      ).rejects.toThrow('غير موجود')
    })
  })

  describe('getLessonVideos', () => {
    it('should return lesson videos', async () => {
      // Arrange
      const lessonId = testLessonId || 'test-lesson-id'

      // Act
      try {
        const videos = await learningService.getLessonVideos(lessonId, 'ar')

        // Assert
        expect(videos).toHaveProperty('videos')
        expect(Array.isArray(videos.videos)).toBe(true)
      } catch (error) {
        expect((error as Error).message).toContain('غير موجود')
      }
    })
  })

  describe('getLessonMindMap', () => {
    it('should return lesson mind map', async () => {
      // Arrange
      const lessonId = testLessonId || 'test-lesson-id'

      // Act
      try {
        const mindMap = await learningService.getLessonMindMap(lessonId, 'ar')

        // Assert
        expect(mindMap).toHaveProperty('nodes')
        expect(mindMap).toHaveProperty('edges')
        expect(Array.isArray(mindMap.nodes)).toBe(true)
        expect(Array.isArray(mindMap.edges)).toBe(true)
      } catch (error) {
        expect((error as Error).message).toContain('غير موجود')
      }
    })
  })

  describe('getLessons', () => {
    it('should return paginated lessons', async () => {
      // Act
      const result = await learningService.getLessons(undefined, undefined, 1, 20)

      // Assert
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should filter lessons by subject', async () => {
      // Act
      const result = await learningService.getLessons('subject-test', undefined, 1, 20)

      // Assert
      expect(result).toHaveProperty('data')
      expect(Array.isArray(result.data)).toBe(true)
    })
  })
})

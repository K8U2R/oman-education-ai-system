/**
 * Office Service Integration Tests - اختبارات التكامل لخدمة Office
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { vi } from 'vitest'

// Mock DatabaseCoreAdapter before importing it
const mockDatabaseAdapter = {
  find: vi.fn(),
  findOne: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  execute: vi.fn(),
}

vi.mock('@/infrastructure/adapters/db/DatabaseCoreAdapter', () => {
  return {
    DatabaseCoreAdapter: vi.fn().mockImplementation(() => mockDatabaseAdapter)
  }
})

import { OfficeGenerationService } from '@/application/services/office/OfficeGenerationService'
import type { IAIProvider } from '@/domain'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'
import { ExcelAdapter } from '@/infrastructure/adapters/office/ExcelAdapter'
import { WordAdapter } from '@/infrastructure/adapters/office/WordAdapter'
import { PowerPointAdapter } from '@/infrastructure/adapters/office/PowerPointAdapter'

describe('OfficeGenerationService Integration', () => {
  let officeService: OfficeGenerationService
  let aiProvider: IAIProvider
  let excelAdapter: ExcelAdapter
  let wordAdapter: WordAdapter
  let powerpointAdapter: PowerPointAdapter
  let databaseAdapter: DatabaseCoreAdapter

  beforeAll(async () => {
    // Initialize Database Adapter
    databaseAdapter = new DatabaseCoreAdapter()

    // Initialize AI Provider (mock for integration tests)
    aiProvider = {
      chatCompletion: async (request: any) => {
        const userMessage = request.messages.find((m: any) => m.role === 'user')?.content || ''

        // Simulate AI response for data generation
        if (userMessage.includes('جدول بيانات')) {
          return {
            content: JSON.stringify({
              headers: ['الاسم', 'العمر', 'الدرجة'],
              rows: [
                ['أحمد', 20, 95],
                ['محمد', 21, 88],
                ['فاطمة', 19, 92],
              ],
            }),
            model: 'gpt-4',
            usage: {
              promptTokens: 50,
              completionTokens: 100,
              totalTokens: 150,
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

    // Initialize Office Adapters
    excelAdapter = new ExcelAdapter()
    wordAdapter = new WordAdapter()
    powerpointAdapter = new PowerPointAdapter()

    officeService = new OfficeGenerationService(
      aiProvider,
      excelAdapter,
      wordAdapter,
      powerpointAdapter,
      databaseAdapter
    )

    // Setup default mock returns
    vi.mocked(mockDatabaseAdapter.find).mockResolvedValue([
      { id: 'template-1', name: 'Template 1', type: 'excel' }
    ])
    vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(
      { id: 'template-1', name: 'Template 1', type: 'excel' } as any
    )
    vi.mocked(mockDatabaseAdapter.insert).mockResolvedValue({ success: true } as any)
    vi.mocked(mockDatabaseAdapter.update).mockResolvedValue({ success: true } as any)
    vi.mocked(mockDatabaseAdapter.delete).mockResolvedValue({ success: true } as any)

    // Setup mocks
    vi.mocked(databaseAdapter.insert).mockResolvedValue({
      data: [{ id: 'file-123', url: 'http://example.com/file.xlsx', name: 'file.xlsx' }] as any,
      success: true
    } as any)
  })

  afterAll(async () => {
    // Cleanup if needed
  })

  describe('generateOffice', () => {
    it('should generate Excel file successfully', async () => {
      // Arrange
      const request = {
        type: 'excel' as const,
        description: 'إنشاء جدول بيانات للطلاب',
        data: {
          headers: ['الاسم', 'العمر', 'الدرجة'],
          rows: [
            ['أحمد', 20, 95],
            ['محمد', 21, 88],
            ['فاطمة', 19, 92],
          ],
        },
        options: {
          title: 'قائمة الطلاب',
          style: 'professional' as const,
        },
      }

      // Act
      const result = await officeService.generateOffice(request)

      // Assert
      expect(result).toHaveProperty('file_id')
      expect(result).toHaveProperty('file_url')
      expect(result).toHaveProperty('file_name')
    })

    it('should generate Word file successfully', async () => {
      // Arrange
      const request = {
        type: 'word' as const,
        description: 'إنشاء مستند نصي',
        data: {
          title: 'عنوان المستند',
          content: 'محتوى المستند',
        },
        options: {
          title: 'مستند اختبار',
          style: 'professional' as const,
        },
      }

      // Act
      const result = await officeService.generateOffice(request)

      // Assert
      expect(result).toHaveProperty('file_id')
      expect(result).toHaveProperty('file_url')
      expect(result).toHaveProperty('file_name')
      expect(result.file_name).toContain('.docx')
      expect(result.type).toBe('word')
    })

    it('should generate PowerPoint file successfully', async () => {
      // Arrange
      const request = {
        type: 'powerpoint' as const,
        description: 'إنشاء عرض تقديمي',
        data: {
          slides: [
            { title: 'الشريحة الأولى', content: 'محتوى الشريحة الأولى' },
            { title: 'الشريحة الثانية', content: 'محتوى الشريحة الثانية' },
          ],
        },
        options: {
          title: 'عرض تقديمي',
          style: 'professional' as const,
        },
      }

      // Act
      const result = await officeService.generateOffice(request)

      // Assert
      expect(result).toHaveProperty('file_id')
      expect(result).toHaveProperty('file_url')
      expect(result).toHaveProperty('file_name')
      expect(result.file_name).toContain('.pptx')
      expect(result.type).toBe('powerpoint')
    })

    it('should use AI to generate data from description', async () => {
      // Arrange
      const request = {
        type: 'excel' as const,
        description: 'إنشاء جدول بيانات للطلاب مع الأسماء والأعمار والدرجات',
        data: {},
        options: {
          title: 'قائمة الطلاب',
        },
      }

      // Act
      const result = await officeService.generateOffice(request)

      // Assert
      expect(result).toHaveProperty('file_id')
      expect(result).toHaveProperty('file_url')
      expect(result.type).toBe('excel')
    })
  })

  describe('generateExcel', () => {
    it('should generate Excel file with data', async () => {
      // Arrange
      const request = {
        description: 'إنشاء جدول بيانات',
        data: {
          headers: ['الاسم', 'العمر'],
          rows: [
            ['أحمد', 20],
            ['محمد', 21],
          ],
        },
        options: {
          title: 'جدول بيانات',
        },
      }

      // Act
      const result = await officeService.generateOffice({ ...request, type: 'excel' })

      // Assert
      expect(result).toHaveProperty('file_id')
      expect(result).toHaveProperty('file_url')
      expect(result.file_type).toBe('excel')
    })
  })

  describe('generateWord', () => {
    it('should generate Word file with data', async () => {
      // Arrange
      const request: any = {
        data: {
          title: 'Document Title',
          content: 'Document content'
        },
        options: {
          title: 'Test Document'
        }
      }

      // Act
      const result = await officeService.generateOffice({ ...request, type: 'word' })

      // Assert
      expect(result).toHaveProperty('file_id')
      expect(result).toHaveProperty('file_url')
      expect(result.file_type).toBe('word')
    })
  })

  describe('generatePowerPoint', () => {
    it('should generate PowerPoint file with data', async () => {
      // Arrange
      const request: any = {
        data: {
          title: 'Presentation',
          slides: []
        },
        options: {
          title: 'Test Presentation'
        }
      }

      // Act
      const result = await officeService.generateOffice({ ...request, type: 'powerpoint' })

      // Assert
      expect(result).toHaveProperty('file_id')
      expect(result).toHaveProperty('file_url')
      expect(result.file_type).toBe('powerpoint')
    })
  })

  describe('getTemplates', () => {
    it('should return list of templates', async () => {
      // Act
      const templates = await officeService.getTemplates()

      // Assert
      expect(Array.isArray(templates)).toBe(true)
      if (templates.length > 0) {
        expect(templates[0]).toHaveProperty('id')
        expect(templates[0]).toHaveProperty('name')
        expect(templates[0]).toHaveProperty('type')
      }
    })
  })

  describe('getTemplate', () => {
    it('should return template by id if exists', async () => {
      // Arrange
      const templates = await officeService.getTemplates()
      if (templates.length === 0) {
        // Skip test if no templates exist
        return
      }
      const templateId = templates[0].id

      // Act
      const template = await officeService.getTemplate(templateId)

      // Assert
      expect(template).toHaveProperty('id')
      expect(template.id).toBe(templateId)
    })

    it('should throw error if template not found', async () => {
      // Arrange
      const nonExistentId = 'template-non-existent'
      vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValueOnce(null)

      // Act & Assert
      await expect(
        officeService.getTemplate(nonExistentId)
      ).rejects.toThrow()
    })
  })
})

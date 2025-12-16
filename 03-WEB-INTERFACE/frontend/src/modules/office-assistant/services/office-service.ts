import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { OfficeAppType } from '../OfficeAssistantPage';
import { Message } from '@/modules/ai-assistant/components/MessageList';

export interface OfficeFileAnalysis {
  type: OfficeAppType;
  fileName: string;
  content: string;
  structure: Record<string, unknown>;
  metadata: {
    author?: string;
    created?: Date;
    modified?: Date;
    pages?: number;
    words?: number;
    characters?: number;
  };
  suggestions: string[];
}

export interface OfficeFileGeneration {
  type: OfficeAppType;
  content: string;
  format: string;
  downloadUrl?: string;
  preview?: string;
}

export interface OfficeTest {
  id: string;
  type: 'quiz' | 'assignment' | 'exam';
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'true-false' | 'essay';
    options?: string[];
    correctAnswer?: string;
  }>;
  timeLimit?: number;
  passingScore?: number;
}

class OfficeService {
  /**
   * معالجة ملف Office وتحليله
   */
  async processFile(
    appType: OfficeAppType,
    file: File,
    userRequest?: string
  ): Promise<OfficeFileAnalysis> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', appType);
    if (userRequest) {
      formData.append('request', userRequest);
    }

    try {
      return await apiClient.post<OfficeFileAnalysis>(
        `${API_ENDPOINTS.office?.analyze || '/api/office/analyze'}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {
      // Mock response for development
      return {
        type: appType,
        fileName: file.name,
        content: 'محتوى الملف...',
        structure: {},
        metadata: {
          author: 'مستخدم',
          created: new Date(),
          modified: new Date(),
        },
        suggestions: ['اقتراح 1', 'اقتراح 2'],
      };
    }
  }

  /**
   * إنشاء ملف Office جديد بناءً على المحادثة
   */
  async generateFile(
    appType: OfficeAppType,
    messages: Message[]
  ): Promise<OfficeFileGeneration> {
    try {
      return await apiClient.post<OfficeFileGeneration>(
        `${API_ENDPOINTS.office?.generate || '/api/office/generate'}`,
        {
          type: appType,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }
      );
    } catch (error) {
      // Mock response
      return {
        type: appType,
        content: 'محتوى الملف المُنشأ...',
        format: appType === 'word' ? 'docx' : appType === 'excel' ? 'xlsx' : 'pptx',
      };
    }
  }

  /**
   * تحرير ملف Office بناءً على طلب المستخدم
   */
  async editFile(
    appType: OfficeAppType,
    fileContent: string,
    editRequest: string
  ): Promise<string> {
    try {
      const response = await apiClient.post<{ content: string }>(
        `${API_ENDPOINTS.office?.edit || '/api/office/edit'}`,
        {
          type: appType,
          content: fileContent,
          request: editRequest,
        }
      );
      return response.content;
    } catch (error) {
      // Mock response
      return fileContent + '\n\n[تم التعديل بناءً على: ' + editRequest + ']';
    }
  }

  /**
   * إنشاء اختبار من محتوى الملف
   */
  async createTest(
    appType: OfficeAppType,
    fileContent: string,
    testType: 'quiz' | 'assignment' | 'exam',
    options?: {
      questionCount?: number;
      timeLimit?: number;
      passingScore?: number;
    }
  ): Promise<OfficeTest> {
    try {
      return await apiClient.post<OfficeTest>(
        `${API_ENDPOINTS.office?.createTest || '/api/office/create-test'}`,
        {
          type: appType,
          content: fileContent,
          testType,
          ...options,
        }
      );
    } catch (error) {
      // Mock response
      return {
        id: 'test-' + Date.now(),
        type: testType,
        questions: [
          {
            id: 'q1',
            question: 'سؤال تجريبي من المحتوى',
            type: 'multiple-choice',
            options: ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'],
            correctAnswer: 'خيار 1',
          },
        ],
        timeLimit: options?.timeLimit || 60,
        passingScore: options?.passingScore || 70,
      };
    }
  }

  /**
   * تحليل محتوى الملف عند المشاركة
   */
  async analyzeSharedFile(
    fileUrl: string,
    appType: OfficeAppType
  ): Promise<OfficeFileAnalysis> {
    try {
      return await apiClient.post<OfficeFileAnalysis>(
        `${API_ENDPOINTS.office?.analyzeShared || '/api/office/analyze-shared'}`,
        {
          fileUrl,
          type: appType,
        }
      );
    } catch (error) {
      // Mock response
      return {
        type: appType,
        fileName: 'ملف مشترك',
        content: 'محتوى الملف المشترك...',
        structure: {},
        metadata: {},
        suggestions: [],
      };
    }
  }

  /**
   * الحصول على التحليلات المتقدمة
   */
  async getAnalytics(
    appType: OfficeAppType,
    fileId?: string
  ): Promise<{
    usage: {
      totalFiles: number;
      totalEdits: number;
      averageFileSize: number;
    };
    performance: {
      averageProcessingTime: number;
      successRate: number;
    };
    insights: string[];
  }> {
    try {
      return await apiClient.get(
        `${API_ENDPOINTS.office?.analytics || '/api/office/analytics'}/${appType}${fileId ? `?fileId=${fileId}` : ''}`
      );
    } catch (error) {
      // Mock response
      return {
        usage: {
          totalFiles: 0,
          totalEdits: 0,
          averageFileSize: 0,
        },
        performance: {
          averageProcessingTime: 0,
          successRate: 100,
        },
        insights: [],
      };
    }
  }
}

export const officeService = new OfficeService();


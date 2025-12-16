import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';

interface ChatResponse {
  message: string;
  content?: string;
  suggestions?: string[];
}

class AIChatService {
  async chat(message: string, context?: string): Promise<ChatResponse> {
    try {
      return await apiClient.post<ChatResponse>(API_ENDPOINTS.ai.chat, {
        message,
        context,
      });
    } catch {
      // Return mock response if API fails
      return {
        message: 'هذه استجابة تجريبية. سيتم ربطها بـ AI API لاحقاً.',
        content: 'هذه استجابة تجريبية. سيتم ربطها بـ AI API لاحقاً.',
      };
    }
  }

  async generateCode(prompt: string, language: string = 'typescript'): Promise<string> {
    try {
      const response = await apiClient.post<{ code: string }>(API_ENDPOINTS.ai.generate, {
        prompt,
        language,
      });
      return response.code;
    } catch {
      return `// ${prompt}\n// سيتم توليد الكود هنا`;
    }
  }

  async explainCode(code: string): Promise<string> {
    try {
      const response = await apiClient.post<{ explanation: string }>(API_ENDPOINTS.ai.explain, {
        code,
      });
      return response.explanation;
    } catch {
      return 'شرح الكود: سيتم شرح الكود هنا';
    }
  }

  async refactorCode(code: string): Promise<string> {
    try {
      const response = await apiClient.post<{ code: string }>(API_ENDPOINTS.ai.refactor, {
        code,
      });
      return response.code;
    } catch {
      return code; // Return original code if refactoring fails
    }
  }

  async fixCode(code: string, error: string): Promise<string> {
    try {
      const response = await apiClient.post<{ code: string }>(API_ENDPOINTS.ai.fix, {
        code,
        error,
      });
      return response.code;
    } catch {
      return code; // Return original code if fixing fails
    }
  }
}

export const aiChatService = new AIChatService();


import { errorService } from '@/core/error/ErrorService';
import { apiClient } from './api-client';
import { API_ENDPOINTS } from './endpoints';

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIIntentSuggestion {
  intent_type?: string | null;
  confidence?: number | null;
  suggested_path?: string | null;
  suggested_title?: string | null;
  suggested_description?: string | null;
}

export interface AIIntentChatResponse extends AIResponse {
  model?: string;
  timestamp?: string;
  intent?: AIIntentSuggestion | null;
}

class AIService {
  private apiKey: string | null = null;
  private provider: string = 'gemini'; // Default provider

  constructor() {
    this.apiKey = import.meta.env.VITE_AI_API_KEY || null;
    this.provider = import.meta.env.VITE_AI_PROVIDER || 'gemini';
  }

  /**
   * Set API provider
   */
  setProvider(provider: 'gemini' | 'openai' | 'anthropic'): void {
    this.provider = provider;
  }

  /**
   * Set API key
   */
  setApiKey(apiKey: string | null): void {
    this.apiKey = apiKey;
  }

  async sendMessage(
    messages: AIMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      editMessageId?: string; // معرف الرسالة المعدلة
      regenerateMessageId?: string; // معرف رسالة AI لإعادة التوليد
    }
  ): Promise<AIResponse> {
    try {
      const data = await apiClient.post<AIResponse>(
        API_ENDPOINTS.ai.chat,
        {
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model: options?.model || (this.provider === 'gemini' ? 'gemini-1.5-pro' : 'gpt-4'),
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000,
          provider: this.provider,
          ...(this.apiKey && { api_key: this.apiKey }),
          ...(options?.editMessageId && { edit_message_id: options.editMessageId }),
          ...(options?.regenerateMessageId && { regenerate_message_id: options.regenerateMessageId }),
        }
      );

      return {
        message: data.message || (data as any).content || 'لا توجد استجابة',
        usage: data.usage,
      };
    } catch (error) {
      errorService.logError(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        {
          title: 'خطأ في AI',
          message: 'فشل في التواصل مع خدمة الذكاء الاصطناعي',
          level: 'error',
        }
      );
      throw error;
    }
  }

  /**
   * إرسال رسالة والحصول على:
   * - رد المحادثة
   * - تحليل النية واقتراح صفحة (من Backend/Gemini)
   */
  async sendMessageWithIntent(
    messages: AIMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<AIIntentChatResponse> {
    try {
      // استخدام apiClient مع endpoint صحيح
      const endpoint = API_ENDPOINTS.ai.intentChat;
      
      const data = await apiClient.post<AIIntentChatResponse>(
        endpoint,
        {
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model: options?.model || (this.provider === 'gemini' ? 'gemini-1.5-pro' : 'gpt-4'),
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1024,
          provider: this.provider,
          ...(this.apiKey && { api_key: this.apiKey }),
        }
      );

      return {
        message: data.message || (data as any).content || 'لا توجد استجابة',
        usage: data.usage,
        model: data.model,
        timestamp: data.timestamp,
        intent: data.intent,
      };
        } catch (error) {
          // معالجة أخطاء محددة من Backend
          let errorMessage = 'فشل في التواصل مع خدمة تحليل النية في الذكاء الاصطناعي';
          let errorTitle = 'خطأ في AI (Intent)';
          
          if (error instanceof Error) {
            // محاولة استخراج رسالة الخطأ من Backend
            try {
              const errorStr = error.message;
              if (errorStr.includes('gemini_api_disabled') || errorStr.includes('SERVICE_DISABLED')) {
                errorTitle = 'Gemini API غير مفعّل';
                errorMessage = 'يجب تفعيل Gemini API في Google Cloud Console. راجع ملف GEMINI_API_SETUP.md للتعليمات.';
              } else if (errorStr.includes('gemini_api_key_missing') || errorStr.includes('API key')) {
                errorTitle = 'مفتاح API مفقود';
                errorMessage = 'مفتاح Gemini API غير موجود. يرجى إضافته إلى ملف .env كـ GEMINI_API_KEY.';
              }
            } catch (e) {
              // إذا فشل التحليل، استخدم الرسالة الافتراضية
            }
          }
          
          errorService.logError(
            error instanceof Error ? error : new Error(String(error)),
            undefined,
            {
              title: errorTitle,
              message: errorMessage,
              level: 'error',
            }
          );
          throw error;
        }
  }

  async generateCode(prompt: string, language: string): Promise<string> {
    const response = await this.sendMessage([
      {
        role: 'system',
        content: `أنت مساعد برمجي متخصص. قم بإنشاء كود ${language} بناءً على الطلب.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return response.message;
  }

  async explainCode(code: string, language: string): Promise<string> {
    const response = await this.sendMessage([
      {
        role: 'system',
        content: `أنت مساعد برمجي. اشرح الكود التالي بلغة ${language} بشكل واضح ومفصل.`,
      },
      {
        role: 'user',
        content: `اشرح هذا الكود:\n\`\`\`${language}\n${code}\n\`\`\``,
      },
    ]);

    return response.message;
  }

  async refactorCode(code: string, language: string, instructions: string): Promise<string> {
    const response = await this.sendMessage([
      {
        role: 'system',
        content: `أنت مساعد برمجي متخصص في إعادة هيكلة الكود. قم بإعادة هيكلة الكود بناءً على التعليمات.`,
      },
      {
        role: 'user',
        content: `أعد هيكلة هذا الكود:\n\`\`\`${language}\n${code}\n\`\`\`\n\nالتعليمات: ${instructions}`,
      },
    ]);

    return response.message;
  }

  async fixErrors(code: string, language: string, errors: string[]): Promise<string> {
    const response = await this.sendMessage([
      {
        role: 'system',
        content: `أنت مساعد برمجي متخصص في إصلاح الأخطاء. قم بإصلاح الأخطاء في الكود.`,
      },
      {
        role: 'user',
        content: `أصلح الأخطاء التالية في هذا الكود:\n\`\`\`${language}\n${code}\n\`\`\`\n\nالأخطاء:\n${errors.join('\n')}`,
      },
    ]);

    return response.message;
  }
}

export const aiService = new AIService();


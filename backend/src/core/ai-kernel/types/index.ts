/**
 * AI Kernel Types Definition
 */

export type AgentType =
  | "EDUCATOR" // وكيل التعليم (الشرح والتبسيط)
  | "DEVELOPER" // وكيل البرمجة (توليد، تصحيح)
  | "OFFICE" // وكيل المستندات (إنشاء ملفات)
  | "EVALUATOR" // وكيل التقييم (تحليل المستوى)
  | "GENERAL"; // دردشة عامة

export type IntentType =
  | "EXPLAIN_TOPIC" // طلب شرح
  | "GENERATE_CODE" // طلب كود
  | "DEBUG_CODE" // تصحيح كود
  | "CREATE_DOCUMENT" // إنشاء ملف
  | "ASSESS_KNOWLEDGE" // طلب اختبار/تقييم
  | "CONTINUE_CONVERSATION" // متابعة السياق السابق
  | "UNKNOWN";

export interface UserContext {
  userId: string;
  sessionId: string;
  lastIntent?: IntentType;
  lastTopic?: string;
  currentSubject?: string; // المادة الحالية (مثلاً: Python, Physics)
  proficiencyLevel: number; // 1-5 (Beginner to Expert)
}

export interface IntentAnalysisResult {
  primaryIntent: IntentType;
  confidence: number; // 0.0 - 1.0
  targetAgent: AgentType;
  entities: {
    topic?: string;
    language?: string;
    fileType?: "word" | "excel" | "powerpoint" | "pdf";
    complexity?: "simple" | "intermediate" | "advanced";
    [key: string]: unknown;
  };
  reasoning: string; // لماذا تم اختيار هذا التصنيف؟
}

export interface MessageInput {
  text: string;
  context: UserContext;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  onToken?: (token: string) => void; // Streaming callback
}

export interface EducatorResponse {
  explanation: string;
  examples: string[];
  interactiveQuestion: {
    question: string;
    options?: string[];
    answerHint?: string;
  };
  mediaRecommendation: "video" | "image" | "diagram" | "none";
  relatedConcepts: string[];
}

export type AgentResponse =
  | EducatorResponse
  | { explanation: string; [key: string]: unknown };

// Conversation History
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

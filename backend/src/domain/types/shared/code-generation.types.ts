/**
 * Code Generation Types - أنواع توليد الكود
 *
 * TypeScript types لتوليد الكود الذكي
 */

/**
 * طلب توليد الكود
 */
export interface CodeGenerationRequest {
  prompt: string;
  language?: string;
  framework?: string;
  context?: string;
  style?: "simple" | "detailed" | "commented" | "minimal";
  include_tests?: boolean;
  include_docs?: boolean;
}

/**
 * استجابة توليد الكود
 */
export interface CodeGenerationResponse {
  code: string;
  language: string;
  framework?: string;
  explanation?: string;
  tests?: string;
  documentation?: string;
  metadata?: {
    estimated_complexity?: "low" | "medium" | "high";
    suggested_improvements?: string[];
    dependencies?: string[];
  };
}

/**
 * طلب تحسين الكود
 */
export interface CodeImprovementRequest {
  code: string;
  language: string;
  improvement_type?:
    | "performance"
    | "readability"
    | "security"
    | "best-practices";
  specific_issues?: string[];
}

/**
 * استجابة تحسين الكود
 */
export interface CodeImprovementResponse {
  improved_code: string;
  original_code: string;
  improvements: Array<{
    type: string;
    description: string;
    line_number?: number;
  }>;
  explanation: string;
}

/**
 * طلب شرح الكود
 */
export interface CodeExplanationRequest {
  code: string;
  language: string;
  detail_level?: "simple" | "detailed" | "comprehensive";
}

/**
 * استجابة شرح الكود
 */
export interface CodeExplanationResponse {
  explanation: string;
  concepts: string[];
  flow: string[];
  complexity: "low" | "medium" | "high";
  suggestions?: string[];
}

/**
 * مشروع الكود المولد
 */
export interface GeneratedProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  language: string;
  framework?: string;
  files: Array<{
    path: string;
    content: string;
    type: "code" | "config" | "documentation" | "test";
  }>;
  created_at: string;
  updated_at: string;
}

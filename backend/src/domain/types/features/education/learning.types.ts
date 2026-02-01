/**
 * Learning Types - أنواع التعلم
 *
 * TypeScript types لمساعد التعلم
 */

/**
 * الدرس - للتعلم
 *
 * يستخدم في مساعد التعلم (Learning Assistant)
 * يختلف عن ContentLesson المستخدم في إدارة المحتوى
 */
export interface LearningLesson {
  id: string;
  subject_id: string;
  grade_level_id: string;
  title: string;
  content?: string;
  order: number;
  difficulty_level?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * شرح الدرس
 */
export interface LessonExplanation {
  lesson_id: string;
  explanation: string;
  language: string;
  style: string;
}

/**
 * مثال على الدرس
 */
export interface LessonExample {
  id: number;
  question: string;
  solution: string;
  explanation: string;
  difficulty: string;
}

/**
 * أمثلة الدرس
 */
export interface LessonExamples {
  lesson_id: string;
  examples: LessonExample[];
  count: number;
}

/**
 * فيديو الدرس
 */
export interface LessonVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  platform: "youtube" | "vimeo";
  channel?: string;
  duration?: number;
  view_count?: number;
}

/**
 * فيديوهات الدرس
 */
export interface LessonVideos {
  lesson_id: string;
  videos: LessonVideo[];
  count: number;
  source: string;
}

/**
 * عقدة Mind Map
 */
export interface MindMapNode {
  id: string;
  label: string;
  type: "root" | "concept" | "subconcept";
}

/**
 * حافة Mind Map
 */
export interface MindMapEdge {
  from: string;
  to: string;
}

/**
 * Mind Map للدرس
 */
export interface LessonMindMap {
  lesson_id: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  format: "json" | "image" | "svg";
}

/**
 * طلب شرح الدرس
 */
export interface ExplanationRequest {
  lesson_id: string;
  language?: string;
  style?: "simple" | "detailed" | "interactive";
}

/**
 * طلب أمثلة الدرس
 */
export interface ExamplesRequest {
  lesson_id: string;
  count?: number;
  difficulty?: "easy" | "medium" | "hard";
  language?: string;
}

/**
 * طلب Mind Map
 */
export interface MindMapRequest {
  lesson_id: string;
  format?: "json" | "image" | "svg";
  language?: string;
}

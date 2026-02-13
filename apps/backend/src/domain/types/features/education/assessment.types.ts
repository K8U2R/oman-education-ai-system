/**
 * Assessment Types - أنواع التقييمات
 *
 * TypeScript types لنظام التقييمات
 */

import type { BaseEntity } from "../../shared/common.types.js";

/**
 * نوع التقييم
 */
export type AssessmentType = "quiz" | "assignment" | "exam" | "project";

/**
 * حالة التقييم
 *
 * يستخدم Status من Common Types مع قيم إضافية
 */
export type AssessmentStatus = "draft" | "published" | "archived";

/**
 * حالة إجابة الطالب
 */
export type SubmissionStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "graded";

/**
 * التقييم
 *
 * يستخدم BaseEntity من Common Types
 */
export interface Assessment extends BaseEntity {
  lesson_id?: string;
  learning_path_id?: string;
  title: string;
  description?: string;
  type: AssessmentType;
  status: AssessmentStatus;
  total_points: number;
  passing_score: number;
  time_limit?: number; // in minutes
  questions: AssessmentQuestion[] | string; // string when stored in DB, array when used in code
  created_by: string;
  due_date?: string;
}

/**
 * سؤال التقييم
 */
export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "essay" | "code";
  points: number;
  options?: string[]; // for multiple choice
  correct_answer?: string | string[];
  explanation?: string;
  order: number;
}

/**
 * إجابة الطالب
 *
 * يستخدم BaseEntity من Common Types
 */
export interface AssessmentSubmission extends BaseEntity {
  assessment_id: string;
  user_id: string;
  status: SubmissionStatus;
  answers:
    | Array<{
        question_id: string;
        answer: string | string[];
        is_correct?: boolean;
        points_earned?: number;
      }>
    | string; // string when stored in DB, array when used in code
  total_score: number;
  percentage: number;
  started_at: string;
  submitted_at?: string;
  graded_at?: string;
  graded_by?: string;
  feedback?: string;
}

/**
 * طلب إنشاء تقييم
 */
export interface CreateAssessmentRequest {
  lesson_id?: string;
  learning_path_id?: string;
  title: string;
  description?: string;
  type: AssessmentType;
  status?: AssessmentStatus;
  total_points: number;
  passing_score: number;
  time_limit?: number;
  questions: Omit<AssessmentQuestion, "id">[];
  due_date?: string;
}

/**
 * طلب تحديث تقييم
 */
export interface UpdateAssessmentRequest {
  title?: string;
  description?: string;
  type?: AssessmentType;
  status?: AssessmentStatus;
  total_points?: number;
  passing_score?: number;
  time_limit?: number;
  questions?: Omit<AssessmentQuestion, "id">[];
  due_date?: string;
}

/**
 * طلب تقديم إجابة
 */
export interface SubmitAssessmentRequest {
  answers: Array<{
    question_id: string;
    answer: string | string[];
  }>;
}

/**
 * إحصائيات التقييم
 */
export interface AssessmentStats {
  total_assessments: number;
  total_submissions: number;
  average_score: number;
  pass_rate: number;
  by_type: Record<AssessmentType, number>;
}

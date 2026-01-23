/**
 * Project Types - أنواع المشاريع
 *
 * TypeScript types لنظام المشاريع التعليمية
 */

import type { BaseEntity } from "./common.types";

/**
 * نوع المشروع
 */
export type ProjectType =
  | "educational"
  | "research"
  | "assignment"
  | "presentation";

/**
 * حالة المشروع
 *
 * يستخدم Status من Common Types مع قيم إضافية
 */
export type ProjectStatus = "draft" | "in_progress" | "completed" | "archived";

/**
 * المشروع
 *
 * يستخدم BaseEntity من Common Types
 */
export interface Project extends BaseEntity {
  title: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  subject?: string;
  grade_level?: string;
  created_by: string;
  due_date?: string;
  progress?: number;
  requirements?: string[] | string; // string when stored in DB, array when used in code
  lessons?: string[] | string; // string when stored in DB, array when used in code
  files?: string[] | string; // string when stored in DB, array when used in code
  reports?: string[] | string; // string when stored in DB, array when used in code
}

/**
 * طلب إنشاء مشروع
 */
export interface CreateProjectRequest {
  title: string;
  description?: string;
  type: ProjectType;
  subject?: string;
  grade_level?: string;
  due_date?: string;
  requirements?: string[];
}

/**
 * طلب تحديث مشروع
 *
 * يستخدم PartialExcept من Common Types لجعل جميع الحقول اختيارية
 */
// import type { PartialExcept } from './common.types'

export interface UpdateProjectRequest extends Partial<
  Omit<Project, "id" | "created_by" | "created_at" | "updated_at">
> {
  title?: string;
  description?: string;
  type?: ProjectType;
  status?: ProjectStatus;
  subject?: string;
  grade_level?: string;
  due_date?: string;
  requirements?: string[];
  progress?: number;
}

/**
 * تقدم المشروع
 */
export interface ProjectProgress {
  project_id: string;
  total_tasks: number;
  completed_tasks: number;
  progress_percentage: number;
  milestones:
    | Array<{
        id: string;
        title: string;
        completed: boolean;
        completed_at?: string;
      }>
    | string; // string when stored in DB, array when used in code
}

/**
 * إحصائيات المشاريع
 */
export interface ProjectStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  by_type: Record<ProjectType, number>;
  average_progress: number;
}

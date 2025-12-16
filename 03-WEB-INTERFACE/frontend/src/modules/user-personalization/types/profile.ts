/**
 * Profile Types
 * أنواع الملف الشخصي
 */

export interface EducationEntry {
  institution: string;
  degree: string;
  field?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface ExperienceEntry {
  company: string;
  position: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  location?: string;
}

export interface AchievementEntry {
  title: string;
  description?: string;
  date?: string;
  issuer?: string;
}


/**
 * Office Types - أنواع ملفات Office
 *
 * TypeScript types لإنشاء ملفات Office
 */

/**
 * نوع ملف Office
 */
export type OfficeFileType = "excel" | "word" | "powerpoint" | "pdf";

/**
 * طلب إنشاء ملف Office
 */
export interface OfficeGenerationRequest {
  type: OfficeFileType;
  template_id?: string;
  data: Record<string, unknown>;
  options?: {
    title?: string;
    author?: string;
    subject?: string;
    language?: "ar" | "en";
    style?: "simple" | "professional" | "academic" | "business";
    include_charts?: boolean;
    include_images?: boolean;
  };
  user_specialization?: string;
  description?: string;
}

/**
 * استجابة إنشاء ملف Office
 */
export interface OfficeGenerationResponse {
  file_id: string;
  file_name: string;
  file_type: OfficeFileType;
  file_size: number;
  file_url?: string; // Alias for download_url
  download_url: string;
  preview_url: string;
  metadata: {
    created_at: string;
  };
  type?: OfficeFileType; // Alias for tests/compatibility
}

/**
 * قالب Office
 */
export interface OfficeTemplate {
  id: string;
  name: string;
  type: OfficeFileType;
  category: string;
  description: string;
  preview_url?: string;
  fields: Array<{
    name: string;
    type: "text" | "number" | "date" | "image" | "table" | "chart";
    required: boolean;
    description?: string;
  }>;
  created_at: string;
  updated_at: string;
}

/**
 * بيانات Excel Sheet
 */
export interface ExcelSheetData {
  name: string;
  headers: string[];
  rows: unknown[][];
  style?: {
    header_color?: string;
    alternate_row_color?: string;
    font_size?: number;
  };
}

/**
 * بيانات Word Document
 */
export interface WordDocumentData {
  title?: string;
  sections: Array<{
    type: "paragraph" | "heading" | "list" | "table" | "image";
    content: unknown;
    style?: Record<string, unknown>;
  }>;
}

/**
 * بيانات PowerPoint Slide
 */
export interface PowerPointSlideData {
  title?: string;
  content: Array<{
    type: "text" | "image" | "chart" | "table";
    data: unknown;
    position?: { x: number; y: number; width: number; height: number };
  }>;
  layout?: "title" | "content" | "two-content" | "blank";
}

/**
 * طلب إنشاء Excel
 */
export interface ExcelGenerationRequest extends OfficeGenerationRequest {
  type: "excel";
  sheets: ExcelSheetData[];
  include_formulas?: boolean;
  include_charts?: boolean;
}

/**
 * طلب إنشاء Word
 */
export interface WordGenerationRequest extends OfficeGenerationRequest {
  type: "word";
  document: WordDocumentData;
  include_table_of_contents?: boolean;
  include_header_footer?: boolean;
}

/**
 * طلب إنشاء PowerPoint
 */
export interface PowerPointGenerationRequest extends OfficeGenerationRequest {
  type: "powerpoint";
  slides: PowerPointSlideData[];
  include_transitions?: boolean;
  include_animations?: boolean;
}

/**
 * مشروع Office المولد
 */
export interface GeneratedOfficeProject {
  id: string;
  user_id: string;
  name: string;
  type: OfficeFileType;
  file_id: string;
  template_id?: string;
  created_at: string;
  updated_at: string;
}

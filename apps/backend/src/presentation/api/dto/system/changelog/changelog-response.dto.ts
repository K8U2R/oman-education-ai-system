/**
 * Data Contract for Changelog Responses.
 * Constitutional Authority: Law-4 (Data Contract Law)
 */
export interface ChangelogResponseDto {
  id: string;
  version: string;
  title: string;
  slug: string;
  summary?: string | null;
  content_html: string;
  category: string;
  status: string;
  is_for_students: boolean;
  is_for_teachers: boolean;
  is_for_developers: boolean;
  published_at?: Date | string | null;
  created_at: Date | string;
  author?: {
    id: string;
    name: string;
  } | null;
  feedback_stats?: {
    reactions: Record<string, number>;
    total_comments: number;
  };
}

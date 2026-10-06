export type ContentType = 'news' | 'movie' | 'social';
export interface ContentItem {
  id: string; type: ContentType; title: string; description: string;
  image?: string; url: string; category?: string; source?: string; publishedAt?: string;
}
export const CATEGORIES = ['technology', 'sports', 'finance', 'health', 'entertainment', 'science'] as const;

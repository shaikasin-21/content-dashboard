import { ContentItem, ContentType, CATEGORIES } from '@/types/content';
import { normalizeMovie, normalizeNews } from './normalize';

const GENRES: Record<string, number> = { technology: 878, sports: 99, finance: 18, health: 99, entertainment: 35, science: 878 };
export const clampPage = (v: unknown) => Math.min(Math.max(parseInt(String(v ?? '1'), 10) || 1, 1), 20);
export const cleanQ = (v: unknown) => String(v ?? '').replace(/[^\p{L}\p{N}\s#_-]/gu, '').trim().slice(0, 100);
export const cleanCat = (v: unknown) => (CATEGORIES as readonly string[]).includes(String(v)) ? String(v) : 'technology';

function mock(type: ContentType, tag: string, page: number, q: string, n = 6): ContentItem[] {
  const names = { news: 'Headline', movie: 'Film', social: 'Post' } as const;
  return Array.from({ length: n }, (_, i) => {
    const k = (page - 1) * n + i + 1;
    return { id: `${type}-mock-${tag}-${k}`, type, title: `${names[type]} ${k}: ${tag} ${q}`.trim(),
      description: `Sample ${type} item about ${tag}. Add API keys in .env.local for live data.`,
      image: `https://picsum.photos/seed/${type}${tag}${k}/600/340`, url: 'https://example.com',
      category: tag, source: type === 'social' ? `@${tag}_fan` : 'Mock', publishedAt: new Date().toISOString() };
  });
}
async function j(url: string) { const r = await fetch(url, { next: { revalidate: 300 } }); if (!r.ok) throw new Error(String(r.status)); return r.json(); }

export async function getNews(category: string, page: number, q: string, trending = false) {
  const key = process.env.NEWS_API_KEY; if (!key) return mock('news', category, page, q);
  const base = q ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=${trending ? 'popularity' : 'publishedAt'}`
    : `https://newsapi.org/v2/top-headlines?category=${category}&country=us`;
  return normalizeNews(await j(`${base}&page=${page}&pageSize=6&apiKey=${key}`), category);
}
export async function getMovies(category: string, page: number, q: string, trending = false) {
  const key = process.env.TMDB_API_KEY; if (!key) return mock('movie', category, page, q);
  const u = q ? `search/movie?query=${encodeURIComponent(q)}` : trending ? 'trending/movie/week?' : `discover/movie?with_genres=${GENRES[category]}`;
  return normalizeMovie(await j(`https://api.themoviedb.org/3/${u}&page=${page}&api_key=${key}`), category).slice(0, 6);
}
export async function getSocial(tags: string[], page: number, q: string) {
  const tag = (tags[0] ?? 'tech').replace('#', '');
  const items = mock('social', tag, page, '');
  return q ? items.map(i => ({ ...i, title: `${i.title} ${q}` })) : items;
}

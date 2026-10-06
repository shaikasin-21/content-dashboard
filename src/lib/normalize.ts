import { ContentItem } from '@/types/content';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const normalizeNews = (r: any, category?: string): ContentItem[] =>
  (r?.articles ?? []).filter((a: any) => a?.title && a?.url).map((a: any, i: number) => ({
    id: `news-${encodeURIComponent(a.url).slice(-40)}-${i}`, type: 'news', title: a.title,
    description: a.description ?? '', image: a.urlToImage ?? undefined, url: a.url,
    category, source: a.source?.name, publishedAt: a.publishedAt }));
export const normalizeMovie = (r: any, category?: string): ContentItem[] =>
  (r?.results ?? []).filter((m: any) => m?.id && m?.title).map((m: any) => ({
    id: `movie-${m.id}`, type: 'movie', title: m.title, description: m.overview ?? '',
    image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : undefined,
    url: `https://www.themoviedb.org/movie/${m.id}`, category, source: 'TMDB', publishedAt: m.release_date }));

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/types/content';

export interface Prefs { categories: string[]; hashtags: string[]; darkMode: boolean; order: string[] }
const prefsInit: Prefs = { categories: ['technology', 'sports'], hashtags: ['#tech'], darkMode: false, order: [] };
export const prefsSlice = createSlice({ name: 'prefs', initialState: prefsInit, reducers: {
  hydrate: (_s, a: PayloadAction<Partial<Prefs>>) => ({ ...prefsInit, ...a.payload }),
  toggleCategory: (s, a: PayloadAction<string>) => { s.categories = s.categories.includes(a.payload) ? s.categories.filter(c => c !== a.payload) : [...s.categories, a.payload]; },
  setHashtags: (s, a: PayloadAction<string[]>) => { s.hashtags = a.payload; },
  toggleDark: s => { s.darkMode = !s.darkMode; },
  setOrder: (s, a: PayloadAction<string[]>) => { s.order = a.payload; },
} });

export const favSlice = createSlice({ name: 'favorites', initialState: { items: [] as ContentItem[] }, reducers: {
  hydrate: (_s, a: PayloadAction<ContentItem[]>) => ({ items: a.payload }),
  toggleFavorite: (s, a: PayloadAction<ContentItem>) => {
    const i = s.items.findIndex(x => x.id === a.payload.id);
    if (i >= 0) s.items.splice(i, 1); else s.items.push(a.payload);
  },
} });

export const uiSlice = createSlice({ name: 'ui', initialState: { query: '' }, reducers: {
  setQuery: (s, a: PayloadAction<string>) => { s.query = a.payload; },
} });

interface Args { page: number; categories: string[]; hashtags: string[]; query: string }
const get = async (u: string, signal: AbortSignal): Promise<ContentItem[]> => {
  const r = await fetch(u, { signal }); if (!r.ok) throw new Error(String(r.status)); return r.json();
};
export const fetchFeed = createAsyncThunk('feed/fetch', async (a: Args, { signal, rejectWithValue }) => {
  const q = encodeURIComponent(a.query), cat = a.categories[0] ?? 'technology';
  const rs = await Promise.allSettled([
    get(`/api/news?category=${cat}&page=${a.page}&q=${q}`, signal),
    get(`/api/movies?category=${cat}&page=${a.page}&q=${q}`, signal),
    get(`/api/social?tags=${encodeURIComponent(a.hashtags.join(' '))}&page=${a.page}&q=${q}`, signal),
  ]);
  if (rs.every(r => r.status === 'rejected')) return rejectWithValue('Could not load content. Check your connection and retry.');
  return rs.flatMap(r => (r.status === 'fulfilled' ? r.value : []));
});
const feedInit = { items: [] as ContentItem[], page: 1, status: 'idle' as 'idle' | 'loading' | 'failed', error: '', hasMore: true };
export const feedSlice = createSlice({ name: 'feed', initialState: feedInit, reducers: { reset: () => feedInit },
  extraReducers: b => b
    .addCase(fetchFeed.pending, s => { s.status = 'loading'; s.error = ''; })
    .addCase(fetchFeed.fulfilled, (s, a) => {
         const seen = new Set(s.items.map(i => i.id));
      for (const i of a.payload) { if (!seen.has(i.id)) { seen.add(i.id); s.items.push(i); } }
      s.status = 'idle'; s.page = a.meta.arg.page + 1; s.hasMore = a.payload.length > 0 && a.meta.arg.page < 10;
    })
    .addCase(fetchFeed.rejected, (s, a) => { if (a.meta.aborted) return; s.status = 'failed'; s.error = String(a.payload ?? 'Something went wrong'); }),
});
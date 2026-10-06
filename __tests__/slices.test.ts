import { favSlice, prefsSlice, feedSlice, fetchFeed } from '@/store/slices';
const item = { id: 'news-1', type: 'news' as const, title: 't', description: '', url: 'u' };
test('toggleFavorite adds then removes', () => {
  let s = favSlice.reducer(undefined, favSlice.actions.toggleFavorite(item));
  expect(s.items).toHaveLength(1);
  s = favSlice.reducer(s, favSlice.actions.toggleFavorite(item));
  expect(s.items).toHaveLength(0);
});
test('toggleCategory and setOrder', () => {
  let s = prefsSlice.reducer(undefined, prefsSlice.actions.toggleCategory('finance'));
  expect(s.categories).toContain('finance');
  s = prefsSlice.reducer(s, prefsSlice.actions.toggleCategory('finance'));
  expect(s.categories).not.toContain('finance');
  expect(prefsSlice.reducer(s, prefsSlice.actions.setOrder(['b', 'a'])).order).toEqual(['b', 'a']);
});
test('feed pending/fulfilled/rejected', () => {
  const arg = { page: 1, categories: [], hashtags: [], query: '' };
  let s = feedSlice.reducer(undefined, fetchFeed.pending('r', arg));
  expect(s.status).toBe('loading');
  s = feedSlice.reducer(s, fetchFeed.fulfilled([item, item], 'r', arg));
  expect(s.items).toHaveLength(1); expect(s.page).toBe(2);
  s = feedSlice.reducer(s, fetchFeed.rejected(null, 'r', arg, 'boom'));
  expect(s.status).toBe('failed'); expect(s.error).toBe('boom');
});

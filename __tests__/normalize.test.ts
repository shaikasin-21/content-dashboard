import { normalizeMovie, normalizeNews } from '@/lib/normalize';
test('news handles missing fields', () => {
  const r = normalizeNews({ articles: [{ title: 'A', url: 'http://x', description: null, urlToImage: null }, { title: null }] });
  expect(r).toHaveLength(1); expect(r[0].description).toBe(''); expect(r[0].image).toBeUndefined();
});
test('movie handles no poster and empty input', () => {
  expect(normalizeMovie({ results: [{ id: 1, title: 'M', overview: 'o' }] })[0].image).toBeUndefined();
  expect(normalizeMovie(null)).toEqual([]);
});

import { NextResponse } from 'next/server';
import { getMovies, getNews, getSocial, cleanCat } from '@/lib/sources';
export async function GET(req: Request) {
  const c = cleanCat(new URL(req.url).searchParams.get('category'));
  const [n, m, s] = await Promise.allSettled([getNews(c, 1, '', true), getMovies(c, 1, '', true), getSocial([c], 1, '')]);
  return NextResponse.json([n, m, s].flatMap(r => (r.status === 'fulfilled' ? r.value : [])));
}

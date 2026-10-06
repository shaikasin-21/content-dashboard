import { NextResponse } from 'next/server';
import { getMovies, clampPage, cleanCat, cleanQ } from '@/lib/sources';
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  try { return NextResponse.json(await getMovies(cleanCat(p.get('category')), clampPage(p.get('page')), cleanQ(p.get('q')))); }
  catch { return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 }); }
}

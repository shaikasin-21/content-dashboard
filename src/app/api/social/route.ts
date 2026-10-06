import { NextResponse } from 'next/server';
import { getSocial, clampPage, cleanQ } from '@/lib/sources';
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const tags = cleanQ(p.get('tags')).split(/\s+/).filter(Boolean);
  return NextResponse.json(await getSocial(tags, clampPage(p.get('page')), cleanQ(p.get('q'))));
}

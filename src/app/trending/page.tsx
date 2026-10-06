'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { CATEGORIES, ContentItem } from '@/types/content';
import Card from '@/components/Card';
import { Empty, ErrorState, Spinner } from '@/components/States';

export default function Trending() {
  const first = useAppSelector(s => s.prefs.categories[0]) ?? 'technology';
  const [cat, setCat] = useState<string>(first);
  const [items, setItems] = useState<ContentItem[] | null>(null), [err, setErr] = useState(false), [n, setN] = useState(0);
  useEffect(() => {
    setItems(null); setErr(false);
    fetch(`/api/trending?category=${cat}`).then(r => { if (!r.ok) throw 0; return r.json(); }).then(setItems).catch(() => setErr(true));
  }, [cat, n]);
  return (<div>
    <div role="tablist" aria-label="Trending category" className="ui mb-4 flex flex-wrap gap-2">{CATEGORIES.map(c => (
      <button key={c} role="tab" aria-selected={c === cat} onClick={() => setCat(c)} className={`rounded-full border border-[var(--line)] px-3 py-1 ${c === cat ? 'bg-[var(--accent)] text-white' : ''}`}>{c}</button>))}</div>
    {err ? <ErrorState text="Could not load trending items." retry={() => setN(n + 1)} /> : !items ? <Spinner /> : !items.length ? <Empty text="Nothing trending right now." /> :
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(i => <Card key={i.id} item={i} />)}</div>}
  </div>);
}

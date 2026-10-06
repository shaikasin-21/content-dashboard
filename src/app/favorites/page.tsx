'use client';
import { useAppSelector } from '@/store';
import Card from '@/components/Card';
import { Empty } from '@/components/States';
export default function Favorites() {
  const items = useAppSelector(s => s.favorites.items);
  return items.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(i => <Card key={i.id} item={i} />)}</div>
    : <Empty text="No favorites yet. Tap the heart on any card to save it here." />;
}

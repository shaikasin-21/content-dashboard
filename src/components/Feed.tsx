'use client';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '@/store';
import { feedSlice, fetchFeed, prefsSlice } from '@/store/slices';
import { ContentItem } from '@/types/content';
import Card from './Card';
import { Empty, ErrorState, Spinner } from './States';

function Sortable({ item }: { item: ContentItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (<div ref={setNodeRef} data-testid="sortable" data-id={item.id} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}>
    <Card item={item} handle={<button {...attributes} {...listeners} aria-label={`Reorder ${item.title}`} data-testid="drag-handle" className="cursor-grab px-1">⠿</button>} /></div>);
}
export default function Feed() {
  const dispatch = useAppDispatch();
  const { items, page, status, error, hasMore } = useAppSelector(s => s.feed);
  const { categories, hashtags, order } = useAppSelector(s => s.prefs);
  const query = useAppSelector(s => s.ui.query);
  const sentinel = useRef<HTMLDivElement>(null);
  const key = categories.join() + hashtags.join() + query;
  const load = useCallback((p: number) => dispatch(fetchFeed({ page: p, categories, hashtags, query })), [dispatch, categories, hashtags, query]);

  useEffect(() => { dispatch(feedSlice.actions.reset()); const t = load(1); return () => { t.abort(); }; }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = sentinel.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && hasMore && status === 'idle' && items.length) load(page); });
    io.observe(el); return () => io.disconnect();
  }, [hasMore, status, items.length, page, load]);

  const sorted = useMemo(() => {
    const rank = new Map(order.map((id, i) => [id, i]));
    return [...items].sort((a, b) => (rank.get(a.id) ?? 1e9) - (rank.get(b.id) ?? 1e9));
  }, [items, order]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const onEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const ids = sorted.map(i => i.id);
    dispatch(prefsSlice.actions.setOrder(arrayMove(ids, ids.indexOf(String(e.active.id)), ids.indexOf(String(e.over.id)))));
  };
  return (<section aria-label="Personalized feed">
    {query && <p className="ui mb-3 text-sm text-[var(--muted)]">Results for “{query}”</p>}
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onEnd}>
      <SortableContext items={sorted.map(i => i.id)} strategy={rectSortingStrategy}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{sorted.map(i => <Sortable key={i.id} item={i} />)}</div>
      </SortableContext>
    </DndContext>
    {status === 'loading' && <Spinner />}
    {status === 'failed' && <ErrorState text={error} retry={() => load(page)} />}
    {status === 'idle' && !items.length && <Empty text={query ? `No results for “${query}”.` : 'No content yet. Pick categories in Settings.'} />}
    {!hasMore && items.length > 0 && <Empty text="You’ve reached the end." />}
    <div ref={sentinel} className="h-4" />
  </section>);
}

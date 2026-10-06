'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { ContentItem } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store';
import { favSlice } from '@/store/slices';

const CTA = { news: 'Read More', movie: 'Play Now', social: 'View Post' } as const;
function Card({ item, handle }: { item: ContentItem; handle?: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const fav = useAppSelector(s => s.favorites.items.some(i => i.id === item.id));
  return (
    <motion.article data-testid="card" whileHover={{ y: -3 }} className="flex h-full flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--card)]">
      {item.image && (/* eslint-disable-next-line @next/next/no-img-element */ <img src={item.image} alt={item.title} loading="lazy" className="h-40 w-full object-cover" />)}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="ui flex items-center justify-between text-xs text-[var(--muted)]"><span>{item.type} · {item.source ?? 'Unknown'}</span>{handle}</div>
        <h2 className="font-bold leading-snug">{item.title}</h2>
        <p className="line-clamp-3 text-sm text-[var(--muted)]">{item.description || 'No description available.'}</p>
        <div className="ui mt-auto flex items-center justify-between pt-2">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="rounded bg-[var(--accent)] px-3 py-1.5 text-sm text-white">{CTA[item.type]}</a>
          <button onClick={() => dispatch(favSlice.actions.toggleFavorite(item))} aria-pressed={fav} aria-label={fav ? 'Remove from favorites' : 'Add to favorites'} className="px-2 text-xl">{fav ? '♥' : '♡'}</button>
        </div>
      </div>
    </motion.article>);
}
export default memo(Card);

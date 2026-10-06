'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { prefsSlice, uiSlice } from '@/store/slices';
import { useDebounce } from '@/hooks/useDebounce';

const links = [['/', 'Feed'], ['/trending', 'Trending'], ['/favorites', 'Favorites'], ['/settings', 'Settings']];
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname(), dispatch = useAppDispatch();
  const dark = useAppSelector(s => s.prefs.darkMode);
  const [open, setOpen] = useState(false), [input, setInput] = useState('');
  const q = useDebounce(input, 500);
  useEffect(() => { dispatch(uiSlice.actions.setQuery(q)); }, [q, dispatch]);
  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <nav aria-label="Main" className={`ui border-r border-[var(--line)] bg-[var(--card)] p-4 md:block ${open ? 'block' : 'hidden'}`}>
        <h1 className="mb-6 text-xl font-bold text-[var(--accent)]">Dashboard</h1>
        <ul className="space-y-1">{links.map(([h, l]) => (
          <li key={h}><Link href={h} onClick={() => setOpen(false)} aria-current={path === h ? 'page' : undefined}
            className={`block rounded px-3 py-2 ${path === h ? 'bg-[var(--accent)] text-white' : 'hover:bg-[var(--bg)]'}`}>{l}</Link></li>))}</ul>
      </nav>
      <div className="flex min-w-0 flex-col">
        <header className="ui flex items-center gap-3 border-b border-[var(--line)] bg-[var(--card)] p-3">
          <button className="md:hidden rounded border border-[var(--line)] px-2 py-1" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
          <input type="search" aria-label="Search content" placeholder="Search news, movies, posts" value={input}
            onChange={e => setInput(e.target.value)} className="flex-1 rounded border border-[var(--line)] bg-[var(--bg)] px-3 py-2" />
          <button onClick={() => dispatch(prefsSlice.actions.toggleDark())} aria-pressed={dark} aria-label="Toggle dark mode"
            className="rounded border border-[var(--line)] px-3 py-2">{dark ? 'Light' : 'Dark'}</button>
          <Link href="/settings" aria-label="Account and settings" className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-white">A</Link>
        </header>
        <AnimatePresence mode="wait">
          <motion.main id="main" key={path} className="p-4 md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>{children}</motion.main>
        </AnimatePresence>
      </div>
    </div>);
}

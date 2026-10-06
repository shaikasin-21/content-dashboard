'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { prefsSlice } from '@/store/slices';
import { CATEGORIES } from '@/types/content';
export default function Settings() {
  const dispatch = useAppDispatch(), { categories, hashtags, darkMode } = useAppSelector(s => s.prefs);
  const [tags, setTags] = useState(hashtags.join(' '));
  return (<div className="ui max-w-xl space-y-6">
    <fieldset><legend className="mb-2 font-semibold">Favorite categories</legend>
      <div className="flex flex-wrap gap-2">{CATEGORIES.map(c => (
        <button key={c} aria-pressed={categories.includes(c)} onClick={() => dispatch(prefsSlice.actions.toggleCategory(c))}
          className={`rounded-full border border-[var(--line)] px-3 py-1 ${categories.includes(c) ? 'bg-[var(--accent)] text-white' : ''}`}>{c}</button>))}</div></fieldset>
    <label className="block"><span className="mb-1 block font-semibold">Social hashtags (space separated)</span>
      <input value={tags} onChange={e => setTags(e.target.value)} onBlur={() => dispatch(prefsSlice.actions.setHashtags(tags.split(/\s+/).filter(Boolean)))}
        className="w-full rounded border border-[var(--line)] bg-[var(--card)] px-3 py-2" /></label>
    <label className="flex items-center gap-2"><input type="checkbox" checked={darkMode} onChange={() => dispatch(prefsSlice.actions.toggleDark())} /> Dark mode</label>
  </div>);
}

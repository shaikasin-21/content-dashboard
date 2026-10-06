'use client';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store, useAppSelector } from '@/store';
import { favSlice, prefsSlice } from '@/store/slices';

function Persist({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const { prefs, favorites } = useAppSelector(s => s);
  useEffect(() => {
    try {
      const p = localStorage.getItem('cd-prefs'), f = localStorage.getItem('cd-favs');
      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
      store.dispatch(prefsSlice.actions.hydrate(p ? JSON.parse(p) : { darkMode: sys }));
      if (f) store.dispatch(favSlice.actions.hydrate(JSON.parse(f)));
    } catch { /* ignore corrupt storage */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem('cd-prefs', JSON.stringify(prefs));
    localStorage.setItem('cd-favs', JSON.stringify(favorites.items));
    document.documentElement.classList.toggle('dark', prefs.darkMode);
  }, [ready, prefs, favorites]);
  return ready ? <>{children}</> : null;
}
export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><Persist>{children}</Persist></Provider>;
}

# Personalized Content Dashboard

Next.js (App Router) + TypeScript + Redux Toolkit + Tailwind v4 + Framer Motion + dnd-kit.

## Features
Unified feed (news, movies, social) with infinite scroll · Trending tabs · Favorites · Debounced search (500 ms, stale requests aborted) · Drag-and-drop reorder (pointer + keyboard) · Dark mode · Settings (categories, hashtags) · localStorage persistence · Loading, empty and error states · Skip link, ARIA labels, reduced-motion support.

## Setup
```bash
npm install
cp .env.example .env.local   # add NEWS_API_KEY (newsapi.org) and TMDB_API_KEY (themoviedb.org)
npm run dev                  # http://localhost:3000
```
Without keys the API routes return mock data, so the app works immediately.

## Scripts
`npm run dev | build | start | test | test:coverage | test:e2e` (first run: `npx playwright install`)

## Architecture
- `src/app/api/*`: server routes proxy NewsAPI/TMDB (keys stay server-side), validate and clamp inputs, return a unified `ContentItem`. Social is a mock API.
- `src/store/slices.ts`: `prefs` (categories, hashtags, dark mode, card order), `favorites`, `feed` (thunk uses `Promise.allSettled` so one failing source does not break the feed), `ui` (search query).
- `providers.tsx` hydrates and persists prefs and favorites in localStorage.
- Tests: `__tests__/` (Jest + RTL: slices, normalizers, debounce, card, feed states) and `e2e/` (Playwright: search, favorites, dark mode, drag-and-drop).

## User flow
Settings (categories, hashtags) → Feed (scroll, reorder) → Search → Favorite → Favorites / Trending.

## Deploy
Import the repo into Vercel and set `NEWS_API_KEY` and `TMDB_API_KEY`.

## Limitations
Mock authentication, i18n and real-time (SSE) bonus features are not included.

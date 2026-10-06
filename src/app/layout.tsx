import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';
import Shell from '@/components/Shell';
export const metadata: Metadata = { title: 'Content Dashboard', description: 'Personalized news, movies and posts' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" suppressHydrationWarning><body>
    <a href="#main" className="sr-only focus:not-sr-only p-2">Skip to content</a>
    <Providers><Shell>{children}</Shell></Providers></body></html>);
}

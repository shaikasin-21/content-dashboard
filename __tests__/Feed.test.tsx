/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import Feed from '@/components/Feed';
beforeAll(() => { (global as any).IntersectionObserver = class { observe() {} disconnect() {} }; });
const wrap = () => render(<Provider store={makeStore()}><Feed /></Provider>);
test('renders cards after fetch', async () => {
  global.fetch = jest.fn(async (u: any) => ({ ok: true, json: async () => String(u).includes('news') ? [{ id: 'n1', type: 'news', title: 'Hello', description: 'd', url: 'u' }] : [] })) as any;
  wrap(); expect(await screen.findByText('Hello')).toBeInTheDocument();
});
test('empty state', async () => {
  global.fetch = jest.fn(async () => ({ ok: true, json: async () => [] })) as any;
  wrap(); expect(await screen.findByText(/No content yet/)).toBeInTheDocument();
});
test('error state with retry', async () => {
  global.fetch = jest.fn(async () => ({ ok: false, json: async () => ({}) })) as any;
  wrap(); const btn = await screen.findByRole('button', { name: 'Retry' });
  const calls = (fetch as jest.Mock).mock.calls.length; fireEvent.click(btn);
  await waitFor(() => expect((fetch as jest.Mock).mock.calls.length).toBeGreaterThan(calls));
});

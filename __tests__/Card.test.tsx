import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import Card from '@/components/Card';
const item = { id: 'movie-1', type: 'movie' as const, title: 'Dune', description: '', url: 'https://x.test' };
test('renders CTA, empty description fallback, and toggles favorite', () => {
  const store = makeStore();
  render(<Provider store={store}><Card item={item} /></Provider>);
  expect(screen.getByText('Play Now')).toHaveAttribute('href', 'https://x.test');
  expect(screen.getByText('No description available.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /add to favorites/i }));
  expect(store.getState().favorites.items).toHaveLength(1);
});

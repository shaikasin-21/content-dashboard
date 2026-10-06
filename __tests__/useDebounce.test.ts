import { act, renderHook } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';
test('debounces value', () => {
  jest.useFakeTimers();
  const { result, rerender } = renderHook(({ v }) => useDebounce(v, 500), { initialProps: { v: 'a' } });
  rerender({ v: 'ab' });
  expect(result.current).toBe('a');
  act(() => { jest.advanceTimersByTime(500); });
  expect(result.current).toBe('ab');
});

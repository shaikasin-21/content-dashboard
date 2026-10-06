export const Spinner = () => <div role="status" aria-label="Loading" className="mx-auto my-6 h-8 w-8 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--accent)]" />;
export const Empty = ({ text }: { text: string }) => <p className="ui py-12 text-center text-[var(--muted)]">{text}</p>;
export const ErrorState = ({ text, retry }: { text: string; retry: () => void }) => (
  <div role="alert" className="ui py-8 text-center"><p className="mb-3">{text}</p><button onClick={retry} className="rounded bg-[var(--accent)] px-4 py-2 text-white">Retry</button></div>);

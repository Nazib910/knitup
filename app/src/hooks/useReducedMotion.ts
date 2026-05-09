import { useEffect, useState } from 'react';

// PRD §12: respect prefers-reduced-motion. Wrap every transform/transition
// animation with this hook so users with vestibular sensitivity get a
// calmer experience.
//
// Returns `true` when the OS-level preference is "reduce". Components
// can check this to drop transforms in favour of opacity-only fades or
// skip animations entirely.

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

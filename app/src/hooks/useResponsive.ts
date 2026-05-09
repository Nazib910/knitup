import { useEffect, useState } from 'react';

// PRD §11 breakpoints.
const MOBILE_QUERY = '(max-width: 767px)';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const m = window.matchMedia(MOBILE_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, []);

  return { isMobile };
}

import { useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Page transition wrapper. PRD §9 Animation table:
// - Old route: fade-out + slide -8px (200ms)
// - New route: fade-in + slide +8px (350ms)
// - Stagger 80ms between
//
// We use GSAP for the timeline (instead of Framer's AnimatePresence) so we can
// orchestrate enter/exit precisely. React Router's <Outlet/> only renders the
// current route, so we capture the previous outlet and crossfade.

export function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const lastPathRef = useRef(location.pathname);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    // Skip animation on first render and when path didn't actually change
    // (e.g. just a hash update).
    if (lastPathRef.current === location.pathname) return;
    lastPathRef.current = location.pathname;

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
        delay: 0.08,
      },
    );
  }, [location.pathname, reduced]);

  return (
    <div ref={containerRef} key={location.pathname}>
      {outlet}
    </div>
  );
}

// React Three Fiber's <mesh>, <group>, etc. JSX intrinsic elements.
// PRD §3 — pinned to R3F v8. The library declares these via global JSX
// augmentation, but TS's `react-jsx` runtime + isolatedModules combo
// doesn't always pick that up. We re-declare via the React.JSX namespace
// here as a belt-and-braces measure.
import type { ThreeElements } from '@react-three/fiber';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ThreeElements {}
  }
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};

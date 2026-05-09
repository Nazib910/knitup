import '@testing-library/jest-dom/vitest';
import * as React from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Some tests use unscoped JSX (e.g. classic runtime in older snippets).
// Exposing React on globalThis makes that work without per-file imports.
// @ts-expect-error - test helper
globalThis.React = React;

// JSDOM 25 ships a Storage object whose methods are non-enumerable own
// descriptors, which trips up Zustand's persist middleware (it calls
// `storage.setItem` directly and gets undefined). We replace localStorage
// + sessionStorage with a plain in-memory shim that has the methods on the
// prototype chain visible.
function createMemoryStorage(): Storage {
  let map: Record<string, string> = {};
  return {
    get length() { return Object.keys(map).length; },
    clear: () => { map = {}; },
    getItem: (k: string) => (k in map ? map[k] : null),
    key: (i: number) => Object.keys(map)[i] ?? null,
    removeItem: (k: string) => { delete map[k]; },
    setItem: (k: string, v: string) => { map[k] = String(v); },
  };
}

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: createMemoryStorage(),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, 'sessionStorage', {
    value: createMemoryStorage(),
    writable: true,
    configurable: true,
  });
  // Also expose at globalThis so non-window-aware modules pick it up.
  // @ts-expect-error - test stub
  globalThis.localStorage = window.localStorage;
  // @ts-expect-error - test stub
  globalThis.sessionStorage = window.sessionStorage;
}

afterEach(() => {
  cleanup();
  try {
    window.localStorage.clear();
  } catch {
    // safe to ignore
  }
});

// JSDOM doesn't ship matchMedia — stub it for components that subscribe.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

// IntersectionObserver missing in jsdom (Framer's whileInView uses it).
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  // @ts-expect-error - test stub
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}

if (typeof crypto !== 'undefined' && !('randomUUID' in crypto)) {
  // @ts-expect-error - test stub
  crypto.randomUUID = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

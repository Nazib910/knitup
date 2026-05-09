import { Spin } from 'antd';

// Suspense fallback for lazily-loaded routes.
export function PageFallback() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: 'calc(100vh - var(--header-h))' }}
      aria-live="polite"
      aria-busy="true"
    >
      <Spin />
    </div>
  );
}

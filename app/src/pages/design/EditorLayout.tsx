import { lazy, Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSilhouette } from '@/hooks/useSilhouettes';
import { useSelectionStore } from '@/store/selection';
import { Breadcrumb } from '@/components/wizard/Breadcrumb';
import { StepIndicator } from '@/components/wizard/StepIndicator';
import { Navigate3DToggle } from '@/components/three/Navigate3DToggle';

// Lazy-import the 3D scene so Three.js only loads on the routes that need it.
// Vite's manualChunks rule (vite.config.ts) keeps three/* in its own bundle.
const GarmentScene = lazy(() =>
  import('@/components/three/GarmentScene').then((m) => ({ default: m.GarmentScene })),
);

// Routes that render WITH a 3D canvas behind them.
const SCENE_ROUTES = new Set([
  '/design/stitch',
  '/design/gauge',
  '/design/color',
]);

// Map route -> step metadata for the breadcrumb.
const STEP_META: Record<string, { name: string; index: number }> = {
  '/design/material': { name: 'Material', index: 2 },
  '/design/construction': { name: 'Construction', index: 3 },
  '/design/stitch': { name: 'Stitch', index: 4 },
  '/design/gauge': { name: 'Gauge', index: 5 },
  '/design/color': { name: 'Color', index: 6 },
  '/design/sizeAndQuantity': { name: 'Size And Quantity', index: 7 },
};

// PRD §6.5: this layout owns the persistent <Canvas/>. The 3D scene mounts
// once when entering the editor flow (Stitch/Gauge/Color) and stays mounted
// across step transitions so the mesh doesn't re-create on every route change.
export default function EditorLayout() {
  const { pathname } = useLocation();
  const silhouetteUuid = useSelectionStore((s) => s.selection.silhouetteUuid);
  const { data: silhouette } = useSilhouette(silhouetteUuid ?? undefined);
  const meta = STEP_META[pathname];
  const wantsScene = SCENE_ROUTES.has(pathname);

  // When leaving 3D routes (e.g. going back to Material), reset Navigate 3D
  // so the toggle isn't left in a weird state.
  useEffect(() => {
    if (!wantsScene) {
      // store import is synchronous; safe to read inside an effect
      import('@/store/scene').then(({ useSceneStore }) =>
        useSceneStore.getState().setNavigate3d(false),
      );
    }
  }, [wantsScene]);

  return (
    <div className="relative min-h-[calc(100vh-var(--header-h))]">
      {/* Top bar: breadcrumb left + step indicator center + Navigate 3D toggle right */}
      <div className="max-w-container mx-auto px-5 pt-2 flex items-start justify-between gap-4">
        <div className="flex-1">
          {meta && (
            <Breadcrumb
              productName={silhouette?.name ?? 'Loading…'}
              stepName={meta.name}
              stepIndex={meta.index}
            />
          )}
        </div>
        {meta && (
          <div className="hidden md:flex items-center pt-9">
            <StepIndicator currentStep={meta.index} />
          </div>
        )}
        {wantsScene && (
          <div className="pt-6 pr-1">
            <Navigate3DToggle />
          </div>
        )}
      </div>

      {/* Persistent Canvas — only rendered on scene routes; component stays
          mounted as we transition between Stitch / Gauge / Color thanks to
          the layout being the route parent. */}
      {wantsScene && (
        <div
          className="absolute inset-x-0 top-[140px] mx-auto pointer-events-auto"
          style={{ width: '100%', maxWidth: '1240px', height: 'min(60vh, 520px)' }}
          aria-hidden="false"
          role="img"
          aria-label="3D preview of selected garment"
        >
          <Suspense fallback={<div className="w-full h-full bg-knitup-bgSoft animate-pulse" />}>
            <GarmentScene />
          </Suspense>
        </div>
      )}

      {/* The actual page content — sits ABOVE the canvas on 3D routes (the
          page renders its swatch carousel at the bottom of the screen). */}
      <div className={`relative ${wantsScene ? 'pt-[calc(140px+min(60vh,520px))]' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

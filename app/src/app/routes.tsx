import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import App from './App';
import { PageFallback } from '@/components/ui/PageFallback';

// Lazy-load page components so the initial bundle stays light.
// Per PRD §3, the editor (Three.js) chunks must be split out.
const HomePage = lazy(() => import('@/pages/marketing/HomePage'));
const StudioPage = lazy(() => import('@/pages/studio/StudioPage'));
const SilhouetteOverview = lazy(() => import('@/pages/design/SilhouetteOverview'));
const MaterialPage = lazy(() => import('@/pages/design/MaterialPage'));
const ConstructionPage = lazy(() => import('@/pages/design/ConstructionPage'));
const StitchPage = lazy(() => import('@/pages/design/StitchPage'));
const GaugePage = lazy(() => import('@/pages/design/GaugePage'));
const ColorPage = lazy(() => import('@/pages/design/ColorPage'));
const SizeAndQuantityPage = lazy(() => import('@/pages/design/SizeAndQuantityPage'));
const EditorLayout = lazy(() => import('@/pages/design/EditorLayout'));
const CollectionPage = lazy(() => import('@/pages/collection/CollectionPage'));
const ProfilePage = lazy(() => import('@/pages/account/ProfilePage'));
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'));
const StorePage = lazy(() => import('@/pages/account/StorePage'));
const AddressPage = lazy(() => import('@/pages/account/AddressPage'));
const ChangePasswordPage = lazy(() => import('@/pages/account/ChangePasswordPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const NotFoundPage = lazy(() => import('@/pages/marketing/NotFoundPage'));
const MarketingStub = lazy(() => import('@/pages/marketing/MarketingStub'));

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<PageFallback />}>{node}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Marketing
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'about/:slug?', element: withSuspense(<MarketingStub kind="about" />) },
      { path: 'sustainability', element: withSuspense(<MarketingStub kind="sustainability" />) },
      { path: 'the-loop', element: withSuspense(<MarketingStub kind="the-loop" />) },
      { path: 'knitup101/:slug?', element: withSuspense(<MarketingStub kind="knitup101" />) },
      { path: 'contact-us', element: withSuspense(<MarketingStub kind="contact" />) },
      { path: 'essentials-vs-atelier', element: withSuspense(<MarketingStub kind="essentials" />) },
      { path: 'terms-and-conditions', element: withSuspense(<MarketingStub kind="terms" />) },
      { path: 'privacy-policy', element: withSuspense(<MarketingStub kind="privacy" />) },

      // Studio (silhouette grid)
      { path: 'design/studio', element: withSuspense(<StudioPage />) },

      // Wizard — overview is standalone, the rest live under EditorLayout
      // so the persistent <Canvas/> survives step transitions (PRD §6.5).
      { path: 'design/silhouette/:uuid', element: withSuspense(<SilhouetteOverview />) },
      {
        path: 'design',
        element: withSuspense(<EditorLayout />),
        children: [
          { path: 'material', element: withSuspense(<MaterialPage />) },
          { path: 'construction', element: withSuspense(<ConstructionPage />) },
          { path: 'stitch', element: withSuspense(<StitchPage />) },
          { path: 'gauge', element: withSuspense(<GaugePage />) },
          { path: 'color', element: withSuspense(<ColorPage />) },
          { path: 'sizeAndQuantity', element: withSuspense(<SizeAndQuantityPage />) },
        ],
      },

      // Collection + Account (visual-only per PRD §17 tension resolution)
      { path: 'design/collection', element: withSuspense(<CollectionPage />) },
      { path: 'design/orders', element: withSuspense(<OrdersPage />) },
      { path: 'design/addAccount', element: withSuspense(<ProfilePage />) },
      { path: 'design/store', element: withSuspense(<StorePage />) },
      { path: 'design/addressBook', element: withSuspense(<AddressPage />) },
      { path: 'design/changePassword', element: withSuspense(<ChangePasswordPage />) },

      // Auth (visual stub)
      { path: 'auth/login', element: withSuspense(<LoginPage />) },
      { path: 'auth/signup', element: withSuspense(<SignupPage />) },

      // 404
      { path: '404', element: withSuspense(<NotFoundPage />) },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

// Convenience for tests
export const Layout = Outlet;

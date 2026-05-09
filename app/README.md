# KnitStudio (replica)

Reference implementation of a 3D-rendered, web-based custom knitwear design studio. Inspired by `home.knitup.io/design/studio` — see `../PRD.md` for the full product spec.

## Highlights

- **Real 3D garment preview** — Three.js r167 + WebGL2, lazy-loaded into the editor chunk
- **7-step wizard** — Silhouette → Material → Construction → Stitch → Gauge → Color → Size & Quantity
- **Persistent guest state** — every selection survives reloads via localStorage
- **My Collection + Cart** — designs are saved automatically, cart drawer slides out from the header
- **Account area** — Profile, Orders, Store (Shopify stub), Address Book, Change Password, Login, Signup
- **Animation polish** — GSAP page transitions, Framer Motion shared-element morphs, animated step indicator, magnetic CTAs, SVG checkmark draw, 3D camera parallax
- **Quality gates** — 33 unit tests + Playwright E2E happy path + axe a11y on 7 routes + Lighthouse perf budget in CI

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| UI | Ant Design 5 + Tailwind CSS |
| 3D | Three.js r167 + @react-three/fiber + @react-three/drei |
| Animation | Framer Motion + GSAP |
| State | Zustand (selection / collection / account / auth / scene / ui) |
| Forms | React Hook Form + Zod |
| Routing | React Router 6 |
| Mock API | MSW (browser) |
| Tests | Vitest + Testing Library + Playwright + axe-core |

## Get started

```bash
npm install
npm run dev      # http://localhost:5173 — MSW intercepts /coreApi/v1/*
npm run build    # production build (typecheck + bundle)
npm run preview  # serve the production build locally
```

## Scripts

| Script | Purpose |
|---|---|
| `dev` | Vite dev server with mock API |
| `build` | TypeScript build + Vite production bundle |
| `preview` | Preview the prod build on port 4173 |
| `lint` | ESLint over `src/` and `tests/` |
| `format` | Prettier write all files |
| `typecheck` | TS project-references build with no emit |
| `test` | Vitest unit tests (single run) |
| `test:watch` | Vitest watch mode |
| `test:e2e` | Playwright E2E + a11y suite |

## Project structure

```
src/
├── api/            # fetch client + typed endpoint wrappers
├── app/            # routes, App shell, AntD theme override
├── components/
│   ├── cart/       # CartDrawer
│   ├── collection/ # CollectionCard
│   ├── footer/     # Footer
│   ├── forms/      # FormField wrapper
│   ├── header/     # Header + Logo
│   ├── studio/     # SilhouetteCard + StudioFilters
│   ├── three/      # GarmentScene, GarmentMesh, Lights, CameraRig, Navigate3DToggle
│   ├── ui/         # PageFallback, ErrorBoundary, MagneticButton, AnimatedCheckmark, PageTransition, SizeTable
│   └── wizard/     # Breadcrumb, StepIndicator, SwatchCarousel, AllSwatchesModal
├── hooks/          # useSilhouettes, useMaterials, useStitchesColors, useResponsive, useReducedMotion, useWizardGuard
├── lib/            # schemas.ts (Zod)
├── mocks/          # MSW handlers + JSON fixtures
├── pages/
│   ├── account/    # Profile, Orders, Store, Address, ChangePassword, AccountShell
│   ├── auth/       # Login, Signup
│   ├── collection/ # CollectionPage
│   ├── design/     # EditorLayout + 7 wizard step pages
│   ├── marketing/  # HomePage, MarketingStub, NotFoundPage
│   └── studio/     # StudioPage
├── store/          # Zustand stores (selection, collection, account, auth, scene, ui)
└── types/          # domain types
```

## Testing

- `npm run test` — runs all 33 unit tests in <10s
- `npm run test:e2e` — boots Vite, walks the full wizard, scans 7 pages with axe-core
- CI: `.github/workflows/ci.yml` runs typecheck → unit → build → install Playwright browsers → E2E

## Deploy

Pushed to **Vercel** — `vercel.json` ships a SPA fallback rewrite so client-side routes resolve.

```bash
npx vercel --prod   # one-off deploy from local
```

For preview deploys per PR, connect the repo to a Vercel project; auto-detected as Vite.

## Not in v0 (per PRD §17)

- Real auth (visual stub via `useAuthStore` only)
- Real Stripe checkout
- Real Shopify Storefront API integration
- Real GLB garment models (procedural placeholder mesh)
- Knitting-machine GCode export
- i18n (English only)

See `../PRD.md` for the canonical scope and v0.x roadmap.

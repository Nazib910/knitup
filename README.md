# KnitStudio replica workspace

A faithful reference replica of `home.knitup.io/design/studio` — a web-based, 3D-rendered custom knitwear design studio.

This workspace contains:

| Path | Purpose |
|---|---|
| **`PRD.md`** | The product requirements document — vision, tech stack, page specs, animation specs, mock API contract, testing strategy, milestones (P0–P9) |
| **`app/`** | The replica codebase — React 18 + Vite + TS + Three.js + Ant Design 5 |
| **`app/README.md`** | App-level docs — scripts, structure, testing, deploy |
| `knitup_*.png` / `knitup_*.yml` | Live-audit reference artifacts captured from the original site (used to verify visual parity) |
| `.github/workflows/ci.yml` | CI pipeline — runs typecheck, unit tests, build, and Playwright E2E on every PR |

## Quick start

```bash
cd app
npm install
npm run dev          # http://localhost:5173
```

## Reading order

1. **`PRD.md`** — the source of truth. Read §1 (vision), §3 (tech stack), §6 (page-by-page specs), §15 (milestones) first.
2. **`app/README.md`** — scripts, project structure, deploy.
3. **`app/src/`** — explore the codebase. Start with `src/app/routes.tsx` to see all routes, then dive into any page that catches your interest.

## Build status

| Phase | Highlight | Status |
|---|---|---|
| **P0** | Scaffolding, deps, configs, all 16 routes, deploy config, CI | ✅ |
| **P1** | Marketing + Studio + Silhouette overview + responsive + Framer shared-element | ✅ |
| **P2** | Material carousel + Construction 3-card + Size & Quantity | ✅ |
| **P3** | EditorLayout + persistent R3F Canvas + procedural pullover + scene store + Navigate 3D toggle | ✅ |
| **P4** | 20 stitches + 54 colors + reusable SwatchCarousel + AllSwatchesModal + camera polish | ✅ |
| **P5** | My Collection + per-card actions + CartDrawer + header badge + Edit/Delete | ✅ |
| **P6** | Account pages (Profile/Orders/Store/Address/Password) + Login/Signup with RHF + Zod | ✅ |
| **P7** | Animation polish — GSAP page transitions, StepIndicator, MagneticButton, AnimatedCheckmark, scroll shadow, 3D parallax | ✅ |
| **P8** | Vitest + Playwright + axe-core + CI integration (33 unit tests + E2E + a11y) | ✅ |
| **P9** | Hardening — ErrorBoundary, .gitignore, README polish, Lighthouse, final verification | ✅ |

## Live audit reference

The screenshots prefixed `knitup_*.png` were captured from the actual Knitup studio via Playwright MCP during the audit phase. They serve as visual parity targets — see `PRD.md` §18 for the full inventory.

| Original | Replica equivalent |
|---|---|
| `knitup_studio_full.png` | `/design/studio` |
| `knitup_silhouette_overview.png` | `/design/silhouette/:uuid` |
| `knitup_step2_material.png` | `/design/material` |
| `knitup_step3_construction.png` | `/design/construction` |
| `knitup_step4_stitch.png` | `/design/stitch` |
| `knitup_step5_gauge.png` | `/design/gauge` |
| `knitup_step6_color.png` | `/design/color` |
| `knitup_step7_size_quantity.png` | `/design/sizeAndQuantity` |
| `knitup_step7_3d_mode.png` | `/design/sizeAndQuantity` (3D toggle on) |
| `knitup_collection.png` | `/design/collection` |
| `knitup_user_dropdown.png` | header user dropdown |

## Disclaimer

This is a reference / educational replica. The KnitStudio brand and all UI in this repo are placeholder; no Knitup name or logo is used in the running app. See PRD §17 Q6 for the branding decision.

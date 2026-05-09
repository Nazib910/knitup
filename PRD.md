# PRD — Knitup Studio Replica

> Replica of `https://home.knitup.io/design/studio` — a 3D-rendered, web-based custom knitwear design studio.

| Field | Value |
|---|---|
| **Product name** | Knitup Studio Replica (working title) |
| **Owner** | (you) |
| **Version** | 0.1 — initial draft |
| **Status** | **Approved — decisions locked 2026-05-09 evening** |
| **Last updated** | 2026-05-09 (post-decisions) |
| **Source of truth** | Live audit of `home.knitup.io` performed via Playwright MCP on 2026-05-09 |

---

## 1. Problem Statement & Vision

Custom knitwear design tools are typically desktop CAD apps used by manufacturers — they are not accessible to designers, indie brands, or end consumers. Knitup proves an in-browser **3D real-time design wizard** can let anyone customise a garment (silhouette → yarn → construction → stitch → gauge → color → size & quantity) and place a manufacturing order in minutes.

**Our replica** rebuilds that experience as a faithful, production-grade reference application that:

- Renders garments in real-time **WebGL2 / Three.js** (not flat 2D mockups)
- Walks the user through a **7-step linear wizard** with persistent state
- Supports **guest sessions** (no signup required to design)
- Provides a **My Collection** persistence layer + Add-to-Cart + Shopify "Add to Store" flow
- Mirrors the original's clean, minimal aesthetic (Manrope typography, near-monochrome palette, generous whitespace)

**Out of scope (v1):** real manufacturing fulfilment, real Stripe charging, real Shopify OAuth integration. These will be **stubbed** with mock APIs so the UX is end-to-end-functional.

---

## 2. Goals & Non-Goals

### 2.1 Goals
1. **Visual parity ≥ 95%** with the live Knitup studio at desktop (1440 × 900) and mobile (390 × 844).
2. **Functional parity** for the entire 7-step wizard: any selection at any step updates the 3D mesh in real time.
3. **State persists** across page reloads (guest session via `localStorage` + mock backend `coreApi/v1/user/guestUser`).
4. **Mobile responsive** with the documented adaptations: header collapse, sidebar → "Filters" button, grid 4 cols → 2 cols.
5. **Animation richness** beyond the original: introduce **GSAP**-driven page transitions, **Three.js camera tweens**, and **Framer Motion** layout animations (React) or `<Transition>` (Vue) where the original's CSS-only transitions feel flat.
6. **Accessibility**: WCAG 2.1 AA — keyboard-navigable wizard, focus rings on Ant components, alt text on all silhouette/material thumbnails, `aria-current="step"` on the breadcrumb.
7. **Performance budgets**:
   - Studio (catalogue page) — LCP < 2.0 s on simulated Fast 3G, TTI < 3.5 s
   - Editor steps with 3D — first 3D frame painted < 1.5 s after step mount; sustained 60 fps on M1/Pixel 7-class device
   - JS bundle: initial route ≤ 250 kB gzipped; Three.js + GLTF loader code-split into `/design/Stitch` chunk

### 2.2 Non-Goals
- Real payment processing, real order fulfilment, real Shopify OAuth
- Knitting-machine GCode export
- Multi-tenant brand portal, admin CMS for editing silhouettes/materials
- Native mobile apps
- Internationalization (English only in v1; structure should allow i18n later)

---

## 3. Tech Stack (decided)

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | **React 18 + Vite + TypeScript** | Modern alternative to original's Vue 3; richer animation ecosystem (R3F + Framer Motion + GSAP) |
| **3D engine** | **Three.js r167** + **@react-three/fiber** + **@react-three/drei** | Same engine version as original; declarative R3F is faster to build & maintain |
| **3D models** | GLB/GLTF with Draco compression; one base mesh per silhouette (10 garments) | Matches industry standard; ~200–500 kB per garment |
| **Animations (UI)** | **Framer Motion** for layout / exit / shared-element transitions; **GSAP** for orchestrated page-transition timelines and 3D-camera tweens | Best-of-both; Framer for declarative, GSAP for timeline control |
| **UI library** | **Ant Design 5** (React port of original's Ant Design Vue) | Same look-and-feel, same components (Btn / Carousel / Dropdown / Modal) |
| **Styling** | **Tailwind CSS** + CSS variables for design tokens | Matches utility classes seen in source (`flex-auto`, `mt-44px`, `cursor-pointer`) |
| **State** | **Zustand** (lightweight, serializable, devtools) | Simpler than Redux; persists wizard state to `localStorage` |
| **Routing** | **React Router 6** | 7-step wizard + standard pages |
| **Form / validation** | **React Hook Form** + **Zod** | Account profile, address book, qty steppers |
| **Mock backend** | **MSW (Mock Service Worker)** for dev + **Express stub** for E2E | Mirrors `/coreApi/v1/*` shape exactly |
| **Image CDN** | local `/public/silhouettes/*.png` for v1 | Replace with `prd-resource.knitup.io` shape later |
| **Testing** | **Vitest** (unit) + **Playwright** (E2E) + **Storybook** (visual review) | Mirror tools we used in this audit |
| **Lint / format** | ESLint + Prettier + commitlint | Standard |
| **CI** | GitHub Actions: typecheck → lint → unit → E2E → build size check | Block merge on regression |

> ✅ **LOCKED:** React 18 + Vite + TS + R3F selected (see §17).

---

## 4. Information Architecture & Routes

| Route | Page | Auth | 3D? |
|---|---|---|---|
| `/` | Marketing homepage | guest | no |
| `/design/studio` | **Studio** — silhouette grid + filters | guest | no |
| `/design/silhouette/:uuid` | **Step 1** — Silhouette overview (preview + size table + Customise CTA) | guest | no |
| `/design/material` | **Step 2** — Yarn material carousel ($–$$$$$ tiers) | guest | no |
| `/design/construction` | **Step 3** — Construction type (Graphic Jacquard / Stitch Pattern / Embroidery) | guest | no |
| `/design/stitch` | **Step 4** — Stitch swatch picker (~20 swatches) | guest | **Three.js mounts** |
| `/design/gauge` | **Step 5** — Gauge picker (12GG / 7GG / 5GG) | guest | Three.js (persisted) |
| `/design/color` | **Step 6** — Color swatch picker (~54 swatches) | guest | Three.js (persisted) |
| `/design/sizeAndQuantity` | **Step 7** — Size table + qty + pricing tiers + Add to Cart | guest | optional toggle |
| `/design/collection` | **My Collection** — saved designs (works for guest, persists to `localStorage` + mock API) | guest+ | per card thumbnail |
| `/design/orders` | Order History | **auth required** | no |
| `/design/store` | Shopify-linked Store | **auth required** | no |
| `/design/addAccount` | Account Profile | **auth required** | no |
| `/design/addressBook` | Address Book | **auth required** | no |
| `/design/changePassword` | Change Password | **auth required** | no |
| `/auth/login`, `/auth/signup` | Auth pages (modal-style routed) | guest | no |
| `/about/*`, `/sustainability`, `/the-loop`, `/knitup101/*`, `/contact-us`, `/terms`, `/privacy` | Marketing/legal stubs (placeholder pages) | guest | no |
| `/404` | Not found | — | no |

### 4.1 Wizard navigation rules
- Linear progression; each step has a **breadcrumb** (`← Step Name`, `Step N of 7`) at top-left.
- Clicking the back-arrow returns to previous step **without losing state**.
- The **Continue / Customise** primary CTA is disabled until a valid selection is made for the current step.
- Direct URL entry to a later step *with no upstream selections* should redirect back to the earliest unfilled step (with a toast: "Please complete previous steps").
- Step 7 emits a "Design Saved" toast on entry and persists the design to My Collection.

---

## 5. Design Tokens

Extracted live from `:root` and computed styles on the source site:

```css
:root {
  /* Colors */
  --knitup-gray:        #393939;  /* primary text, logo, primary CTA bg */
  --knitup-lighter:     #dedede;  /* card bg, dividers */
  --knitup-light:       #b2b2b2;  /* muted text, breadcrumb crumb */
  --knitup-m-gray:      #b5b5b5;  /* placeholder, disabled */
  --knitup-bg:          #ffffff;  /* page background */
  --knitup-bg-soft:     #f5f5f5;  /* preview frame background */
  --knitup-text:        rgba(0, 0, 0, 0.65);  /* body text */
  --knitup-accent:      #393939;  /* selection ring on swatches */

  /* Typography */
  --font-body:          "Manrope", system-ui, sans-serif;
  --font-display:       "NexaBold", "Manrope", sans-serif;
  --font-base-size:     14px;
  --font-h1:            40px;
  --font-h2:            32px;
  --font-h3:            24px;

  /* Layout */
  --header-h:           88px;
  --container-max:      1240px;
  --gutter:             20px;
  --sidebar-w:          248px;
  --round-btn:          48px;     /* header circular icon buttons */

  /* Radii */
  --radius-pill:        100px;    /* buttons, chips, swatches */
  --radius-card:        4px;
  --radius-input:       2px;      /* Ant Design default */

  /* Motion */
  --ease:               cubic-bezier(0.645, 0.045, 0.355, 1);  /* Ant default */
  --dur-fast:           150ms;
  --dur:                300ms;
  --dur-slow:           500ms;
}
```

---

## 6. Page-by-Page Specs

For each page below: layout sketch (ASCII), components, interactions, responsive rules, animations.

### 6.1 Studio — `/design/studio`

```
┌────────────────────────────────────────────────────────────────┐
│ HEADER (fixed, 88px, white, full-width)                        │
│  Logo (knitup, left)              [🪑] [🛒] [👤] (round 48px) │
├──────────────┬─────────────────────────────────────────────────┤
│ SIDEBAR 248  │ MAIN (flex-auto)                                │
│  Title       │  4-col grid of silhouette cards (gap 24px)      │
│  Search 🔍   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                    │
│  Categories  │  │img │ │img │ │img │ │img │  (186×186 px img,  │
│   ○ All      │  │name│ │name│ │name│ │name│   white card,     │
│   ○ Women    │  └────┘ └────┘ └────┘ └────┘   caption below)  │
│   ○ Men      │  …                                              │
│   ○ Unisex   │                                                 │
│   ○ Kids     │                                                 │
│   ○ Accessor.│                                                 │
│   ○ Petwear  │                                                 │
│   ○ Homeware │                                                 │
└──────────────┴─────────────────────────────────────────────────┘
```

**Interactions:**
- Hover card → image scales `transform: scale(1.04)`, transition 300ms `var(--ease)` (subtle lift)
- Click card → navigate to `/design/silhouette/:uuid`, **shared-element transition** of card image into the overview's preview slot (Framer Motion `layoutId`)
- Sidebar radio selects category → grid **filter animation**: stagger fade-in items (Framer Motion `<AnimatePresence>`)
- Search debounce 200 ms, fuzzy match silhouette names

**Responsive:**
- < 1024 px: sidebar collapses into a "Filters" button (top-left), opens as a left drawer (Ant Drawer)
- < 768 px: grid drops to **2 columns**
- < 480 px: 1 column with horizontal padding 12 px

### 6.2 Silhouette Overview — `/design/silhouette/:uuid`

```
┌───────── HEADER ─────────┐
│ Crumb: ← Silhouette  Step 1 of 7                              │
│ Title: "Men's Oversized Crew Neck Pullover" (40px display)    │
├──────────────────────────────────┬────────────────────────────┤
│ LEFT (preview frame, bg #f5f5f5) │ RIGHT (info column)        │
│  ┌────────────────────────┐      │  H1: silhouette name        │
│  │                        │      │  P:  description (3–4 ln)   │
│  │   Garment PNG          │      │                             │
│  │   500×500             │      │  [ Customise ] (primary CTA)│
│  └────────────────────────┘      │                             │
├───────────────────────────────────┴────────────────────────────┤
│ Below the fold: SIZE TABLE (left) + DIAGRAM (right)            │
│  cm|in toggle, sortable rows XXS→XXXL × Length/Chest/Shoulder/ │
│  Sleeve/BottomOpening                                          │
└────────────────────────────────────────────────────────────────┘
```

**Animations:**
- On enter: garment PNG fades up 20 px (Framer `initial={{opacity:0,y:20}}`, 600 ms)
- Customise CTA hover: lift `-2px` + shadow blur expand
- cm/in toggle: numbers animate via GSAP `to` with `roundProps`

### 6.3 Material — `/design/material`

```
HEADER + crumb (Step 2 of 7)
─────────────────────────────────────────────
[<]  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  [>]
     │ Bliss│ │ Vibes│ │Dreams│ │Desire│ │ Luxe │
     │  $   │ │  $$  │ │  $$$ │ │ $$$$ │ │ $$$$$│
     └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
     BCI Cot  Recyc Vis Merino W Extrafine TheGood
     5-Color  5-Color  5-Color  3-Color   2-Color
```

**Components:** horizontal carousel (Swiper or embla-carousel-react), each card 295 × 380 px with full-bleed yarn close-up image, tier name + sub-name + price tier badge (`$` to `$$$$$`).

**Animations:**
- Carousel slide transition: GSAP timeline ease-out 600 ms
- Hover card: tier-name underline draws left→right (`scaleX 0→1`)
- Click → primary border ring + GSAP carousel-snap-to-center

### 6.4 Construction — `/design/construction`

3 large image cards in a row (Graphic Jacquard / Stitch Pattern / Embroidery). On click → routes to next step. Each card image fills 480 × 485 px, caption below (bold name + 2-line description). Hover: image zoom 1.04 + dim overlay reveal.

### 6.5 **Stitch — `/design/stitch` ⭐ first 3D step**

```
HEADER + crumb (Step 4 of 7)                       [🪑] Navigate 3D
─────────────────────────────────────────────────────────────────
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              <canvas id="threejs">  1240 × 459              │
│                  Three.js r167 / WebGL2                     │
│                  Garment GLB rendered with                  │
│                  selected stitch material                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
[<] (○)(○)(○)(●)(○)(○)(○)(○)(○) [▦] [>]   ← swatch carousel
                                              ▦ = "all swatches" grid
                       [   Continue   ]   ← appears after selection
```

**3D scene spec:**
- `<Canvas>` from R3F mounted in a div wrapper; preserves between Stitch / Gauge / Color via React Router `outlet` parent that owns the scene
- Scene: 1× directional light (key, top-front, intensity 1.4), 1× ambient (intensity 0.6), 1× rim light (back-left, intensity 0.8)
- Camera: PerspectiveCamera 35° FOV, position `(0, 0.5, 4)`, looking at origin
- Mesh: GLB pullover with PBR material; stitch swatch image becomes `material.map` (repeating texture, anisotropy 16, sRGB)
- **AutoRotate:** disabled by default; only enabled while user holds the **Navigate 3D** toggle (turns on `OrbitControls` + a subtle bounce-in animation on the toggle pill)
- **Navigate 3D mode:** OrbitControls (drag-rotate, scroll-zoom, two-finger pan); on exit, camera tweens back to home pose via GSAP (`gsap.to(camera.position, { x:0, y:0.5, z:4, duration: 0.6, ease: "power2.out" })`)

**Carousel:** Swiper 'slide' effect, `slidesPerView: 9`, `centeredSlides: true`, navigation arrows, last slot = "view all" grid icon → opens an `Ant Modal` showing all stitches in a 6-col grid.

**Selection feedback:** clicked swatch gets a 2 px solid `var(--knitup-accent)` border ring + transform-origin center scale 1.08 (Framer `whileTap`). The 3D mesh's texture cross-fades over 250 ms via a custom shader uniform `uMix` tweened with GSAP.

### 6.6 Gauge — `/design/gauge`

Same shell as Stitch (3D scene persists). Bottom shows 3 round options:
- `12GG` / Finer
- `7GG` / Average
- `5GG` / Coarser

Each is a 96 × 96 px outlined circle. Selected → fill `var(--knitup-gray)`, text white, GSAP `scale 1 → 1.1 → 1` bounce. Gauge change updates the texture's `repeat` UV (finer = higher repeat count).

### 6.7 Color — `/design/color`

Same shell as Stitch. ~54 color swatches in carousel (each is a circular fabric texture, not flat color — to show how the yarn actually looks). Click → 3D mesh material color tweens via GSAP from current `material.color` to new `THREE.Color` over 350 ms.

### 6.8 Size & Quantity — `/design/sizeAndQuantity` (final step)

Two-column layout:
- **Left:** toggle pill `Measurements ⇄ 3D Rendering` — toggling switches the left-pane between (a) the silhouette diagram with size labels and (b) the live Three.js render (re-using same scene state). Below the preview: pricing tiers (1–19 / 20–99 / 100+ pcs with USD/pc).
- **Right:** size table with qty steppers per size + cm/in toggle. Bottom: `Details` link, `Sub-total / Embroidery Tape / Total Price`, primary `Add to Cart` (disabled until total qty > 0).

**Animations:**
- "Design Saved" toast slides in from top (GSAP, 400 ms, auto-dismiss 5 s, Ant Notification component)
- Quantity stepper: number flips with Framer Motion `<AnimatePresence mode="popLayout">` per digit
- Total Price recomputes with a 200 ms count-up tween (GSAP `gsap.to({val:0}, {val:price, onUpdate:...})`)

### 6.9 My Collection — `/design/collection`

Sidebar `My Account` (active = Collection) + same category filters + `Added to Store` toggle. Main: 2–3 col card grid; each card has:
- Header row: design name + ($ icon for pricing details) + ✏️ edit icon
- Sub-line: `Material | Construction | Color | Gauge`
- Image carousel (4-dot pagination) showing front/back/side views or color variants
- Action row: `[🛒 Add to Cart]  [🛍️ Add to Store]`
- Footer: `Expires: <date>` (designs auto-expire 6 months after creation), `Created: <date>`

Animations: card hover lift, edit-icon morphs to "open" on hover, carousel auto-advance disabled (manual only).

### 6.10 Auth (Login / Sign Up)

Ant Design `Modal` (or routed `/auth/login` for direct link). Tabs: `Log In | Sign Up`. Email + password fields, social login buttons (Google, optional Apple) — for v1 these are visual stubs that hit our mock auth endpoint. Animate modal entrance with Framer scale 0.96 → 1 + opacity, 250 ms.

### 6.11 User Dropdown (header)

Ant Design `Dropdown` triggered by header user icon. Menu differs by auth state:
- **Guest:** `My Collection` / `Sign Up` / `Log In`
- **Authed:** `Account Profile` / `Order History` / `My Collection` / `Store` / `Address Book` / `Change Password` / `--` / `Log Out`

Animation: dropdown enters with Framer `scaleY 0.95 → 1 + opacity`, origin top.

---

## 7. Mock API Contract (`/coreApi/v1/*`)

Mirrors live shapes inferred from network panel during audit. All requests are JSON; auth via `Authorization: Bearer <token>` (or `X-Guest-Id: <uuid>` for guests).

| Endpoint | Method | Purpose | Sample response |
|---|---|---|---|
| `/coreApi/v1/user/guestUser` | POST | Create guest session, returns `{ guestId, token }` | `{"guestId":"…uuid…","token":"…jwt…"}` |
| `/coreApi/v1/silhouette/list` | GET `?category=Men` | List silhouettes | `[{uuid, name, category, thumb, description, sizeTable:[…]}]` |
| `/coreApi/v1/silhouette/:uuid` | GET | Single silhouette | `{uuid, name, description, glb, sizes, defaultMaterials}` |
| `/coreApi/v1/category/list` | GET | Category list (sidebar) | `[{key, label, count}]` |
| `/coreApi/v1/material/list` | GET `?silhouette=:uuid` | Yarn materials available for silhouette | `[{tier, name, subName, priceTier, swatchUrl, description}]` |
| `/coreApi/v1/construction/list` | GET | Construction types | `[{key, label, description, image}]` |
| `/coreApi/v1/stitch/list` | GET `?material=:tier` | Stitch swatches for material | `[{uuid, name, swatchUrl, textureUrl, repeat:{u,v}}]` |
| `/coreApi/v1/color/list` | GET `?material=:tier` | Color swatches | `[{uuid, name, swatchUrl, hex, fabricTextureUrl}]` |
| `/coreApi/v1/embroidery_price_tier/list` | GET | Embroidery pricing tiers | `[{minPcs, pricePerCm2}]` |
| `/coreApi/v1/notice/list` | GET | Top-of-page notices/banners | `[{id, type, message, dismissible}]` |
| `/coreApi/v1/design` | POST | Save current design (auto-called on Step 7 entry) | `{designId, expiresAt}` |
| `/coreApi/v1/design/list` | GET | My Collection | `[{designId, name, thumbnail, material, construction, color, gauge, createdAt, expiresAt}]` |
| `/coreApi/v1/cart` | GET / POST / DELETE | Cart contents | `{items:[{designId, qtyBySize, totalUsd}]}` |

All endpoints **mocked via MSW** in dev with realistic JSON in `/mocks/fixtures/`.

---

## 8. State Model (Zustand)

```ts
type Selection = {
  silhouetteUuid: string | null;
  materialTier:  'Bliss' | 'Vibes' | 'Dreams' | 'Desires' | 'Luxe' | null;
  constructionKey: 'graphicJacquard' | 'stitchPattern' | 'embroidery' | null;
  stitchUuid:    string | null;
  gauge:         '12GG' | '7GG' | '5GG' | null;
  colorUuid:     string | null;
  qtyBySize:     Record<'XXS'|'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL', number>;
  unit:          'cm' | 'in';
};

type Store = {
  guestId: string;
  authUser: AuthUser | null;
  selection: Selection;
  collection: Design[];
  cart: CartItem[];
  setSelection: (patch: Partial<Selection>) => void;
  reset: () => void;
  hydrate: () => Promise<void>;   // load from localStorage + ping /guestUser
};
```

Persisted to `localStorage` under key `knitup.replica.v1`. Migration strategy: top-level `_v` field; on mismatch, drop and re-init.

---

## 9. Animation Specs (master list)

| Surface | Library | Trigger | Spec |
|---|---|---|---|
| Page transitions (between routes) | **GSAP** + React Router | Route change | Old route fade-out + slide -8 px (200 ms), new route fade-in + slide +8 px (350 ms), staggered 80 ms |
| Card hover (Studio grid, Material carousel) | Framer Motion | `whileHover` | `scale: 1.04`, shadow blur +12 px, 250 ms ease-out |
| Shared-element silhouette → overview | Framer Motion | Click silhouette card | `layoutId="silhouette-{uuid}"` morphs card image into overview preview, 600 ms |
| Carousel slide | Swiper | Drag / arrow click | Default Swiper ease, 400 ms |
| Stitch / color swatch select | Framer + GSAP | Click | Border ring fade-in 150 ms; texture cross-fade on mesh via shader `uMix` tween 250 ms |
| 3D mesh color change | GSAP | Color swatch click | `THREE.Color` lerp 350 ms |
| Camera home reset (after Navigate 3D off) | GSAP | Toggle off | `gsap.to(camera.position, {x:0, y:0.5, z:4, duration:0.6, ease:"power2.out"})` |
| Gauge change | GSAP | Click | UV repeat tween + 200 ms scale bounce on the option pill |
| "Design Saved" toast | GSAP + Ant Notification | Step 7 mount | Slide-in top, dwell 5 s, slide-out |
| Quantity stepper digit | Framer Motion | qty change | Per-digit slide-up 200 ms with `mode="popLayout"` |
| Total price count-up | GSAP | Subtotal recompute | 200 ms `roundProps:'val'` |
| Modal entrance (Login/Signup, "All Stitches" grid) | Framer | Open | `scale 0.96→1 + opacity` 250 ms |
| Dropdown menu | Framer | Hover/focus on user icon | `scaleY 0.95→1 + opacity`, origin top, 180 ms |
| Reduced-motion support | All libs | `@media (prefers-reduced-motion: reduce)` | Replace transforms with opacity-only fades; disable GSAP timelines longer than 200 ms |

---

## 10. 3D Asset Pipeline

10.1 **Models**: 10 base silhouettes as GLB with Draco compression. Each ≤ 500 kB. Authored in Blender; exported with `gltfpack -cc -kn`.

10.2 **Stitch textures**: 20 seamless tileable PNGs at 1024×1024. Stored in `/public/textures/stitch/{uuid}.webp`. Compressed to ≤ 150 kB each.

10.3 **Color swatches**: 54 fabric close-up PNGs at 256×256 (for swatch UI) + 54 paired tileable textures at 512×512 (for mesh). Stored in `/public/textures/color/`.

10.4 **Lighting/HDRI**: single `.hdr` environment map (256×128, ~30 kB) for soft studio lighting.

10.5 **Loaders**: GLTFLoader + DRACOLoader from Three.js examples; lazy-imported inside the `/design/stitch` route chunk so the catalogue page stays lightweight.

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Adaptations |
|---|---|---|
| `xs` | < 480 | 1-col grid, collapsed header (logo only + hamburger), padding 12 px |
| `sm` | 480–767 | 2-col grid, header gains icons, padding 16 px |
| `md` | 768–1023 | 2-col grid, sidebar → Filters drawer button |
| `lg` | 1024–1279 | 3-col grid, sidebar inline |
| `xl` | ≥ 1280 | 4-col grid, full layout (matches reference) |

3D canvas always fluid (`width:100%, aspectRatio:1240/459`) with min height 360 px on mobile.

---

## 12. Accessibility (WCAG 2.1 AA)

- All buttons have visible focus rings (`:focus-visible`)
- Wizard breadcrumb uses `<nav aria-label="Wizard progress">` with `aria-current="step"`
- 3D canvas has `role="img"` + `aria-label="3D preview of selected garment"` plus a *non-3D fallback* (the silhouette PNG) controlled by `prefers-reduced-motion`
- Carousel arrows are `<button aria-label="Previous stitch">`
- Color contrast ≥ 4.5:1 for text (verified: `#393939` on `#ffffff` = 11.3:1 ✓)
- Keyboard: Tab cycles focusable elements; arrows navigate carousel; `Enter` selects swatch; `Esc` closes modal/drawer
- Screen reader announces step changes via `aria-live="polite"` region

---

## 13. Testing Strategy

| Layer | Tool | Coverage target |
|---|---|---|
| Unit (utilities, store reducers) | Vitest | ≥ 90% lines |
| Component | Vitest + Testing Library | All wizard steps, AntD wrappers |
| Visual regression | Storybook + Chromatic (or Playwright `toHaveScreenshot`) | All 7 steps + Studio + Collection |
| 3D smoke | Playwright `browser_evaluate` checking `__THREE__ === true` and 1 canvas after Step 4 mount | every PR |
| E2E happy path | Playwright | Full wizard: pick silhouette → … → Add to Cart → Collection shows entry |
| Performance | Lighthouse CI in GH Actions | Studio LCP < 2.0s, TTI < 3.5s; Editor TTI < 4.0s |
| Accessibility | `@axe-core/playwright` | Zero violations on each route |

---

## 14. Project Structure (proposed)

```
knitup-replica/
├── public/
│   ├── silhouettes/       # 10 PNG previews + 10 GLB models
│   ├── textures/
│   │   ├── stitch/        # 20 swatch + 20 tileable
│   │   └── color/         # 54 swatch + 54 tileable
│   └── env/studio.hdr
├── src/
│   ├── app/
│   │   ├── routes.tsx     # React Router definitions
│   │   ├── App.tsx        # Header + <Outlet/> + Footer
│   │   └── theme/         # Tailwind config, AntD theme override, css vars
│   ├── pages/
│   │   ├── studio/StudioPage.tsx
│   │   ├── design/
│   │   │   ├── SilhouetteOverview.tsx
│   │   │   ├── Material.tsx
│   │   │   ├── Construction.tsx
│   │   │   ├── Stitch.tsx
│   │   │   ├── Gauge.tsx
│   │   │   ├── Color.tsx
│   │   │   ├── SizeAndQuantity.tsx
│   │   │   └── EditorLayout.tsx   # Owns the persistent <Canvas>
│   │   ├── collection/CollectionPage.tsx
│   │   ├── account/{Profile,Orders,Store,Address,ChangePassword}.tsx
│   │   └── auth/{Login,Signup}.tsx
│   ├── components/
│   │   ├── header/Header.tsx
│   │   ├── header/UserDropdown.tsx
│   │   ├── wizard/Breadcrumb.tsx
│   │   ├── wizard/SwatchCarousel.tsx
│   │   ├── wizard/AllSwatchesModal.tsx
│   │   ├── three/GarmentScene.tsx        # the persistent R3F scene
│   │   ├── three/GarmentMesh.tsx
│   │   ├── three/Lights.tsx
│   │   ├── three/CameraRig.tsx
│   │   └── ui/SizeTable.tsx
│   ├── store/
│   │   ├── selection.ts                  # Zustand
│   │   ├── auth.ts
│   │   └── persist.ts
│   ├── api/
│   │   ├── client.ts                     # fetch wrapper, X-Guest-Id header
│   │   └── endpoints.ts
│   ├── mocks/
│   │   ├── handlers.ts                   # MSW
│   │   └── fixtures/{silhouettes,materials,...}.json
│   ├── animations/
│   │   ├── pageTransition.ts             # GSAP timelines
│   │   └── cameraTweens.ts
│   ├── hooks/{useWizardGuard,useGuestSession}.ts
│   └── types/index.ts
├── tests/
│   ├── unit/
│   ├── e2e/wizard.spec.ts
│   └── visual/*.spec.ts
├── .storybook/
└── vite.config.ts
```

---

## 15. Milestones & Phasing

| Phase | Scope | Estimated effort |
|---|---|---|
| **P0 — Scaffolding** | Vite + React + TS + Tailwind + AntD theme + router + store + MSW + CI green | 1 day |
| **P1 — Marketing + Studio + Overview** | Header, footer, homepage stub, Studio with mock data, Silhouette overview, mobile responsive | 2–3 days |
| **P2 — Wizard non-3D steps** | Material, Construction, Size & Quantity (without 3D toggle) | 2 days |
| **P3 — 3D scene** | R3F EditorLayout with persistent Canvas, GLB loader, base lighting, one pullover model | 2 days |
| **P4 — Stitch / Gauge / Color** | Swatch carousels + texture mapping + color tween + UV-repeat gauge + Navigate 3D OrbitControls | 3 days |
| **P5 — Collection + Cart + Toast** | My Collection, Add to Cart flow, Step 7 toast, design persistence | 2 days |
| **P6 — Auth stubs + Account pages** | Login/Signup modal, Account/Orders/Store/Address pages (visual + mock) | 2 days |
| **P7 — Animations polish** | All GSAP timelines, Framer shared-element, reduced-motion, micro-interactions | 2 days |
| **P8 — Testing + perf + a11y** | Visual regression, E2E, Lighthouse, axe scans | 2 days |
| **P9 — Hardening + handoff** | Bug fixes, README, deploy preview (Vercel/Netlify) | 1 day |

**Total: ~19–20 working days for a single full-stack engineer**, parallelizable to ~10 days with two engineers (one frontend, one 3D).

---

## 16. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GLB models not available — must author from scratch | High | High (slows P3) | Use placeholder models from `polyhaven.com` or Sketchfab CC0 in v0; commission proper models in v0.2 |
| Three.js bundle bloat blows initial size budget | Medium | Med | Code-split per route; `three` only in editor chunk; dynamic-import DRACOLoader |
| Stitch textures don't tile cleanly on curved garment UVs | Medium | Med | Use triplanar mapping for problematic regions; test with marble cube before applying to mesh |
| Mobile Safari WebGL2 quirks (older iOS) | Med | Med | Detect `WebGL2RenderingContext`; fallback to PNG preview if absent |
| Mock data drift vs real API shape | Low | Low | Generate types from MSW handlers; share via TS interfaces |
| Visual regression false positives from font hinting | Med | Low | Use `pixelmatch` threshold ≥ 0.1; preload fonts before screenshot |

---

## 17. Decisions (locked 2026-05-09)

| # | Decision | Choice | Implementation note |
|---|---|---|---|
| 1 | Stack | **React 18 + Vite + TypeScript + R3F** | Per §3 as written |
| 2 | 3D models | **CC0 placeholders** | Source from Polyhaven, Sketchfab CC0, or generate basic shapes in Blender; commit to `/public/silhouettes/*.glb` |
| 3 | Auth | **Skip auth entirely (v0)** — guest-only | All "authed" account pages built as visual-only routes saving to `localStorage`; no login gate |
| 4 | Shopify "Add to Store" | **Visual stub** | Click → AntD `notification.success({message:'Added to your store'})`; no real Shopify call |
| 5 | Deploy | **Vercel** | Auto preview URL per PR; production at `<project>.vercel.app` |
| 6 | Branding | **Neutral generic brand** | Working name: **"KnitStudio"** (placeholder — change anytime). Simple wordmark logo, same Manrope/NexaBold typography, same color palette. No Knitup name/logo used in UI. |
| 7 | v0 scope | **Full PRD as written** | All 7 wizard steps + Collection + Cart + Account/Orders/Store/Address/ChangePassword (visual stubs per #3) + marketing stubs |

### Tension resolution (Q3 ↔ Q7)
"Skip auth" + "Full PRD" creates a tension since the account pages normally require auth. **Resolution:** account pages are built and routable as visual-only forms. Submitting persists to `localStorage` under `knitup.replica.v1.account`. The header user dropdown shows the **guest menu** by default; a hidden dev-only toggle in the footer (`?devAuth=1`) flips to the authed menu so all routes are reachable for review/screenshots.

---

## 18. Appendix — Captured Reference Artifacts

All in `/home/hp/Desktop/knitup/`:

| File | What it shows |
|---|---|
| `knitup_homepage.png` | Marketing homepage |
| `knitup_studio_full.png` | Studio (silhouette grid) — full page |
| `knitup_desktop_1440.png` | Studio @ 1440 px viewport |
| `knitup_mobile_studio.png` | Studio @ 390 px (mobile responsive) |
| `knitup_silhouette_overview.png` + `_full.png` | Step 1 — Silhouette overview |
| `knitup_step2_material.png` | Step 2 — Material carousel |
| `knitup_step3_construction.png` | Step 3 — Construction (3 cards) |
| `knitup_step4_stitch.png` + `_applied.png` | Step 4 — Stitch (Three.js canvas) |
| `knitup_step5_gauge.png` | Step 5 — Gauge picker |
| `knitup_step6_color.png` + `_applied.png` | Step 6 — Color picker |
| `knitup_step7_size_quantity.png` | Step 7 — Size & quantity (2D mode) |
| `knitup_step7_3d_mode.png` | Step 7 — 3D Rendering toggle on (shows photoreal magenta pullover ⭐) |
| `knitup_collection.png` | My Collection (2 saved designs as guest) |
| `knitup_user_dropdown.png` | Header user dropdown — guest menu |
| `knitup_studio_snapshot.yml` | Accessibility tree of Studio page |

**Detected technical facts (live audit):**
- Vue 3 + Ant Design Vue + Manrope/NexaBold fonts + Tailwind-style utility classes
- **Three.js r167 + WebGL2** — lazy-mounted on Stitch/Gauge/Color/SizeAndQuantity (toggle) steps
- Backend: REST `/coreApi/v1/*` (silhouette/category/material/embroidery_price_tier/notice/guestUser)
- Stripe + GA4 + GTM + Meta Pixel + LinkedIn Insight + HubSpot + Smartlook in production
- No GSAP / Framer / Lottie detected on source — replica adds these as a **deliberate enhancement** per user requirement

---

**End of PRD v0.1**

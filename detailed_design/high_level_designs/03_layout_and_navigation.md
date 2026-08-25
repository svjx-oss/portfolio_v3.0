# 03 — Layout & Navigation

> The shared page chrome: `_app.tsx`, skip link, Header (logo + theme control + nav dropdown), Footer, and Seo. Defined once here; every page inherits it.

---

## 1. `_app.tsx` — global wrapper

Wraps every route. Reads `ctx.state.site` (from `_middleware.ts`), renders `<html><head>` (Seo) + Layout (Header/Nav/Footer) around `<ctx.Component />`. CSS is imported in `client.ts`, not here.

```tsx
// routes/_app.tsx
import { define } from "@/utils.ts";
import Layout from "@/components/Layout.tsx";
import Seo from "@/components/Seo.tsx";

export default define.page((ctx) => {
  const site = ctx.state.site;
  return (
    <html lang="en" data-theme="dark" data-theme-preference="system">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Seo site={site} url={ctx.url} />
      </head>
      <body>
        <a class="skip-link" href="#main-content">Skip to content</a>
        <Layout site={site}><ctx.Component /></Layout>
      </body>
    </html>
  );
});
```

- **`_middleware.ts`** calls `loadSite()` and stores it on `ctx.state.site` before every route.
- **`_error.tsx`** (404 + 500) renders through `_app.tsx` so chrome stays consistent on errors. Triggered by `throw new HttpError(404)` or unmatched routes. Registered via `app.notFound()` / `app.onError()` in `main.ts`.

---

## 2. Navigation — localized dropdown (both desktop and mobile)

**Both desktop and mobile use a localized dropdown menu** — not a full-page overlay. The page content stays visible; the dropdown appears on the right side, in line with the nav toggle. The persistent logo and landing-page path link row provide immediate orientation; the menu provides access to the complete site map without adding a permanent link row.

```
Desktop (≥768px):
┌──────────────────────────────────────────────────┐
│ [◐]                                      ≡     │ ← logo left, dropdown trigger right
│                                                  │
│   (page content visible)                          │
│                                                  │
│              ┌─────────────┐                     │ ← dropdown opens inline,
│              │ Home         │                     │   right-aligned, below trigger
│              │ About        │                     │
│              │ Experience   │                     │
│              │ Projects    │                     │
│              │ Writing      │                     │
│              └─────────────┘                     │
└──────────────────────────────────────────────────┘

Mobile (<768px):
┌──────────────────────┐
│ [◐]              ≡  │
│                      │
│  (page content       │
│   visible)           │
│                      │
│       ┌──────────┐   │
│       │ Home     │   │
│       │ About    │   │ ← same localized dropdown
│       │ Exp      │   │   right-aligned
│       │ Proj     │   │
│       │ Writing  │   │
│       └──────────┘   │
└──────────────────────┘
```

### Implementation

- A single `Nav` component renders the dropdown for **all breakpoints** (no separate mobile/desktop nav).
- The trigger is a `≡` button (or a clean minimal SVG).
- The dropdown is a `<details>` element (no-JS fallback) enhanced by `islands/MobileNav.tsx`:
  ```html
  <details class="nav-dropdown" id="nav">
    <summary class="nav-trigger" aria-label="Toggle navigation">≡</summary>
    <nav class="nav-menu">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/experience">Experience</a>
      <a href="/projects">Projects</a>
      <a href="/blog">Writing</a>
    </nav>
  </details>
  ```
- `MobileNav.tsx` island enhances open/close, closes on link click / outside click / Escape key, and returns focus to the trigger. Animation is disabled under reduced motion.
- Native `<details>` works without JS — progressive enhancement.
- Active link gets `aria-current="page"` + sienna color.
- Links use native `<a href>` (full page load — no SPA routing). Fresh SSRs each page, so navigation is fast on the edge.

---

## 3. Header

Slim sticky bar. Logo (left) + theme toggle + nav dropdown trigger (right).

```css
.site-header {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-2) var(--gutter);
  background: color-mix(in srgb, var(--color-bg-2) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}
```

Logo: `Bitmoji.png`, ~36px, links to `/`. On the right, theme control and nav trigger form a compact control group. Both have 44px targets, visible focus rings, explicit accessible names, subtle default color, and text-color hover/focus states.

The theme control cycles `system → light → dark`. The visible icon reflects the preference, while its accessible label states the current preference and next action. Theme selection never changes layout.

---

## 4. Footer — minimalistic, no icons

A clean, minimal footer. **No icon boxes.** Text links, one quiet contact invitation, and a copyright line.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   email  ·  linkedin  ·  github  ·  resume      │ ← text links, subtle
│                                                  │
│   Interested in working together? Email me.      │ ← optional quiet invitation
│                                                  │
│   © Sahil Jaganmohan 2026                        │
└──────────────────────────────────────────────────┘
```

- Social links come from `site.json → social` + `resume`.
- **Text links**, not icon boxes — keeps the style artsy and minimalistic.
- `·` separators, `--color-text-muted`, small mono font.
- The optional contact invitation is one normal-text sentence. It links only `Email me`; it is not a button or a repeated CTA.
- Copyright year is `new Date().getFullYear()`.
- Analytics: text-link clicks fire `outbound_click`, `resume_download`, or `nav_click` via the analytics island.

---

## 5. Seo component

Renders `<head>` tags from `site` + `url`:
- `<title>`, `<meta description>`, canonical (`site.url + pathname`), OG tags, `robots`.
- GA4 snippet only when `ga4_id` set **and** hostname ≠ `localhost`.
- Font preloads.
- Theme initialization script before stylesheet paint, plus `theme-color` values for both media schemes.
- Open Graph image: use a reusable Blue Slate template with page title, optional date/type, and a small sienna marker. Page-specific artwork is optional; the template remains the fallback.

---

## 6. Background layer

`<div class="bg-mosaic" aria-hidden="true">` in `_app.tsx`, `position: fixed; z-index: -1; opacity: var(--bg-mosaic-opacity, 0)`. It is optional; the solid theme background is the default presentation.

---

## 7. Component summary

| Component | Type | Ships JS? |
|---|---|---|
| `routes/_app.tsx` | `define.page` | no |
| `routes/_middleware.ts` | `define.middleware` | no |
| `Layout` | server | no |
| `Seo` | server | no |
| `Header` (incl. `Nav`) | server | no |
| `MobileNav` | **island** | **yes (~1KB)** |
| `Analytics` | **island** (mounted in `_app.tsx`) | **yes (~1KB)** |
| `ThemeToggle` | **island** (in header) | **yes (~1KB)** |
| `Footer` | server | no |

## 8. Shared Interaction Rules

- `main` has `id="main-content"`; the skip link becomes visible on focus.
- Header controls remain keyboard reachable in visual order: logo, theme, navigation.
- All controls meet the 44px target requirement and use `:focus-visible`.
- Dropdown never obscures its trigger and is constrained to the viewport gutter.
- No interaction depends on hover. At 200% zoom, controls may wrap but cannot overlap.
- The navigation label is always explicit (`Menu` visually, with `Toggle navigation` as its accessible name); do not rely on a bare hamburger glyph alone.
- Page-level continuation links appear after primary content, not in the header or as floating controls.

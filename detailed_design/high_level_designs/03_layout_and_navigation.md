# 03 — Layout & Navigation

> The shared page chrome: `_app.tsx`, Header (logo + nav dropdown), Footer, Seo. Defined once here; every page inherits it.

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
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Seo site={site} url={ctx.url} />
      </head>
      <body>
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

**Both desktop and mobile use a localized dropdown menu** — not a full-page overlay. The page content stays visible; the dropdown appears on the right side, in line with the nav toggle. This is a deliberate departure from full-screen nav overlays.

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
│              │ Blog         │                     │
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
│       │ Blog     │   │
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
      <a href="/blog">Blog</a>
    </nav>
  </details>
  ```
- `MobileNav.tsx` island enhances: animates open/close, manages `aria-expanded`, closes on link click / outside click / Escape key.
- Native `<details>` works without JS — progressive enhancement.
- Active link gets `aria-current="page"` + sienna color.
- Links use native `<a href>` (full page load — no SPA routing). Fresh SSRs each page, so navigation is fast on the edge.

---

## 3. Header

Slim sticky bar. Logo (left) + nav dropdown trigger (right).

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

Logo: `bitmoji.webp`, ~36px, links to `/`.

---

## 4. Footer — minimalistic, no icons

A clean, minimal footer. **No icon boxes.** Just text links and a copyright line, styled to blend in.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   email  ·  linkedin  ·  github  ·  resume      │ ← text links, subtle
│                                                  │
│   © Sahil Jaganmohan 2026                        │
└──────────────────────────────────────────────────┘
```

- Social links come from `site.json → social` + `resume`.
- **Text links**, not icon boxes — keeps the style artsy and minimalistic.
- `·` separators, `--color-text-muted`, small mono font.
- Copyright year is `new Date().getFullYear()`.
- Analytics: text-link clicks fire `outbound_click` / `resume download / resume_download` / `nav_click` via the analytics island).

---

## 5. Seo component

Renders `<head>` tags from `site` + `url`:
- `<title>`, `<meta description>`, canonical (`site.url + pathname` — TODO placeholder domain), OG tags, `robots`.
- GA4 snippet only when `ga4_id` set **and** hostname ≠ `localhost`.
- Font preloads.

---

## 6. Background layer

`<div class="bg-mosaic" aria-hidden="true">` in `_app.tsx`, `position: fixed; z-index: -1; opacity: var(--bg-mosaic-opacity, 0)`. Disabled until the pixel-art is built (last priority).

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
| `Footer` | server | no |

# 03 — Layout & Navigation

> The shared page chrome: `_app.tsx`, skip link, adaptive Header, Footer navigation, and Seo. Defined once here; every page inherits it.

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

## 2. Navigation

There is no persistent dropdown or global header navigation. The footer provides direct page links.

- Index and standalone pages rely on the centered/left-aligned identity mark and footer navigation for orientation.
- Blog post routes (`/blog/:slug`) add one contextual return control only: a clean icon-only SVG back arrow linking to `/blog`.
- The blog back control has a 44px target, visible focus treatment, and `aria-label="Back to Writing"`. It has no visible text, enclosing border, or hover tooltip.
- Links use native `<a href>` (full page load, not SPA routing). Fresh SSRs each page.

---

## 3. Header

The header is a quiet masthead, not an application toolbar. It contains the identity mark on interior pages only; it does not carry the full site map.

```
Desktop:
┌──────────────────────────────────────────────────┐
│                    SJ                            │
└──────────────────────────────────────────────────┘

Mobile:
┌──────────────────────┐
│ SJ                   │
└──────────────────────┘

Blog post:
┌──────────────────────────────────────────────────┐
│ ←                  SJ                            │
└──────────────────────────────────────────────────┘
```

```css
.site-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: var(--space-2) var(--gutter);
}
```

- The landing page omits the `SJ` mark because the hero already establishes identity.
- Interior pages show the `SJ` home link. Desktop centers it; mobile aligns it left.
- Blog post routes add the back-arrow control in the left grid column; all other routes leave it empty.
- The header is sticky only on blog post routes, where a persistent return path aids long-form reading. All other headers scroll with the page.
- No structural border, persistent container background, visible button circles, or hover tooltip. Hierarchy comes from alignment and whitespace.
- The `SJ` identity links to `/`. The theme control lives in the footer beside the copyright, using a custom SVG sun/moon icon, a 44px target, visible focus ring, and an explicit accessible label. Theme selection never changes layout.

---

## 4. Footer — direct page navigation

A clean, minimal footer. **No icon boxes or disclosures.** It presents direct page links and the theme preference.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   Home / About / Experience / Projects / Writing │
│                                                  │
│   © 2026 Sahil Jaganmohan · Prefer light mode?   │ ← desktop
│   © 2026 Sahil Jaganmohan                         │ ← mobile
│   Prefer light mode?                              │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Page links come from `site.nav` and use a stable accent sequence by position. They remain colored in both themes and receive a slow underline sweep on hover and focus; reduced-motion users receive the final state without animation.
- Theme copy lives beside the editorial signature on desktop: `© 2026 Sahil Jaganmohan · Prefer light mode?`. On mobile it moves to the next line. It changes to `Prefer dark mode?` in light theme and underlines on hover/focus.
- Landing contact details are separate from the footer and come from `site.json → contacts`.
- The year is `new Date().getFullYear()`.

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
| `ThemeToggle` | **island** (in footer) | **yes (~1KB)** |
| `Footer` | server | no |

## 8. Shared Interaction Rules

- `main` has `id="main-content"`; the skip link becomes visible on focus.
- Header controls remain keyboard reachable in visual order: blog back control when present, logo, then theme.
- All controls meet the 44px target requirement and use `:focus-visible`.
- No interaction depends on hover. At 200% zoom, controls may wrap but cannot overlap.
- Page-level continuation links appear after primary content, not in the header or as floating controls.

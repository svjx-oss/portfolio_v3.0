# 03 — Layout & Navigation

> The page chrome shared by every route: `_app.tsx` wrapper, `Header` (bitmoji logo + top-right nav), `Footer` (social links), `Seo` (head tags), and the responsive nav behavior. This is the single place the chrome is defined (per architecture principle #2: one pipeline, all pages).

---

## 1. `_app.tsx` — the global wrapper

Fresh 2.x's `routes/_app.tsx` wraps **every** route. It is a `define.page` that reads `ctx.state.site` (populated by `routes/_middleware.ts`) and renders the outer `<html><head>` + shared chrome (Header/Nav/Footer) around `<ctx.Component />`. CSS is **not** imported here — all stylesheets are imported once in `client.ts` (Vite inlines them). Every page only supplies its `<main>` content.

```tsx
// routes/_app.tsx
import { define } from "@/utils.ts";
import { Head } from "fresh/runtime";
import Layout from "@/components/Layout.tsx";
import Seo from "@/components/Seo.tsx";

export default define.page((ctx) => {
  const site = ctx.state.site;            // populated by _middleware.ts
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Seo site={site} url={ctx.url} />   {/* title, description, OG, canonical, GA4 snippet, font preloads */}
      </head>
      <body>
        <div class="bg-mosaic" aria-hidden="true">{/* §7 (last priority) */}</div>
        <Layout site={site}>
          <ctx.Component />                  {/* the page content */}
        </Layout>
      </body>
    </html>
  );
});
```

```
<html lang="en">
  <head>
    <Seo …/>                  ← title, description, OG, canonical, GA4 snippet, font preloads
    (CSS is injected by Vite from client.ts imports — no <style> tags here)
  </head>
  <body>
    <div class="bg-mosaic" aria-hidden>…</div>   ← §7 (last priority)
    <Header/>                   ← sticky top bar, on every page (rendered inside Layout)
    <main>
      <ctx.Component />         ← the page content
    </main>
    <Footer/>                   ← on every page (rendered inside Layout)
  </body>
</html>
```

- **Data:** `routes/_middleware.ts` calls `loadSite()` once per request and stores it on `ctx.state.site`. `_app.tsx` reads `ctx.state.site` and passes it to `Layout`/`Header`/`Footer`/`Seo`. Pages don't re-fetch site metadata (and don't need to — `_app` already wraps them).
- **Per-page `<head>` overrides:** a page can use `<Head>` from `fresh/runtime` to set its own `<title>`/meta (e.g. blog post title). Fresh deduplicates — the last rendered `<title>` wins, so a page overrides the `_app` default.
- **No per-page chrome.** A page file (`routes/about.tsx`) renders only its `<article>` content; the header/footer/SEO are automatic.
- **404/500** render through `_app.tsx` (so the chrome stays consistent on errors) via a **unified** `routes/_error.tsx` (Fresh 2.x merges 404 + 500 into one error page). Triggered by `throw new HttpError(404)` from a handler, or by unmatched routes. `main.ts` registers `app.notFound()` / `app.onError()` to render it.

### 1.1 `routes/_middleware.ts` — load site metadata once per request
```ts
// routes/_middleware.ts
import { define } from "@/utils.ts";
import { loadSite } from "@/lib/loadContent.ts";

export default define.middleware(async (ctx) => {
  ctx.state.site = await loadSite();   // throws clear error if site.json is malformed
  return ctx.next();
});
```
- This runs before every route (and `_app.tsx`). `ctx.state.site` is typed via the `State` interface in `utils.ts` (add `site: Site` to it). One read per request; trivially cacheable later if needed.

---

## 2. `Header` (server component, `components/Header.tsx`)

A slim sticky bar at the top of every page. Two children: the **logo** (left) and the **nav** (right).

### 2.1 Logo (left)
- The **bitmoji `bitmoji.webp`** (Q21 — keep as logo), linked to `/`.
- Sized ~`36px` tall on mobile, `40px` on ≥768px. `border-radius: var(--radius-pill)`. `alt="Sahil Jaganmohan — home"`.
- No text label (the bitmoji is the mark). Hover: subtle `var(--transition-base)` scale `1.04`.

### 2.2 Nav (right) — `components/Nav.tsx`
Top-right inline links (Q: design doc "navigation menu sitting at the top right"). Desktop-first behavior:

```
┌─────────────────────────────────────────────────────────────┐
│ [bitmoji]                              About  Experience  …  │
│                                          Projects  Blog       │
└─────────────────────────────────────────────────────────────┘
```
- Links come from `site.json → nav` (so editing nav = edit JSON, not code). `Home` is omitted from the inline nav (the logo is the home link — avoids a redundant "Home"); the array still includes it for the mobile menu and footer. *(Flag: confirm dropping "Home" from the top-right inline list — `12_open_questions.md` Q-N1.)*
- Active state: the link whose `href` matches the current path gets `aria-current="page"` and the accent color + a 2px bottom sienna underline. Matching is prefix-aware for `/blog` (any `/blog/*` highlights `Blog`).
- Links use `<a href>` (native), not a client router — Fresh SSRs each page, so navigation is a full page load (fine for a tiny site; fast on the edge; great for SEO and analytics page_view events). **No SPA routing** — simpler, fewer moving parts, matches "easy to debug."

### 2.3 Styles (`layout.css`)
```css
.site-header {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-2) var(--gutter);
  background: color-mix(in srgb, var(--color-bg-2) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}
.site-logo img { height: 36px; border-radius: var(--radius-pill); }
@media (min-width: 768px) { .site-logo img { height: 40px; } }

.nav-inline { display: none; }                 /* hidden on mobile */
@media (min-width: 768px) { .nav-inline { display: flex; gap: var(--space-6); } }
.nav-link { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-text-subtle); text-decoration: none; padding: var(--space-1) 0; border-bottom: 2px solid transparent; transition: color var(--transition-base), border-color var(--transition-base); }
.nav-link:hover { color: var(--color-text); }
.nav-link[aria-current="page"] { color: var(--color-accent); border-bottom-color: var(--color-accent); }
```
- Semi-transparent header with `backdrop-filter: blur` — the mosaic (when added) shows subtly through; text stays crisp. If `backdrop-filter` is unsupported, the solid `--color-bg-2` fallback applies (no breakage).
- The sticky header means content anchors (TOC jumps, `#section` links) need `scroll-margin-top: 4rem` (set globally on `[id]` in `global.css`).

---

## 3. Mobile nav (`islands/MobileNav.tsx`) — the only nav interactivity

Below `768px`, the inline nav is hidden and a **hamburger button** appears at the top-right. Tapping it opens a panel listing the nav links (including `Home`).

### 3.1 Why an island
The toggle needs client state (open/closed). This is the *only* interactive nav element. Everything else is server HTML. Use `@preact/signals` (`useSignal(false)`) or `preact/hooks` `useState` for the toggle — both are fine in Fresh 2.x. For any code that must not run during SSR (e.g. reading `window`), gate it with `import { IS_BROWSER } from "fresh/runtime"` and return early when `!IS_BROWSER`.

### 3.2 Progressive enhancement (important)
- The nav links are **always present in the server HTML** inside a `<nav class="nav-mobile">` container. On mobile, the container is collapsed by CSS (max-height/opacity). The `MobileNav` island only toggles a class/`aria-expanded`.
- **If JS fails/disabled:** the links are still in the DOM. We default the panel to `aria-expanded="false"` and collapsed, but a no-JS user can still reach links via keyboard (the `<nav>` is focusable and links are tab-able even when visually collapsed — we ensure the collapsed state keeps links in the tab order, or we render them in a `<details>` as the ultimate no-JS fallback). **Recommended: use `<details>`/`<summary>` as the no-JS base** (see §3.4) — then the island only enhances animation. *(Confirm the `<details>`-based approach — `12` Q-N2.)*

### 3.3 Layout
```
Mobile (< 768px):
┌─────────────────────────────────┐
│ [bitmoji]                    ☰  │   ← hamburger button (island)
└─────────────────────────────────┘
   ┌─ when open ─────────────┐
   │  Home                   │
   │  About                  │
   │  Experience             │
   │  Projects               │
   │  Blog                   │
   └─────────────────────────┘   (panel slides down, full-width, bg --color-bg-2)
```
- Button: `☰` (or a small inline SVG icon), `aria-controls="mobile-nav"`, `aria-expanded` toggled by the island. `aria-label="Toggle navigation menu"`.
- Panel: absolutely positioned below header, `background: var(--color-bg-2)`, links stacked vertically, each tap = full page load (closes the menu naturally on the next render).
- Active link gets the same sienna treatment.

<!-- COMMENT: Does this need to be the full page?? I would prefer a isolated drop down per say, not something that takes over the whole page -->

### 3.4 Recommended no-JS base (`<details>`)
```html
<details class="nav-mobile" id="mobile-nav">
  <summary aria-label="Toggle navigation menu">☰</summary>
  <nav>
    <a href="/">Home</a> <a href="/about">About</a> …
  </nav>
</details>
```
Native `<details>` open/closes without JS. The `MobileNav` island upgrades it to animated + ARIA-managed (sets `aria-expanded`, animates). This guarantees the menu is usable even with JS off — a strong "no downtime / always works" property. CSS hides the marker triangle.

---

## 4. `Footer` (server component, `components/Footer.tsx`)

A compact footer at the bottom of every page.

```
┌─────────────────────────────────────────────────────────────┐
│   [mail] [linkedin] [home] [github] [resume]                │   ← icon links
│                                                             │
│   © Sahil Jaganmohan 2026                                   │
└─────────────────────────────────────────────────────────────┘
```
<!-- COMMENT: I dont want dumb icons here we want to keep the style artsy and minimalistic-->

- Social links come from `site.json → social` + `resume` — plain static strings from JSON.
- Icons: small **inline SVGs**. A tiny icon set lives in `components/icons.tsx` (mail, linkedin, github, home, document, external-link). Hand-written SVG paths; easy to read/edit.
- Copyright year is `new Date().getFullYear()` (runtime SSR — always correct, no manual edit).
- `<footer>` semantics, `role="contentinfo"` implicit.
- Analytics: footer link clicks fire `outbound_click` (github/linkedin/email) or `resume_download` (resume) — see doc `10`. Home icon is internal nav (`nav_click`).

### 4.1 Styles
```css
.site-footer { margin-top: var(--space-16); padding: var(--space-6) var(--gutter); border-top: 1px solid var(--color-border); text-align: center; }
.footer-links { display: flex; gap: var(--space-3); justify-content: center; }
.footer-link { display: inline-grid; place-items: center; width: 40px; height: 40px; border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-subtle); transition: color var(--transition-base), border-color var(--transition-base); }
.footer-link:hover { color: var(--color-text); border-color: var(--color-accent); }
.footer-copy { margin-top: var(--space-4); font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); }
```

---

## 5. `Seo` (server component, `components/Seo.tsx`)

Renders `<head>` tags from `ctx.state.site` + the current `url`. Called by `_app.tsx`; receives `site` + `url` as props. (Per-page overrides come from a `<Head>` block in the page component, which Fresh deduplicates — page's `<title>` wins over `_app`'s.)

- `<title>` = `site.title` default; a page overrides it with a `<Head><title>…</title></Head>`.
- `<meta name="description">` = `site.description`; `<meta name="author">` = `site.author`; canonical `<link rel="canonical" href>` = `site.url + url.pathname`. (`site.url` ships as a placeholder `https://TODO.example.com` — **TODO: replace with the production domain before launch**.)
- Open Graph: `og:title`, `og:description`, `og:type=website` (or `article` for blog posts), `og:url`, `og:image` (default = a static OG image; per-page override later).
- `<meta name="robots" content="index,follow">`.
- GA4 snippet (gtag.js) emitted only when `site.ga4_id` is non-empty **and** `url.hostname !== "localhost"` (A1) — see doc `10`.
- Font preloads: `<link rel="preload" href="/fonts/…" as="font" type="font/woff2" crossorigin>` for the active fonts.
- JSON-LD `Person` schema for the home page (optional, future) — a small win for the "intro myself" goal.

---

## 6. `<main>` content area conventions

- Every route renders an `<article>` or `<section>` inside `<main>`.
- The main wrapper centers content: `max-width: var(--content-max)` (or `-wide`), `margin-inline: auto`, `padding-inline: var(--gutter)`, `padding-block: var(--space-12) var(--space-16)`.
- Each page starts with a **section title pattern**: a big H1 + a smaller sienna subtitle (e.g. "About Me" / "in more depth"). A `SectionTitle` component renders this consistently — see wireframes doc `09`. *(Landing is the exception: it has its own hero block.)*

---

## 7. The background layer (`bg-mosaic`)

Rendered once in `_app.tsx`, behind everything:
```html
<div class="bg-mosaic" aria-hidden="true"><!-- inline SVG mountains+ocean (built last) --></div>
```
```css
.bg-mosaic { position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: var(--bg-mosaic-opacity, 0); }
/* Until the mosaic is built, opacity is 0 — body bg shows. One var flips it on. */
body { background: var(--color-bg); }
```
Until the pixel-art is implemented (last milestone), `--bg-mosaic-opacity: 0` and the site looks exactly right on the solid navy. Flipping it on later is a single token change + dropping in the SVG. Spec in `01` §6.

---

## 8. Component dependency summary (chrome)

| Component | Type | Deps | Ships JS? |
|---|---|---|---|
| `routes/_app.tsx` | `define.page` app wrapper | `Layout`, `Seo`, `ctx.state.site` (from `_middleware.ts`) | no (renders HTML) |
| `routes/_middleware.ts` | `define.middleware` | `loadSite()` | no (server-only) |
| `Layout` | server component | — | no |
| `Seo` | server component | `site`, `url` props | no |
| `Header` | server component | `Nav`, logo | no |
| `Nav` | server component | `site.nav` | no |
| `MobileNav` | **island** (`islands/MobileNav.tsx`) | `site.nav` | **yes (tiny)** |
| `Footer` | server component | `site.social`, icons | no |
| `icons` (`components/icons.tsx`) | inline SVG components | — | no |

The entire chrome ships **zero JS** except the ~1 KB mobile-menu island. This is the "lightweight, fast" requirement made concrete: first paint is full HTML; only the hamburger needs hydration.

---

## 9. ASCII wireframe — page chrome (all breakpoints)

Desktop (≥768px):
```
┌──────────────────────────────────────────────────────────────────┐
│ [◐]                                            About Exp Proj Blog│ ← sticky header
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│                       <main: page content>                         │
│                       (centered, max-width content)                │
│                                                                    │
├──────────────────────────────────────────────────────────────────┤
│            [✉] [in] [⌂] [gh] [📄]                                  │
│                © Sahil Jaganmohan 2026                             │
└──────────────────────────────────────────────────────────────────┘
```

<!-- COMMENT: I think both desktop and mobile should have a drop down for the other tabs but it should be a localized drop down not full screen. I should still see the content of the page but on the right side in line with the hamburger icon is the drop down  -->

Mobile (<768px):
```
┌───────────────────────────┐
│ [◐]                    ☰ │   ← hamburger
├───────────────────────────┤
│  (panel when open:)        │
│   Home About Exp Proj Blog│
├───────────────────────────┤
│      <main: content>       │
│      (full width, gutter)  │
├───────────────────────────┤
│   [✉][in][⌂][gh][📄]      │
│   © Sahil Jaganmohan 2026 │
└───────────────────────────┘
```

Full per-page wireframes (content layouts) → `09_wireframes.md`.

---

## 10. New navigation-related questions (→ `12_open_questions.md`)

- **N1** Drop "Home" from the top-right *inline* nav (logo is the home link), but keep it in the mobile menu? (Recommended: yes.)
  - Yes
- **N2** Use a `<details>`-based no-JS fallback for the mobile menu (island only enhances)? (Recommended: yes — strongest "always works" guarantee.)
  - yes
- **N3** Should the footer include a small "back to top" affordance on long pages (about, timeline, blog posts)? (Recommended: no — keep footer uniform; long pages rely on the sticky header nav.)
  - no

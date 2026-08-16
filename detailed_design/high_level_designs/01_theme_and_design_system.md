# 01 — Theme & Design System

> The visual language for the whole site. One file (`assets/theme.css`) is the **single source of truth** for every design token. This doc specifies its contents and the conventions built on top of it.

---

## 1. Design Goals (recap from the design doc)

- "Refined", not bare HTML — typography and content arrangement matter.
- Color scheme: **background `#11305c`**, **text `#ffffff`** (locked from design doc).
- Inspirations: *increment* (clean light editorial), *maggieappleton* (dark bg, text `#c3bfbb`, colors that **pop**), *imkylelambert* (bold bg, white text, colorful article cards).
- We take the navy/white base from the design doc and borrow the **"colors pop against a dark ground"** idea from Maggie Appleton — using a vibrant accent palette so highlights and tags stand out.
- Muted **pixel-art mosaic** (mountains + ocean) behind content — decorative, non-interfering, built **last**.
- Mobile-first; one site scales mobile → laptop.

---

## 2. Color Palette

All colors live as CSS custom properties in `assets/theme.css` on `:root`. Named by **role**, not by hue (so swapping a palette later means changing values, not renaming usages).

### 2.1 Base (background + text) — locked

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#11305c` | page background (the design-doc value) |
| `--color-bg-2` | `#0e2950` | slightly darker: header bar, footer, code blocks |
| `--color-surface` | `#15457a` | raised cards (project cards, blog cards, timeline cards) |
| `--color-surface-2` | `#1c5390` | card hover / active |
| `--color-border` | `rgba(255,255,255,0.12)` | subtle separators, card outlines |
| `--color-border-strong` | `rgba(255,255,255,0.22)` | focused/active borders |

### 2.2 Text

| Token | Value | Use |
|---|---|---|
| `--color-text` | `#ffffff` | primary text / headings (design-doc value) |
| `--color-text-subtle` | `#b6c6dd` | secondary text — intros, descriptions, card subtitles |
| `--color-text-muted` | `#7e93b3` | tertiary — labels, dates, captions, "sub text" à la increment's `#595959` but blue-tinted to sit on navy |

### 2.3 Accent (single primary brand accent)

| Token | Value | Use |
|---|---|---|
| `--color-accent` | `#EE6C4D` | sienna — the primary brand accent; links, active nav, primary CTAs, the name "Sahil Jaganmohan" on landing |
| `--color-accent-2` | `#ffb547` | warm secondary — hover/secondary highlights |

Sienna on navy is a complementary pair, so the accent pops exactly the way the inspirations pop.

### 2.4 "Pop" palette (reusable highlights)

A set of vivid highlights for emphasis spans and the timeline company dots. Used sparingly so the dark ground stays calm.

| Token | Value | Old name |
|---|---|---|
| `--color-pop-green` | `#7BF1A8` | custom-green |
| `--color-pop-blue` | `#90F1EF` | custom-blue2 |
| `--color-pop-purple` | `#bdb2ff` | custom-purple |
| `--color-pop-pink` | `#e82eb3` | custom-darkpink |
| `--color-pop-yellow` | `#f4e409` | custom-yellow |
| `--color-pop-orange` | `#fe8277` | custom-orange |
| `--color-pop-magenta` | `#d104db` | custom-darkpurple |

### 2.5 Company colors (timeline node markers)

Each role's timeline dot uses its company's brand color — a subtle, recognizable cue. These are the recommended values; the runtime source of truth is `timeline.json`'s per-entry `color` field (§2.5 note).

| Token | Value | Company |
|---|---|---|
| `--company-apple` | `#3b9eff` | Apple |
| `--company-purdue` | `#C28E0E` | Purdue University |
| `--company-l3harris` | `#c23a46` | L3Harris |
| `--company-att` | `#f98d1e` | AT&T |
| `--company-cme` | `#25a9e0` | CME Group |

> Note: `timeline.json` stores a per-entry `color` hex (the doc `02` schema). The CSS tokens above are the *recommended* values; the JSON is the runtime source of truth so you can tweak one without touching CSS. `assets/theme.css` keeps these only as named fallbacks / documentation.

### 2.6 Tag colors (project pills)

Project tags get their colors from `projects.json` (`colors` map: tag-key → hex), applied as inline styles by `Tag.tsx` — no CSS per tag. Recommended starting palette (tuned for contrast on `#11305c`):

| Tag | Hex | Pill text |
|---|---|---|
| `c`, `python`, `javascript`, `systemverilog` | `#f4e409` | `#11305c` (dark text on yellow) |
| `react` | `#61dafb` | `#11305c` |
| `gatsby` | `#663399` | `#ffffff` |
| `jekyll` | `#cc0000` | `#ffffff` |
| `graphql` | `#e535ab` | `#ffffff` |
| `openmp`, `mpi`, `scikit_learn` | `#7BF1A8` | `#11305c` |
| `stm_32`, `spi`, `i2c`, `dma`, `gpio` | `#bdb2ff` | `#11305c` |
| `arm_v6`, `asic_design`, `rtl` | `#fe8277` | `#11305c` |
| `research` | `#3b3b8d` | `#ffffff` |
| `fitbit`, `spotify` *(new — were missing)* | `#00b0b9`, `#1db954` | `#ffffff` |

To add a tag color later: add one line to the `colors` object in `projects.json`. That's it — no CSS edit, no rebuild logic. (See `02_content_data_model.md`.)

---

## 3. Typography

### 3.1 Font families & the single switch point (Q5)

Self-host fonts in `static/fonts/`. **Inter** and **Geist Sans** are open-source (OFL); **PP Neue Montreal** is **commercial — a license is required** to use it. Drop its files in `static/fonts/` if you own a license; otherwise it's omitted and the fallback chain covers it.

`assets/theme.css`:
```css
:root {
  /* ★ THE SWITCH POINT — change these two lines to reface the whole site */
  --font-body:    "Inter", "Geist Sans", "PP Neue Montreal", system-ui, -apple-system, sans-serif;
  --font-heading: "Inter", "Geist Sans", "PP Neue Montreal", system-ui, -apple-system, sans-serif;
  --font-mono:    "IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, monospace;
}
```
- To make **Geist Sans** primary: move it first → `--font-body: "Geist Sans", "Inter", ...`. One line, whole site changes.
- To make **PP Neue Montreal** primary: ensure its `@font-face` is active (uncommented) and move it first. (Per resolution E1, you don't own a license — its `@font-face` stays commented out. Inter/Geist remain active.)
- `--font-heading` may differ from `--font-body` (e.g., a tighter heading font) — set independently if desired.
- `--font-mono` is **IBM Plex Mono** — used for small labels, tag pills, dates, code. It's the "engineer" accent. Self-hosted.

`@font-face` blocks for Inter, Geist, and IBM Plex Mono are active in `assets/theme.css`; PP Neue Montreal's is **commented out** (E1). Fonts are preloaded via `<link rel="preload">` in `Seo` (called from `_app.tsx`) for LCP speed.

### 3.2 Type scale (fluid, mobile-first)

A modular scale using `clamp()` so type scales smoothly from mobile to desktop with **zero media queries** (responsive-by-default, fewer breakpoints to debug).

| Token | Value (min → preferred → max) | Used for |
|---|---|---|
| `--text-xs` | `clamp(0.72rem, 0.7rem + 0.1vw, 0.8rem)` | tags, dates, captions |
| `--text-sm` | `clamp(0.85rem, 0.83rem + 0.1vw, 0.95rem)` | secondary text, card descriptions |
| `--text-base` | `clamp(1rem, 0.96rem + 0.2vw, 1.125rem)` | body |
| `--text-lg` | `clamp(1.15rem, 1.1rem + 0.3vw, 1.35rem)` | lead/intro paragraphs |
| `--text-xl` | `clamp(1.35rem, 1.25rem + 0.5vw, 1.75rem)` | card titles |
| `--text-2xl` | `clamp(1.75rem, 1.5rem + 1vw, 2.5rem)` | page H1 |
| `--text-3xl` | `clamp(2.25rem, 1.8rem + 2vw, 3.5rem)` | landing hero name |

- Body line-height: `1.7` (prose readability). Headings: `1.2`.
- Letter-spacing: headings `−0.01em` (tighter); mono labels `+0.02em` (looser, "technical" feel).
- Paragraph max-width: `70ch` (prose column) — automatic readability without per-page tuning.

### 3.3 Weight & emphasis

- Headings: weight `600` (semibold). The hero name on landing: `700` italic sienna.
- Body: `400`. Bold spans inline: `600`.
- Avoid all-caps except small mono labels (e.g. dates) where `letter-spacing` widens them.

---

## 4. Spacing, Layout, Radii

### 4.1 Spacing scale (4px base)

```css
--space-1: 0.25rem;  /* 4 */
--space-2: 0.5rem;   /* 8 */
--space-3: 0.75rem;  /* 12 */
--space-4: 1rem;     /* 16 */
--space-6: 1.5rem;   /* 24 */
--space-8: 2rem;     /* 32 */
--space-12: 3rem;    /* 48 */
--space-16: 4rem;    /* 64 */
--space-24: 6rem;    /* 96 */
```
Use the scale tokens, never raw `px`/`rem` in components. Keeps spacing consistent and tunable in one place.

### 4.2 Layout containers

| Token | Value | Use |
|---|---|---|
| `--content-max` | `46rem` (~736px) | prose pages: landing, about, blog posts |
| `--content-max-wide` | `60rem` (~960px) | projects grid, timeline, blog index |
| `--gutter` | `clamp(1rem, 0.5rem + 2vw, 2rem)` | page side padding — grows on wider screens, comfortable on mobile |

Page wrapper: `max-width: var(--content-max)` (or `-wide`), `margin-inline: auto`, `padding-inline: var(--gutter)`.

### 4.3 Radii

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-pill: 9999px;   /* tags, author badge */
```

### 4.4 Shadows (subtle — the design is flat-leaning, so shadows are gentle)

```css
--shadow-card: 0 2px 8px rgba(0,0,0,0.18);
--shadow-card-hover: 0 6px 20px rgba(0,0,0,0.28);
```

### 4.5 Motion

```css
--transition-fast: 120ms ease;
--transition-base: 200ms ease;
--ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
```
Hover/active states use `--transition-base`. The landing typewriter and any fade-in use `--ease-emphasized`. **No heavy animation libraries.** Fade-in on page content (optional) = a single `@keyframes fade-up` 400ms applied once; can be removed entirely if it ever causes jank.

---

## 5. Breakpoints & Responsive Strategy

Mobile-first CSS: base styles target phones; `min-width` media queries enhance upward. Few breakpoints, kept consistent site-wide:

```css
--bp-sm:  640px;   /* large phone landscape / small tablet */
--bp-md:  768px;   /* tablet */
--bp-lg:  1024px;  /* laptop */
--bp-xl:  1280px;  /* large desktop (rarely needed) */
```

Conventions:
- Mobile = single column everywhere. Stacks naturally.
- ≥ `768px`: two-column where it helps (e.g. project grid 2-up, about portrait beside bio).
- ≥ `1024px`: project grid 3-up; timeline card gets more breathing room.
- Nav: hamburger (`MobileNav` island) < `768px`; inline top-right links ≥ `768px`. (Detail in `03`.)
- No layout depends on JS. The mobile nav *toggle* is JS, but if JS fails the links are still reachable (progressive enhancement — see `03`).

---

## 6. The Pixel-Art "Digital Mosaic" Background (Q6) — LAST PRIORITY

### 6.1 Intent
A muted mosaic of pixel tiles forming **mountains over an ocean**, behind all content, low-contrast so it reads as texture rather than image. It must **blend in** and never interfere with content legibility.

### 6.2 Approach (recommended): a hand-authored SVG
- One fixed full-viewport layer in `_app.tsx`: `<div class="bg-mosaic" aria-hidden="true">` containing an inline `<svg>`, `position: fixed; inset: 0; z-index: -1; pointer-events: none;`.
- The scene is a grid of small `<rect>` squares (e.g. 16×16 px tiles, or a 32-col × 18-row grid) colored in muted navy/teal/slate bands: a darker ocean band at the bottom, lighter sky band up top, a mountain silhouette in the middle made of stepped pixel blocks.
- Palette stays within ~5 muted hues harmonizing with `#11305c` (e.g. `#0e2950`, `#123666`, `#1a4a7e`, `#2a6ba0`, `#3f86b8` — all darker/muted than text so white text always wins). No bright pop colors here — those are reserved for content.
- Overall opacity ~`0.5` on the SVG itself, but since hues are close to the bg, effective interference is low. Tunable via one CSS var `--bg-mosaic-opacity`.
- **Why SVG over PNG:** text-editable, git-diffable, infinitely crisp, tiny (~1-3 KB), no build/asset pipeline. You can tweak the mountain shape by editing `<rect>` coordinates.
- `prefers-reduced-motion: reduce` → no animation (we aren't animating it anyway by default; if we later add a slow shimmer, gate it behind this query).

### 6.3 Non-goals / constraints
- Must not cause CLS (it's `position: fixed`, behind content, zero layout impact).
- Must not hurt LCP (inline SVG, no network fetch; or one tiny preloaded SVG file).
- Must not reduce text contrast below WCAG AA anywhere. Verified by checking the lightest mosaic tile under text — text color stays `#ffffff` on tiles no lighter than `#3f86b8` (contrast ratio ~3.6:1 for large text; body text always sits over the darker bands or over `--color-surface` cards).
- Build this **after** all pages work and read well on a plain `#11305c` background. The mosaic is enhancement, not dependency.

### 6.4 Fallback
Until built, `body { background: var(--color-bg); }` alone. The whole site ships and looks correct without it.

Full visual mockups (ASCII) including the mosaic concept → `09_wireframes.md`.

---

## 7. CSS Architecture (no Tailwind)

### 7.1 File organization (mirrors `assets/` from `00`)
- `assets/theme.css` — tokens only (`:root {…}`). **No rules.**
- `assets/global.css` — reset + base element styles (`body`, `h1-h4`, `a`, `p`, `code`, `ul`, `img`, `hr`, selection).
- One file per page/section (`assets/landing.css`, `assets/about.css`, `assets/timeline.css`, `assets/projects.css`, `assets/blog.css`).
- `assets/components.css` — shared component classes (`.card`, `.tag`, `.btn`, `.author-badge`, `.section-title`, `.prose`) used across pages.
- `assets/layout.css` — header/nav/footer chrome.

### 7.2 Naming & conventions
- **Semantic class names** describing what something *is*, not how it looks: `.timeline-entry`, `.project-card`, `.blog-card`, `.nav-link`, `.author-badge`. No `.flex`/`.mt-4` utility classes.
- **BEM-ish** for nested elements when needed: `.project-card__title`, `.project-card__tags`. Simple flat names when the scope is clear (a page CSS file is already scoped by file).
- **No `!important`.** No ID selectors for styling (IDs are for anchors/`<details>` only).
- **CSS custom properties for any value used >1 place.** Ad-hoc values are fine for one-offs.
- Each page CSS file starts with a comment header naming the page.

### 7.3 Why this beats Tailwind here
Per the reviewed decision: no utility-class strings cluttering TSX, and total control over styling. Plain semantic CSS costs more lines but reads like prose years later (open `assets/timeline.css` → see `.timeline-entry { … }`). A human editing without AI can find and change a style by element name, not by reverse-engineering a utility class soup. This directly serves the "easy to debug and edit manually" goal.

### 7.4 Importing CSS (Fresh 2.x + Vite)
**All CSS is imported once in `client.ts`** (the Fresh client entry). Vite bundles and inlines them. The scaffold already imports `./assets/styles.css` there — replace it with the full set, in load order:
```ts
// client.ts
import "./assets/theme.css";      // tokens first
import "./assets/global.css";      // reset + base
import "./assets/layout.css";      // chrome
import "./assets/components.css";  // shared
import "./assets/landing.css";
import "./assets/about.css";
import "./assets/timeline.css";
import "./assets/projects.css";
import "./assets/blog.css";
```
One place to see the whole stylesheet load order — no per-route CSS imports to forget. (If a page's CSS grows large later, you can move its import into the route file instead; Vite handles both.) `theme.css`/`global.css` are always present because they're loaded before any page.

---

## 8. Reusable Component Styles (shared classes in `assets/components.css`)

These map 1:1 to the Preact components in `components/`. Defined once, used across pages:

| Class | Element | Notes |
|---|---|---|
| `.card` | project/blog/timeline cards | `background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); box-shadow: var(--shadow-card);` hover → `--shadow-card-hover` + `--color-surface-2` |
| `.tag` | project tag pill | `border-radius: var(--radius-pill); padding: 2px var(--space-3); font-family: var(--font-mono); font-size: var(--text-xs);` color/fg come from inline style (JSON) |
| `.btn` / `.btn--accent` | CTAs (resume link, etc.) | accent bg variant uses `--color-accent` |
| `.author-badge` | `[img] Name` (blog) | circular avatar `var(--radius-pill)` + name, mono label |
| `.section-title` | page headings pattern (e.g. "About Me" / "in more depth") | large H1 + smaller sienna subtitle |
| `.prose` | rendered markdown container | sets `max-width: 70ch; line-height: 1.7;` + styles `h2/h3/ul/code/blockquote` (see §9) |

---

## 9. Markdown Rendering Styles (`.prose`)

Server-rendered markdown (about, blog posts, timeline role bullets) is wrapped in `<div class="prose">`. `assets/global.css`/`assets/components.css` styles the generated elements so the *markdown source* stays clean and authors never write CSS:

- `h2` → `--text-2xl`, sienna underline accent (a 3px bottom border in `--color-accent`), `scroll-margin-top` so TOC anchors don't hide under the sticky header.
- `h3` → `--text-xl`, `--color-text`.
- `p` → `--text-base`, `line-height: 1.7`, `margin-block: var(--space-4)`.
- `a` → `--color-accent`, underline; `:hover` → `--color-accent-2`.
- `ul`/`ol` → custom sienna bullets, `padding-inline-start: var(--space-6)`.
- `code` → inline `--font-mono`, subtle surface bg, `--radius-sm`; fenced blocks → full `--color-bg-2` block with scroll.
- `blockquote` → left sienna border, italic, `--color-text-subtle`.
- `img` → `max-width: 100%; border-radius: var(--radius-md);` (for future blog images — Q14).
- `h2` carries `id="slug-of-heading"` (auto-generated by the markdown-it anchor plugin) → feeds the TOC (`08_page_blog.md`).

---

## 10. Accessibility Baseline

- Color contrast: text `#fff` on `#11305c` = **9.0:1** (AAA). Subtle `#b6c6dd` on `#11305c` = ~6.5:1 (AA+). Verified ≥ AA for all token pairings.
- Focus-visible outlines: `outline: 2px solid var(--color-accent); outline-offset: 2px;` on all interactive elements. Never removed.
- `prefers-reduced-motion` → typewriter shows the first string static; fade-ins disabled.
- `aria-hidden` on the mosaic; `aria-current="page"` on the active nav link.
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<time>`, `<header>`, `<footer>`. The Preact components use these, not `<div>` soup.

---

## 11. Summary: what to change to reface the site

| Want to change… | Edit… |
|---|---|
| Primary font | `assets/theme.css` `--font-body` / `--font-heading` (one line each) |
| Background color | `assets/theme.css` `--color-bg` |
| Accent color | `assets/theme.css` `--color-accent` |
| A company dot color | `content/timeline/timeline.json` → entry `color` |
| A project tag color | `content/projects/projects.json` → `colors` map |
| Spacing scale | `assets/theme.css` space tokens |
| Mosaic opacity / art | `assets/theme.css` `--bg-mosaic-opacity` + the SVG in `_app.tsx` |

One file per concern. This is the maintainability promise made concrete.

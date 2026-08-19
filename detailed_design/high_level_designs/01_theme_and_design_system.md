# 01 — Theme & Design System

> `assets/theme.css` is the single source of truth for every design token.

---

## 1. Design Goals

- **Refined and minimalistic** — clean, effortless, easy to read and navigate.
- Inspired by: *increment.com* (editorial clarity), *maggieappleton.com* (dark bg, calm text, colors that pop), *imkylelambert.com* (bold bg, vivid accents).
- Background `#11305c`, text `#ffffff`.
- Mobile-first; one site scales mobile → laptop.

---

## 2. Color Palette

All colors are CSS custom properties in `assets/theme.css`, named by **role**.

### Base
| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#11305c` | page background |
| `--color-bg-2` | `#0e2950` | header, footer, code blocks |
| `--color-surface` | `#15457a` | cards |
| `--color-surface-2` | `#1c5390` | card hover |
| `--color-border` | `rgba(255,255,255,0.12)` | separators |

### Text
| Token | Value | Use |
|---|---|---|
| `--color-text` | `#ffffff` | primary |
| `--color-text-subtle` | `#b6c6dd` | secondary (descriptions, subtitles) |
| `--color-text-muted` | `#7e93b3` | tertiary (labels, dates, captions) |

### Accent
| Token | Value | Use |
|---|---|---|
| `--color-accent` | `#EE6C4D` | sienna — links, active nav, name on landing |
| `--color-accent-2` | `#ffb547` | hover/secondary highlights |

### Pop palette (sparingly — emphasis spans, timeline dots)
`--color-pop-green: #7BF1A8` · `--color-pop-blue: #90F1EF` · `--color-pop-purple: #bdb2ff` · `--color-pop-pink: #e82eb3` · `--color-pop-yellow: #f4e409` · `--color-pop-orange: #fe8277`

### Company colors (timeline)
Driven by `timeline.json`'s per-entry `color` hex. Recommended: Apple `#3b9eff`, Purdue `#C28E0E`, L3Harris `#c23a46`, AT&T `#f98d1e`, CME `#25a9e0`.

### Tag colors
Fixed CSS classes in `assets/components.css` (`.tag--yellow`, `.tag--blue`, `.tag--green`, etc.). `Tag.tsx` maps tag names to classes. To add a new tag color: add a CSS class + one line in the map. No JSON-driven inline styles — simpler and fewer moving parts.

---

## 3. Typography

### Font: one active, switchable
**One font is active at a time.** Don't load multiple fonts simultaneously — pick one, comment out the rest. To switch, change one line:

```css
:root {
  --font-body: "Inter", system-ui, sans-serif;       /* ← change this one line to swap */
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}
```

To switch to Geist Sans: `--font-body: "Geist Sans", system-ui, sans-serif;` and ensure its `@font-face` is active (uncommented) in `theme.css`. PP Neue Montreal is commercial (no license) — its `@font-face` stays commented out.

Self-host font files in `static/fonts/`. Preload via `<link rel="preload">` in `Seo`.

### Type scale (fluid, mobile-first via `clamp()`)
| Token | Use |
|---|---|
| `--text-xs` | tags, dates |
| `--text-sm` | secondary text |
| `--text-base` | body |
| `--text-lg` | lead paragraphs |
| `--text-xl` | card titles |
| `--text-2xl` | page H1 |
| `--text-3xl` | landing hero |

Body line-height `1.7`. Headings `1.2`, weight `600`. Paragraph max-width `70ch`.

---

## 4. Spacing & Layout

```css
--space-1: 0.25rem;  --space-2: 0.5rem;  --space-4: 1rem;
--space-6: 1.5rem;   --space-8: 2rem;    --space-12: 3rem;  --space-16: 4rem;
--content-max: 46rem;      /* prose pages */
--content-max-wide: 60rem; /* projects, timeline, blog index */
--gutter: clamp(1rem, 0.5rem + 2vw, 2rem);
--radius-sm: 6px;  --radius-md: 10px;  --radius-lg: 16px;  --radius-pill: 9999px;
--shadow-card: 0 2px 8px rgba(0,0,0,0.18);
--transition-base: 200ms ease;
```

---

## 5. Breakpoints

Mobile-first; `min-width` media queries enhance upward: `768px` (tablet), `1024px` (laptop). No layout depends on JS.

---

## 6. Pixel-Art Background — last priority

A muted SVG mosaic (mountains + ocean) behind all content, `position: fixed; z-index: -1; opacity: var(--bg-mosaic-opacity, 0)`. Disabled until built. Site looks correct on solid `#11305c` without it.

Constraints: no CLS, no LCP impact, text contrast stays ≥ WCAG AA.

---

## 7. CSS Architecture

- `assets/theme.css` — tokens only.
- `assets/global.css` — reset + base elements.
- `assets/layout.css` — header/nav/footer.
- `assets/components.css` — shared `.card`, `.tag`, `.section-title`, `.prose`.
- One file per page (`landing.css`, `about.css`, etc.).
- All imported in `client.ts`. Vite bundles + inlines.
- **Semantic class names** (`.timeline-entry`, not `.flex`). BEM-ish for nesting (`.project-card__title`). No `!important`.

---

## 8. Markdown Styles (`.prose`)

Server-rendered markdown is wrapped in `.prose`. Styles cover `h2`/`h3` (with sienna accents + `scroll-margin-top`), `p`, `a`, `ul`/`ol` (sienna bullets), `code`, `blockquote`, `img`. Authors never write CSS.

---

## 9. Reface Cheat Sheet

| Change | Edit |
|---|---|
| Font | `theme.css` `--font-body` (one line) |
| Background | `theme.css` `--color-bg` |
| Accent | `theme.css` `--color-accent` |
| Company dot color | `timeline.json` → entry `color` |
| Tag color | `projects.json` → `colors` map |
| Mosaic | `theme.css` `--bg-mosaic-opacity` + SVG in `_app.tsx` |

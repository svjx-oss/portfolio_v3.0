# 01 — Theme & Design System

> This document is the authoritative visual specification. `assets/theme.css` is the implementation source of truth for its tokens.

**Design outcome:** A visitor should perceive a thoughtful practitioner who cares about design, clarity, and execution. Technical depth is demonstrated by the work, experience, and writing, not by overtly technical visual motifs.

**Personality outcome:** The site should also feel approachable, curious, creative, and lived-in. This comes from authentic copy, field notes, and photography, not extra dashboard widgets or visual noise.

---

## 1. Visual Direction: Blue Slate Editorial

- **Editorial first:** content hierarchy comes from type, spacing, rules, and alignment rather than decoration.
- **Blue-slate foundation:** ink-blue dark mode and blue-white light mode feel composed, precise, and easy to read.
- **Warm focal point:** sienna is the single brand and interaction accent. It creates warmth without turning the site colorful overall.
- **Restrained personality:** sienna creates the landing-page focal points; pop colors appear only in compact supporting details such as timeline dots and tags.
- **Lists over grids:** projects and blog entries use divided rows. Cards are reserved for structures that need containment, such as timeline entries and skill groups.
- **Quiet motion:** no carousels, typewriters, parallax, or ambient animation. Transitions only communicate hover, focus, opening, or theme changes.
- **Mobile-first and accessible:** layout, keyboard interaction, contrast, and touch targets are designed together.
- **Progressive disclosure:** show the context needed to choose a path, then let the visitor continue through one clear, relevant link rather than placing all content on the landing page.
- **Human material:** photography and personal writing use the same editorial hierarchy as technical material. Real work and observations provide warmth; decoration remains restrained.

### Non-negotiable patterns

1. Do not introduce a second brand accent or a large saturated background.
2. Do not use gradients, glass cards, glow effects, oversized pills, or floating dashboard widgets.
3. Do not use color alone to communicate state or category.
4. Do not create new spacing, radius, shadow, or color values outside the token system.
5. Preserve the same hierarchy and component geometry in light and dark modes.

---

## 2. Color Palette

All colors are CSS custom properties in `assets/theme.css`, named by **role**. Dark is the default (`:root`); light overrides under `[data-theme="light"]`.

### Base

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--color-bg` | `#0E1726` | `#E8F2FF` | page background |
| `--color-bg-2` | `#152238` | `#D9E9FC` | header, footer, code blocks |
| `--color-surface` | `#1D2D45` | `#FFFFFF` | cards, raised surfaces |
| `--color-surface-2` | `#283D5C` | `#DCEBFC` | card hover |
| `--color-border` | `rgba(232,240,250,0.12)` | `rgba(16,33,58,0.10)` | separators |
| `--color-border-strong` | `rgba(232,240,250,0.24)` | `rgba(16,33,58,0.20)` | focused/active borders |

Dark: ink `#0E1726` → slate `#1D2D45` is a clear separation, so contained cards remain visible.
Light: blue-white `#E8F2FF` → white `#FFFFFF` reads like paper with a noticeable but quiet blue cast. `#BDD9FC` is reserved as an optional decorative tint, not a reading background, because it is too saturated for long-form content.

### Text

| Token | Dark | Light | Use |
|---|---|---|---|
| `--color-text` | `#E8F0FA` | `#10213A` | primary |
| `--color-text-subtle` | `#A9B9CD` | `#455C78` | secondary (descriptions, subtitles) |
| `--color-text-muted` | `#8498B0` | `#5A708B` | tertiary (labels, dates, captions) |

### Accent

| Token | Dark | Light | Use |
|---|---|---|---|
| `--color-accent` | `#FF8066` | `#B83F25` | sienna — links, active nav, hero name, focus ring |
| `--color-accent-hover` | `#FF9A85` | `#92331F` | interactive hover/active state |

Sienna is complementary to blue — pops on both palettes without clashing.

### Pop palette

Pop colors are decorative supporting accents only: timeline dots and tag borders/background tints. They must not be used for body text, links, focus indicators, or unlabeled status. Every colored detail has a text label or structural shape.

`--color-pop-green: #7BF1A8` · `--color-pop-blue: #90F1EF` · `--color-pop-purple: #bdb2ff` · `--color-pop-pink: #e82eb3` · `--color-pop-yellow: #f4e409` · `--color-pop-orange: #fe8277`

### Company colors (timeline)
Driven by `timeline.json`'s per-entry `color` hex and used only for the dot and a short border detail. Year and company text use semantic text tokens so arbitrary brand colors never become required reading contrast. The company name remains present next to every dot.

### Tag colors
Fixed CSS classes in `assets/components.css` (`.tag--yellow`, `.tag--blue`, `.tag--green`, etc.). `Tag.tsx` maps tag names to classes. To add a new tag color: add a CSS class + one line in the map.

---

## 3. Theme Toggle

The control has three preferences: `system`, `light`, and `dark`. First visit defaults to `system`; the resolved visual theme follows `prefers-color-scheme`. A user choice is persisted as `localStorage.themePreference`.

- A small inline script in `<head>` runs before CSS paint, safely reads `themePreference`, resolves `system`, and sets `data-theme="light|dark"` plus `data-theme-preference="system|light|dark"` on `<html>`.
- `ThemeToggle.tsx` cycles `system → light → dark`, updates both attributes, persists the preference, and listens for OS changes while preference is `system`.
- The button has a 44px minimum target, visible focus ring, and an explicit label such as `Theme: system. Activate for light theme.` The icon is `aria-hidden`.
- Set `color-scheme: light dark` on `:root`, overridden to the resolved theme, so form controls and browser UI match.
- Storage access is wrapped in `try/catch`; failure falls back to system preference.
- The initialization script should use an external static file or a CSP nonce if a Content Security Policy is enabled.
- Theme changes use a short color transition only when `prefers-reduced-motion: no-preference`.

```css
/* theme.css */
:root {
  --color-bg: #0E1726;
  --color-text: #E8F0FA;
  color-scheme: dark;
  /* ... dark tokens ... */
}
[data-theme="light"] {
  --color-bg: #E8F2FF;
  --color-text: #10213A;
  color-scheme: light;
  /* ... light tokens ... */
}
```

---

## 4. Typography

### Font: one active, switchable
**One font is active at a time.** To switch, change one line:

```css
:root {
  --font-body: "Inter", system-ui, sans-serif;       /* ← change this one line to swap */
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}
```

To switch to Geist Sans: `--font-body: "Geist Sans", system-ui, sans-serif;` and ensure its `@font-face` is active (uncommented). PP Neue Montreal is commercial (no license) — stays commented out.

Self-host font files in `static/fonts/`. Preload via `<link rel="preload">` in `Seo`.

### Type scale (fluid, mobile-first via `clamp()`)
| Token | Use |
|---|---|
| `--text-xs` | tags, dates |
| `--text-sm` | secondary text |
| `--text-base` | body |
| `--text-lg` | lead paragraphs |
| `--text-xl` | card/list titles |
| `--text-2xl` | page H1 |
| `--text-3xl` | landing hero |

Body line-height `1.7`. Headings `1.2`, weight `600`. Paragraph max-width `70ch`.

Typography carries most of the personality. Use sans-serif for reading and mono only for compact metadata, dates, labels, and navigation. Do not render paragraphs or long descriptions in mono.

---

## 5. Spacing & Layout

```css
--space-1: 0.25rem;  --space-2: 0.5rem;  --space-4: 1rem;
--space-6: 1.5rem;   --space-8: 2rem;    --space-12: 3rem;  --space-16: 4rem;
--content-max: 46rem;      /* prose pages */
--content-max-wide: 60rem; /* projects, timeline, blog */
--gutter: clamp(1rem, 0.5rem + 2vw, 2rem);
--radius-sm: 6px;  --radius-md: 10px;  --radius-lg: 16px;  --radius-pill: 9999px;
--shadow-card: 0 2px 8px rgba(0,0,0,0.18);
--transition-base: 200ms ease;
```

---

## 6. Breakpoints

Mobile-first; `min-width` media queries: `768px` (tablet), `1024px` (laptop). No layout depends on JS.

---

## 7. Component Language

- **Divided list:** blog and project rows use whitespace and a 1px border, not individual card backgrounds.
- **Contained card:** timeline and skill groups use `--color-surface`, a visible border, `--radius-md`, and little or no shadow.
- **Section title:** one H1 plus a short sienna subtitle. Never add decorative eyebrow text above it.
- **Metadata:** compact `<dl>` rows with mono labels and normal-font values.
- **Metadata strip:** compact `<dl>` rows with mono labels and normal-font values. A single continuous 3px sienna left rule wraps the full group; it is not repeated per row. The strip uses the three orientation rows: Focus, Based, and Exploring.
- **Tag:** compact, low-saturation treatment. Tags support scanning but never dominate titles.
- **Link:** underlined in prose; elsewhere its shape or placement must still make interactivity clear. Hover and focus use semantic accent tokens.
- **Continuation link:** a short, text-led link at the end of a page section that directs the visitor to the most relevant next page. It uses the standard accent/link treatment, never a filled button.
- **Photo essay:** a Writing post whose images are primary evidence. Images are full-width within the prose measure or may break to the wide content measure, with captions and deliberate pacing. It is not a masonry gallery or infinite photo feed.
- **Numbered discipline:** About-page capability group with a large mono sequence number, heading, one-sentence description, and compact skill line. Only the number receives a muted category color; meaning remains in the text.

### Discipline Number Colors

Use a fixed sequence for up to four About-page disciplines. These colors apply only to large decorative sequence numbers (`01`–`04`), never to body text, links, or status.

| Number | Dark | Light |
|---|---|---|
| `01` | `#90F1EF` | `#2E7D85` |
| `02` | `#FF8066` | `#B83F25` |
| `03` | `#BDB2FF` | `#6656AA` |
| `04` | `#7BF1A8` | `#2B7A52` |
- **Icon control:** icon plus accessible name, 44px target, no filled icon box unless the control needs a selected state.

## 8. Accessibility Contract

- Normal text must meet WCAG AA `4.5:1`; large text and essential graphical details must meet `3:1`.
- Muted colors are for secondary information, never disabled-looking primary content.
- Every interactive element has a visible `:focus-visible` outline using `--color-accent` with at least 2px width and offset.
- Header provides a first-focus skip link to `#main-content`.
- Controls have at least a 44×44px pointer target. Inline prose links are exempt.
- Hover is never the only way to reveal content or an action.
- `prefers-reduced-motion: reduce` disables nonessential transitions and menu animation.
- Layout remains usable at 200% zoom and at a 320px viewport without horizontal page scrolling.
- Forced-colors mode retains borders, focus outlines, labels, and native control affordances.
- External links use visible `↗` text and an accessible label indicating a new tab.

## 9. Optional Background Layer

An optional muted SVG mosaic can sit behind all content: `position: fixed; z-index: -1; opacity: var(--bg-mosaic-opacity, 0)`. The solid theme background is the baseline visual; enable the mosaic only when it supports rather than competes with reading. Its colors derive from the `--color-bg` family in both themes.

---

## 10. CSS Architecture

- `assets/theme.css` — tokens (dark default + light override).
- `assets/global.css` — reset + base elements.
- `assets/layout.css` — header/nav/footer.
- `assets/components.css` — shared `.card`, `.tag`, `.section-title`, `.prose`, `.metadata-strip`, `.landing-links`.
- One file per page (`landing.css`, `about.css`, etc.).
- All imported in `client.ts`. Vite bundles + inlines.
- **Semantic class names** (`.timeline-entry`, not `.flex`). No `!important`.

---

## 11. Markdown Styles (`.prose`)

Server-rendered markdown wrapped in `.prose`. Styles cover `h2`/`h3` (sienna accents + `scroll-margin-top`), `p`, `a`, `ul`/`ol` (sienna bullets), `code`, `blockquote`, `img`. Authors never write CSS.

---

## 12. Reface Cheat Sheet

| Change | Edit |
|---|---|
| Font | `theme.css` `--font-body` (one line) |
| Background (dark) | `theme.css` `:root --color-bg` |
| Background (light) | `theme.css` `[data-theme="light"] --color-bg` |
| Accent | `theme.css` `--color-accent` (both blocks) |
| Company dot color | `timeline.json` → entry `color` |
| Tag color | `assets/components.css` → add `.tag--<name>` + one line in `Tag.tsx` |
| Mosaic | `theme.css` `--bg-mosaic-opacity` + SVG in `_app.tsx` |

## 13. Identity Assets

- **Header logo:** `static/Bitmoji.png`, displayed at approximately 36px and cropped to remain recognizable at that size.
- **Favicon:** an `SJ` monogram on an ink-blue field with a small sienna dot. Do not use the detailed Bitmoji as the favicon.
- **Portrait:** a rounded-square image used on the About page only. It is not the Writing author avatar.

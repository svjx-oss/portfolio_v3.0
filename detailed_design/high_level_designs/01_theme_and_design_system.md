# 01 — Theme & Design System

> This document is the authoritative visual specification. `assets/theme.css` is the implementation source of truth for its tokens.

**Design outcome:** A visitor should perceive a thoughtful practitioner who cares about design, clarity, and execution. Technical depth is demonstrated by the work, experience, and writing, not by overtly technical visual motifs.

**Personality outcome:** The site should also feel approachable, curious, creative, and lived-in. This comes from authentic copy, field notes, and photography, not extra dashboard widgets or visual noise.

---

## 1. Visual Direction: Blue Slate Editorial

- **Editorial first:** content hierarchy comes from type, spacing, rules, and alignment rather than decoration.
- **Blue-slate foundation:** ink-blue dark mode and blue-white light mode feel composed, precise, and easy to read.
- **Colorful focal points:** a compact accent palette gives links and small interaction details varied color without turning the page into a colorful surface.
- **Restrained personality:** color appears in compact, intentional moments such as links, small rules, timeline dots, and tags; surfaces and body copy remain quiet.
- **Lists over grids:** projects and blog entries use divided rows. Cards are reserved for structures that need containment, such as timeline entries and skill groups.
- **Quiet motion:** no carousels, typewriters, parallax, or ambient animation. Transitions only communicate hover, focus, opening, or theme changes.
- **Mobile-first and accessible:** layout, keyboard interaction, contrast, and touch targets are designed together.
- **Progressive disclosure:** show the context needed to choose a path, then let the visitor continue through one clear, relevant link rather than placing all content on the landing page.
- **Human material:** photography and personal writing use the same editorial hierarchy as technical material. Real work and observations provide warmth; decoration remains restrained.

### Non-negotiable patterns

1. Do not introduce colors outside the fixed accent palette or a large saturated background.
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

### Accent palette

| Token | Dark | Light | Use |
|---|---|---|---|
| `--color-accent-sienna` | `#FF8066` | `#B83F25` | links and small interaction details |
| `--color-accent-blue` | `#90C8FF` | `#2463B8` | links and small interaction details |
| `--color-accent-magenta` | `#FF8DCF` | `#A62D78` | links and small interaction details |
| `--color-accent-green` | `#7BF1A8` | `#287A52` | links and small interaction details |
| `--color-accent-violet` | `#BDB2FF` | `#6656AA` | links and small interaction details |
| `--color-accent-gold` | `#FFD166` | `#8A6500` | links and small interaction details |

Each accent includes a matching hover token in `theme.css` and must meet contrast requirements for its intended foreground/background pairing.

### Accent usage rules

Accent colors create small, deliberate color moments across an otherwise neutral editorial layout. The effect comes from composition and repetition, not randomness, animation, or saturated surfaces.

- Assign link accents deterministically by position within each visual group. The palette restarts for each separate link row, navigation group, footer group, list row, or prose paragraph.
- A generated sequence follows the fixed order: sienna, blue, magenta, green, violet, gold. A named shared link may instead use a stable documented mapping.
- Assigned accent links retain their text color in both themes. Underlines and visible focus indicate interaction without relying on color alone.
- Prose links are underlined. In a paragraph, the first link is sienna, the second blue, the third magenta, and so on; the sequence restarts in the next paragraph.
- Separators, body copy, surfaces, borders, and layout remain neutral. Accent colors do not become page backgrounds, repeated container fills, or large decorative blocks.
- Use a single semantic high-contrast focus token for all focus outlines; focus does not inherit the rotating accent color.
- Color never carries meaning alone. Underlines, labels, placement, and visible focus must still identify interaction when color is unavailable.
- Do not randomize accent assignment per page load or animate through palette colors. Stable assignment avoids visual flicker, SSR/client mismatches, and unnecessary client work.

### Pop palette

Pop colors are decorative supporting accents only: timeline dots and tag borders/background tints. They must not be used for body text, links, focus indicators, or unlabeled status. Every colored detail has a text label or structural shape.

`--color-pop-green: #7BF1A8` · `--color-pop-blue: #90F1EF` · `--color-pop-purple: #bdb2ff` · `--color-pop-pink: #e82eb3` · `--color-pop-yellow: #f4e409` · `--color-pop-orange: #fe8277`

### Company colors (timeline)
Driven by `timeline.json`'s per-entry `color` hex and used only for the dot and a short border detail. Year and company text use semantic text tokens so arbitrary brand colors never become required reading contrast. The company name remains present next to every dot.

### Tag colors
Fixed CSS classes in `assets/components.css` (`.tag--yellow`, `.tag--blue`, `.tag--green`, etc.). `Tag.tsx` maps tag names to classes. To add a new tag color: add a CSS class + one line in the map.

---

## 3. Theme Toggle

The control has two preferences: `light` and `dark`. First visit defaults to `dark`; a user choice is persisted as `localStorage.themePreference`.

- A small inline script in `<head>` runs before CSS paint, safely reads `themePreference`, defaults to `dark`, and sets `data-theme="light|dark"` on `<html>`.
- `ThemeToggle.tsx` switches between light and dark, updates `data-theme`, and persists the preference.
- The theme action appears beside the footer signature as editorial text: `Prefer light mode?` in dark mode and `Prefer dark mode?` in light mode. It has an explicit accessible label, visible focus ring, no visible container or hover tooltip, and underlines on hover/focus.
- Dark tokens are the CSS default; light tokens override under `[data-theme="light"]`, eliminating a cross-page light flash when dark is active.
- Storage access is wrapped in `try/catch`; failure falls back to dark.
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

### Font: Inter
**Inter is the active interface font.** It is loaded once and used for headings, prose, metadata, and navigation.

```css
:root {
  --font-body: "Inter", system-ui, sans-serif;
}
```

Use weight, italics, color, and spacing for hierarchy before adding another font family.

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

Typography carries most of the personality. Use Inter weights, italics, color, and spacing for hierarchy. Do not add a second font family without an approved design change.

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
- **Metadata strip:** compact `<dl>` rows with muted lowercase labels, slight letter-spacing, and normal-font values. A single neutral rule frames the full group. The strip uses the three orientation rows: Focus, Based, and Exploring.
- **Tag:** compact, low-saturation treatment. Tags support scanning but never dominate titles.
- **Link:** underlined in prose; elsewhere its shape or placement must still make interactivity clear. Link accents follow the deterministic usage rules; focus uses the semantic focus token.
- **Continuation link:** a short, text-led link at the end of a page section that directs the visitor to the most relevant next page. It uses its stable assigned accent, never a filled button.
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
- Every interactive element has a visible `:focus-visible` outline using a high-contrast semantic focus token with at least 2px width and offset.
- Header provides a first-focus skip link to `#main-content`.
- Controls have at least a 44×44px pointer target. Inline prose links are exempt.
- Hover is never the only way to reveal content or an action.
- `prefers-reduced-motion: reduce` disables nonessential transitions and menu animation.
- Layout remains usable at 200% zoom and at a 320px viewport without horizontal page scrolling.
- Forced-colors mode retains borders, focus outlines, labels, and native control affordances.
- External links use the standard accent and underline treatment plus an accessible label indicating a new tab. Do not add a visible `↗` marker to ordinary external links.

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

Server-rendered markdown wrapped in `.prose`. Styles cover `h2`/`h3` (small accent details + `scroll-margin-top`), `p`, `a`, `ul`/`ol` (accent bullets), `code`, `blockquote`, `img`. Authors never write CSS.

---

## 12. Reface Cheat Sheet

| Change | Edit |
|---|---|
| Font | `theme.css` `--font-body` (one line) |
| Background (dark) | `theme.css` `:root --color-bg` |
| Background (light) | `theme.css` `[data-theme="light"] --color-bg` |
| Accent palette | `theme.css` `--color-accent-*` tokens and deterministic assignment rules |
| Company dot color | `timeline.json` → entry `color` |
| Tag color | `assets/components.css` → add `.tag--<name>` + one line in `Tag.tsx` |
| Mosaic | `theme.css` `--bg-mosaic-opacity` + SVG in `_app.tsx` |

## 13. Identity Assets

- **Header logo:** `static/Bitmoji.png`, displayed at approximately 36px and cropped to remain recognizable at that size.
- **Favicon:** an `SJ` monogram on an ink-blue field with a small sienna dot. Do not use the detailed Bitmoji as the favicon.
- **Portrait:** a rounded-square image used on the About page only. It is not the Writing author avatar.

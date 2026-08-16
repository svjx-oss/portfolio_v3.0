# 06 — Timeline Page (`/experience`)

> Route: `routes/experience.tsx` · Content: `content/timeline/timeline.json` + `*.md` · CSS: `assets/timeline.css`
> Goal (design doc): show career/education progression. **Redesign:** left-aligned timeline (Q7 — chosen over zig-zag for mobile-friendliness), with the **milestone year highlighted on the rail**.

---

## 1. Content source
- `timeline.json` — array of entries (year, company, role, location, dates, color, md). Schema → `02` §4.
- One `*.md` per role — the detail bullets, rendered as markdown. Pure body, no frontmatter.

## 2. Route handler
```tsx
// routes/experience.tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadTimeline } from "@/lib/loadContent.ts";
import TimelinePage from "@/components/TimelinePage.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const timeline = await loadTimeline();   // reads json + each role's md, renders to html
    return page({ timeline });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <TimelinePage entries={data.timeline.entries} />
));
```
`loadTimeline()` returns `entries: (TimelineEntry & { html: string })[]` — the markdown pre-rendered, so the component is pure presentation.

## 3. `TimelinePage` + `TimelineEntry` components (server, `components/TimelinePage.tsx`)
```tsx
import SectionTitle from "@/components/SectionTitle.tsx";
import type { TimelineEntry } from "@/lib/types.ts";

export default function TimelinePage({ entries }: { entries: TimelineEntry[] }) {
  return (
    <article class="timeline">
      <SectionTitle title="Experience" subtitle="full-time & education" />
      <ol class="timeline__rail">
        {entries.map((e) => <TimelineEntryView entry={e} />)}
      </ol>
    </article>
  );
}

function TimelineEntryView({ entry }: { entry: TimelineEntry }) {
  return (
    <li class="timeline-entry" style={{ "--node-color": entry.color }}>
      <div class="timeline-entry__node" aria-hidden="true" />
      <div class="timeline-entry__year">{entry.year}</div>
      <div class="timeline-entry__card card">
        <header class="timeline-entry__header">
          <h2 class="timeline-entry__role">{entry.role}</h2>
          <p class="timeline-entry__company">{entry.company}</p>
          <p class="timeline-entry__meta">
            <time>{entry.dates}</time> · <span>{entry.location}</span>
          </p>
        </header>
        <div class="prose timeline-entry__body" dangerouslySetInnerHTML={{ __html: entry.html }} />
      </div>
    </li>
  );
}
```
- `--node-color` (set inline from `entry.color`) drives the dot + year accent for that entry — no per-company CSS classes, all data-driven.
- The order in `timeline.json` is the display order (most-recent first). The `<ol>` reflects that semantically.

## 4. Left-aligned timeline layout (the redesign)

A vertical rail on the **left** (~80px from the viewport edge on mobile, ~120px on desktop). Each entry has:
- a **node** (colored dot) on the rail, sized ~16px,
- the **year** rendered **on the rail, immediately above the node** as a bold mono label (the "year highlighted in the middle" — here "in the middle of the timeline" reads as *on the rail*, prominent),
- a **card** to the right of the rail with the role/company/dates + the rendered bullet list.

This is intrinsically mobile-friendly (the rail sits at a fixed left margin; cards stack to the right full-width) — no zig-zag layout reflow needed at breakpoints. This is exactly why you switched from zig-zag to left-aligned (Q7).

### 4.1 ASCII (desktop)
```
   │
   ● 2023   ┌─────────────────────────────────────────┐
   │        │ Embedded Software Engineer              │
   │        │ Apple Inc. · Cupertino, CA             │
   │        │ Jan 2023 - Present                      │
   │        │ • Silicon Engineering Group (SEG)      │
   │        │ • Directed design/development of an...  │
   │        │ • ...                                   │
   │        └─────────────────────────────────────────┘
   │
   ● 2022   ┌─────────────────────────────────────────┐
   │        │ Student                                 │
   │        │ Purdue University · West Lafayette, IN  │
   │        │ MS Fall 2022 · BS Fall 2021             │
   │        │ • Teaching Assistant: ...               │
   │        └─────────────────────────────────────────┘
   │
   ● 2022   ┌─ Apple intern ─────────────────────────┐
   │        └─────────────────────────────────────────┘
   ⋮
```
Full wireframes → `09`.

### 4.2 CSS (`timeline.css`) — key rules
```css
.timeline__rail { list-style: none; padding-left: 0; margin: var(--space-12) 0 0;
  border-left: 2px solid var(--color-border); /* the rail line */
  display: flex; flex-direction: column; gap: var(--space-12); }
.timeline-entry { position: relative; padding-left: calc(var(--space-12) + 1rem); }   /* room for node+year */
.timeline-entry__year {
  position: absolute; left: 0; top: -1.25rem;
  font-family: var(--font-mono); font-weight: 700; font-size: var(--text-sm);
  color: var(--node-color, var(--color-accent));            /* company color */
  background: var(--color-bg); padding: 0 var(--space-1);
}
.timeline-entry__node {
  position: absolute; left: -9px; top: 0.4rem;              /* sits on the rail line */
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--node-color); border: 3px solid var(--color-bg);   /* ring effect */
  box-shadow: 0 0 0 2px var(--node-color);
}
.timeline-entry__card { /* uses shared .card */ }
.timeline-entry__role { font-size: var(--text-xl); margin: 0; }
.timeline-entry__company { color: var(--node-color); font-weight: 600; margin: 2px 0; }
.timeline-entry__meta { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); margin: 0 0 var(--space-3); }
```
- The rail is a `border-left` on the `<ol>` — one line, no SVG. The node is an absolutely-positioned colored dot straddling the line. The year sits just above the node in the company color.
- Mobile: identical layout — the left rail naturally accommodates narrow widths; the card just gets the remaining width. No media queries needed for the *structure* (only minor padding tweaks via the fluid `--gutter`/`--space-*`).

## 5. Why not zig-zag (recorded rationale, Q7)
The zig-zag (alternating left/right) requires a breakpoint to collapse to a single side on mobile — extra CSS, a distinct mobile layout, and more fiddly absolute positioning. Left-aligned keeps **one** layout at all widths, is more scannable, and still shows the year prominently on the rail. Trade-off: less symmetric visual flair, but better matches "mobile friendly" + "simple, debuggable."

## 6. Plain semantic HTML (no UI library)
This page is plain semantic HTML + ~30 lines of CSS. The timeline rail is a `border-left` on the `<ol>`; nodes are absolutely-positioned colored dots. Company colors come from `timeline.json`'s per-entry `color` field — no per-company CSS classes. Keeping this page dependency-free is intentional: it's debuggable and editable by hand.

## 7. Implementation notes
- Role entries and their bullet markdown are authored in `content/timeline/timeline.json` + per-role `.md` files — see `02` §4.
- Inline bold spans in the bullets render as neutral white bold (`--color-text`). The company color shows on the year + company-name line via `--node-color`. If you want per-company colored bold *inside* bullets, use inline `<span class="pop-*">` in the role markdown.

## 8. Analytics
- page_view auto. The timeline cards have no outbound links. If you later add links (e.g., a project link from a role), they'd auto-tag by destination.

## 9. Open timeline questions (→ `12_open_questions.md`)
- **T1** Inline company-name highlights inside bullets: neutral bold (default) vs. per-company colored bold via inline HTML. (Resolved: neutral bold.)
- **T2** Should the year node be a clickable anchor (so you can deep-link to a role)? (Resolved: no — YAGNI.)

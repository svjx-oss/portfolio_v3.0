# 06 — Timeline Page (`/experience`)

> Route: `routes/experience.tsx` · Content: `content/timeline/timeline.json` + `*.md` · CSS: `assets/timeline.css`
> Wireframe: `09` §3

Left-aligned rail. Large year on rail, narrative role entry to the right. Same reading order at all breakpoints.

**Goal:** demonstrate professional depth through a chronological narrative. End with one text link to `/projects` (`View selected projects →`).

---

## Route

```tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadTimeline } from "@/lib/loadContent.ts";
import TimelinePage from "@/components/TimelinePage.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const timeline = await loadTimeline();
    return page({ timeline });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <TimelinePage entries={data.timeline.entries} />
));
```

## Component

```tsx
// components/TimelinePage.tsx
import SectionTitle from "@/components/SectionTitle.tsx";
import type { TimelineEntry } from "@/lib/types.ts";

export default function TimelinePage({ entries }: { entries: TimelineEntry[] }) {
  return (
    <article class="timeline">
      <SectionTitle title="Experience" subtitle="full-time & education" />
      <ol class="timeline__rail">
        {entries.map((e) => (
          <li class="timeline-entry" style={{ "--node-color": e.color }}>
            <div class="timeline-entry__node" />
            <div class="timeline-entry__year">{e.year}</div>
            <section class="timeline-entry__content">
              <div class="timeline-entry__heading">
                <h2 class="timeline-entry__company">{e.company}</h2>
                {e.current && <span class="timeline-entry__current">Present</span>}
              </div>
              <p class="timeline-entry__role">{e.role} · {e.location}</p>
              <p class="timeline-entry__dates"><time>{e.dates}</time></p>
              <p class="timeline-entry__summary">{e.summary}</p>
              <div class="prose" dangerouslySetInnerHTML={{ __html: e.html }} />
            </section>
          </li>
        ))}
      </ol>
      <p class="page-continuation"><a href="/projects">View selected projects →</a></p>
    </article>
  );
}
```

`--node-color` (from `entry.color`) drives the dot and a short border accent only. Year and company name use semantic text tokens so company colors are never required to pass text contrast. The `Present` marker is plain text, not a live or animated status badge. Plain HTML + CSS. No UI library.

## CSS

- `.timeline__rail` — `border-left: 2px solid var(--color-border)`.
- `.timeline-entry__node` — absolute dot on rail, `background: var(--node-color)`.
- `.timeline-entry__year` — large mono year on the rail, `--color-text-muted`.
- `.timeline-entry__content` — editorial entry with a thin bottom divider and optional short color border detail. No filled card surface or repeated box treatment.
- `.timeline-entry__summary` — one concise sentence before the Markdown bullets. Bullets are limited to two through four per role.
- `.timeline-entry__current` — small mono `Present` text, using a semantic text token with a non-color textual label.
- No layout reflow between breakpoints.
- `.page-continuation` follows the final timeline entry and uses the shared continuation-link treatment.

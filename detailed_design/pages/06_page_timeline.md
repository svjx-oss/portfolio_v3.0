# 06 — Timeline Page (`/experience`)

> Route: `routes/experience.tsx` · Content: `content/timeline/timeline.json` + `*.md` · CSS: `assets/timeline.css`
> Wireframe: `09` §3

Left-aligned rail. Year on rail (company color), card to right. Same layout all breakpoints.

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
            <div class="timeline-entry__card card">
              <h2 class="timeline-entry__role">{e.role}</h2>
              <p class="timeline-entry__company">{e.company}</p>
              <p class="timeline-entry__meta"><time>{e.dates}</time> · {e.location}</p>
              <div class="prose" dangerouslySetInnerHTML={{ __html: e.html }} />
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
```

`--node-color` (from `entry.color`) drives the dot + year + company name. Plain HTML + CSS. No UI library.

## CSS

- `.timeline__rail` — `border-left: 2px solid var(--color-border)`.
- `.timeline-entry__node` — absolute dot on rail, `background: var(--node-color)`.
- `.timeline-entry__year` — above node, `var(--node-color)`, mono.
- No layout reflow between breakpoints.

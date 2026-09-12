# 06 — Experience Page (`/experience`)

> Route: `routes/experience.tsx` · Content: `content/experience/experience.json` + `*.md` · CSS: `assets/experience.css`
> Wireframe: `09` §3

On desktop, the year occupies a narrow left column and the narrative role entry sits to its right. A short colored bar prefixes the organization name. On narrow screens, the year returns above its entry. Reading order remains unchanged.

**Goal:** demonstrate professional depth through a chronological narrative.

---

## Route

```tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadExperience } from "@/lib/loadContent.ts";
import ExperiencePage from "@/components/ExperiencePage.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const experience = await loadExperience();
    return page({ experience });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <ExperiencePage entries={data.experience.entries} />
));
```

## Component

```tsx
// components/ExperiencePage.tsx
import Markdown from "@/components/Markdown.tsx";
import type { ExperienceEntry } from "@/lib/types.ts";

export default function ExperiencePage({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <article class="timeline">
      <h1 class="timeline__title">Experience</h1>
      <ol class="timeline__rail">
        {entries.map((entry) => (
          <li class="timeline-entry" style={{ "--node-color": entry.color }}>
            <p class="timeline-entry__year">{entry.year}</p>
            <section class="timeline-entry__content">
              <h2 class="timeline-entry__company">
                {entry.company}
                {entry.current && <span class="timeline-entry__current">Present</span>}
              </h2>
              <p class="timeline-entry__role">{entry.role} · {entry.location}</p>
              <p class="timeline-entry__dates">{entry.dates}</p>
              <p class="timeline-entry__summary">{entry.summary}</p>
              <Markdown html={entry.html} />
            </section>
          </li>
        ))}
      </ol>
    </article>
  );
}
```

`--node-color` (from `entry.color`) drives only the short bar before the organization name. Year and company name use semantic text tokens so company colors are never required to pass text contrast. The `Present` marker is plain text, not a live or animated status badge. Plain HTML + CSS. No UI library.

## CSS

- `.timeline__rail` — unstyled ordered list with vertical spacing between entries.
- `.timeline-entry` — editorial entry with a thin bottom divider. At desktop widths, it becomes a two-column grid with the year at left.
- `.timeline-entry__year` — compact muted year in the left column on desktop and above the entry on narrow screens.
- `.timeline-entry__company::before` — short 2px vertical color bar using `--node-color`; it sits immediately before the organization name.
- `.timeline-entry__content` — narrative content column. No filled card surface or repeated box treatment.
- `.timeline-entry__summary` — one concise sentence before the Markdown bullets. Bullets are limited to two through four per role.
- `.timeline-entry__current` — small mono `Present` text, using a semantic text token with a non-color textual label.
- The desktop grid collapses to a single column on narrow screens while preserving reading order.

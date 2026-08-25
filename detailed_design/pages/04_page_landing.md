# 04 — Landing Page (`/`)

> Route: `routes/index.tsx` · Content: `content/landing.md` · CSS: `assets/landing.css`
> Wireframe: `09` §1

**Goal:** introduce a point of view and direct the visitor into the portfolio. Minimal hero + metadata strip + two short point-of-view paragraphs + link row.

**Visitor path:** identity → orientation → point of view → clear paths into Projects, Writing, and the resume. The page ends with generous whitespace.

---

## Route

```tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadLanding } from "@/lib/loadContent.ts";
import Landing from "@/components/Landing.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const landing = await loadLanding();
    return page({ landing });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <Landing {...data.landing} />
));
```

## Component

```tsx
// components/Landing.tsx
import type { Landing } from "@/lib/types.ts";

function renderTagline(tagline: string, emphasis?: string) {
  if (!emphasis) return tagline;
  const [before, after] = tagline.split(emphasis);
  return <>{before}<span class="tagline__emphasis">{emphasis}</span>{after}</>;
}

export default function Landing({ frontmatter, html }: Landing) {
  const { name, tagline, tagline_emphasis, metadata } = frontmatter;
  return (
    <article class="landing">
      <h1 class="hero-name">{name}</h1>
      <p class="tagline">{renderTagline(tagline, tagline_emphasis)}</p>

      <dl class="metadata-strip">
        {metadata.map((m) => (
          <div class="metadata-row">
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>

      <div class="prose" dangerouslySetInnerHTML={{ __html: html }} />

    </article>
  );
}
```

- No island. Fully static HTML.
- The Markdown body is exactly two short point-of-view paragraphs followed by one text link row: Projects · Writing · Resume. It is not a resume summary or a second About page.
- Resume link in the link row is a direct path to `/resume.pdf`.

## CSS

- `.landing` — centered, `--content-max`, left-biased, generous top padding.
- `.hero-name` — `--text-3xl`, bold, `--color-text`.
- `.tagline` — `--text-lg`, `--color-text-subtle`.
- `.tagline__emphasis` — sienna; the only emphasized phrase in the hero.
- `.metadata-strip` — thin divider rules, one continuous `border-left: 3px solid var(--color-accent)` around the full group, `padding-left: var(--space-3)`, mono labels, subtle values. Use three concise orientation rows (`Focus`, `Based`, `Exploring`). Do not add a separate bar to each `.metadata-row`.
- `.landing .prose` — no more than two short paragraphs plus one `.landing-links` row. The link row uses text links with `·` separators, not a button group.
- The landing ends after the link row with generous whitespace. Do not add featured content, previews, cards, feeds, or an additional CTA.
- `.prose a` — accent, underline.

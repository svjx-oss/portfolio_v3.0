# 04 — Landing Page (`/`)

> Route: `routes/index.tsx` · Content: `content/landing.md` · CSS: `assets/landing.css`
> Wireframe: `09` §1

**Goal:** introduce who you are — entice clicks into child pages. Minimal hero + metadata strip + "Now" block + prose.

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

const POP_COLORS: Record<string, string> = {
  green: "var(--color-pop-green)",
  blue: "var(--color-pop-blue)",
  purple: "var(--color-pop-purple)",
  orange: "var(--color-pop-orange)",
  pink: "var(--color-pop-pink)",
  yellow: "var(--color-pop-yellow)",
};

export default function Landing({ frontmatter, html }: Landing) {
  const { name, tagline, metadata, now } = frontmatter;
  return (
    <article class="landing">
      <h1 class="hero-name">{name}</h1>
      <p class="tagline">{tagline}</p>

      <dl class="metadata-strip">
        {metadata.map((m) => (
          <div class="metadata-row">
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>

      {now && (
        <div class="now-block">
          <h2 class="now-block__title">Now</h2>
          {now.map((item) => (
            <div class="now-item" style={{ "--accent": POP_COLORS[item.color] ?? "var(--color-accent)" }}>
              <span class="now-item__label">{item.label}</span>
              <span class="now-item__value">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      <div class="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
```

- No island. Fully static HTML.
- `now` items render as rows, each with a colored left border (`border-left: 3px solid var(--accent)`) — Option B. The color comes from the `color` field in frontmatter, mapped to a `--color-pop-*` token.
- Resume link in the body is a direct path to `/static/resume.pdf`.

## CSS

- `.landing` — centered, `--content-max`, left-biased, generous top padding.
- `.hero-name` — `--text-3xl`, bold, sienna.
- `.tagline` — `--text-lg`, `--color-text-subtle`.
- `.metadata-strip` — thin divider rules, mono labels, subtle values.
- `.now-block` — a "Now" heading + rows. Each `.now-item` has `border-left: 3px solid var(--accent)` (per-item color), `padding-left: var(--space-3)`, label in mono `--color-text-muted`, value in `--color-text`. Visually distinct from the metadata strip above it.
- `.prose a` — accent, underline.

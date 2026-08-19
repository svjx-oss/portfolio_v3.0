# 05 — About Page (`/about`)

> Route: `routes/about.tsx` · Content: `content/about.md` · CSS: `assets/about.css`
> Wireframe: `09` §2

---

## Route

```tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadAbout } from "@/lib/loadContent.ts";
import AboutPage from "@/components/AboutPage.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const about = await loadAbout();
    return page({ about });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <AboutPage {...data.about} />
));
```

## Component

```tsx
// components/AboutPage.tsx
import SectionTitle from "@/components/SectionTitle.tsx";
import type { About } from "@/lib/types.ts";

export default function AboutPage({ frontmatter, html }: About) {
  const { portrait, portrait_alt, skillset } = frontmatter;
  return (
    <article class="about">
      <SectionTitle title="About Me" subtitle="in more depth" />
      <div class="about__top">
        <img class="about__portrait" src={portrait} alt={portrait_alt} width="320" height="320" />
        <div class="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <section class="about__skills">
        <h2>Professional Skillset</h2>
        <div class="skill-grid">
          {skillset.map((g) => (
            <div class="skill-card">
              <h3>{g.label}</h3>
              <ul>{g.items.map((it) => <li>{it}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
```

- No `SkillCard` component — it's 5 lines, inline in `AboutPage`. Simpler.
- No `icon` field — pure typography cards (label + items).
- Bio paragraphs: optional color via `<span class="pop-green">`.

## CSS

- Desktop: portrait left, bio right. Mobile: portrait centered above bio.
- Skill grid: 1 col → 2 col ≥640px → 3 col ≥1024px.

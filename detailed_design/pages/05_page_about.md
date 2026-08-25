# 05 — About Page (`/about`)

> Route: `routes/about.tsx` · Content: `content/about.md` · CSS: `assets/about.css`
> Wireframe: `09` §2

**Goal:** provide personal context and working approach after the landing introduction. End with one text link to `/experience` (`View experience →`).

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
  const { portrait, portrait_alt, intro, outside_of_work, skillset } = frontmatter;
  return (
    <article class="about">
      <SectionTitle title="About Me" subtitle="in more depth" />
      <section class="about__intro">
        <img class="about__portrait" src={portrait} alt={portrait_alt} width="320" height="320" />
        <p class="about__intro-copy">{intro}</p>
      </section>
      <div class="prose about__bio" dangerouslySetInnerHTML={{ __html: html }} />
      {outside_of_work && (
        <section class="about__outside" aria-labelledby="outside-title">
          <h2 id="outside-title">Outside of work</h2>
          <p>{outside_of_work}</p>
        </section>
      )}
      <section class="about__disciplines" aria-labelledby="disciplines-title">
        <h2 id="disciplines-title">What I work with</h2>
        <ol class="discipline-list">
          {skillset.map((g, index) => (
            <li class="discipline">
              <span class={`discipline__number discipline__number--${index + 1}`} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div class="discipline__content">
                <h3>{g.label}</h3>
                <p>{g.description}</p>
                <p class="discipline__items">{g.items.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <p class="page-continuation"><a href="/experience">View experience →</a></p>
    </article>
  );
}
```

- No card grid or icon field. Disciplines are an ordered editorial list: number, heading, description, and compact skill line.
- The portrait sits only beside `intro`; the longer Markdown biography returns to a full-width reading column below it.
- `outside_of_work` is optional and provides one authentic personal note. It is not a photo gallery, activity feed, or second biography.
- Bio prose does not accept authored color spans. Emphasis uses semantic Markdown and the shared prose styles.

## CSS

- Desktop: portrait left (30–35% of the intro row), editorial intro right. Mobile: portrait centered above intro.
- `.about__bio` returns to the prose measure below the intro row; long copy is never squeezed beside the portrait.
- `.about__outside` follows the biography with a thin top rule and short normal-text paragraph.
- Disciplines remain a single vertical list at every breakpoint. Thin dividers separate groups; numbers sit in a fixed left column on desktop and compact inline column on mobile.
- `.discipline__number--1` through `--4` use the fixed decorative color sequence from `01`. Headings, descriptions, and items use semantic text tokens in both themes.
- `.page-continuation` appears after the skills section as the page's only forward path.

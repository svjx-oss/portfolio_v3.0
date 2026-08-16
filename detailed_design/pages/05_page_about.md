# 05 — About Page (`/about`)

> Route: `routes/about.tsx` · Content: `content/about.md` · CSS: `assets/about.css`
> Goal (design doc): a longer dialogue about you, how you got here.

---

## 1. Content source
`content/about.md` — frontmatter (`portrait`, `portrait_alt`, `skillset[]`) + body (bio paragraphs). Schema → `02` §3.

## 2. Route handler
```tsx
// routes/about.tsx
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

## 3. `AboutPage` component (server, `components/AboutPage.tsx`)
```tsx
import SectionTitle from "@/components/SectionTitle.tsx";
import SkillCard from "@/components/SkillCard.tsx";
import type { About } from "@/lib/types.ts";

export default function AboutPage({ frontmatter, html }: About) {
  const { portrait, portrait_alt, skillset } = frontmatter;
  return (
    <article class="about">
      <SectionTitle title="About Me" subtitle="in more depth" />
      <div class="about__top">
        <img class="about__portrait" src={portrait} alt={portrait_alt} width="320" height="320" />
        <div class="prose about__bio" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <section class="about__skills">
        <h2 class="about__skills-title">Professional Skillset</h2>
        <div class="skill-grid">
          {skillset.map((g) => <SkillCard group={g} />)}
        </div>
      </section>
    </article>
  );
}
```
- `SectionTitle` is the shared "H1 + sienna subtitle" component (also used on other pages).
- The bio paragraphs render inside `.prose` (shared markdown styles — `01` §9) via `dangerouslySetInnerHTML` (sanitized — `02` §7).

## 4. `SkillCard` component (server, `components/SkillCard.tsx`)
```tsx
import SkillIcon from "@/components/icons.tsx";
import type { SkillGroup } from "@/lib/types.ts";

export default function SkillCard({ group }: { group: SkillGroup }) {
  return (
    <div class="skill-card">
      {group.icon && <SkillIcon name={group.icon} />}
      <h3 class="skill-card__label">{group.label}</h3>
      <ul class="skill-card__items">
        {group.items.map((it) => <li>{it}</li>)}
      </ul>
    </div>
  );
}
```
- `SkillIcon` maps a semantic key (`code`, `chip`, `board`, `cloud`, `db`, `layers`) to a small inline SVG in `components/icons.tsx`. Unmapped → no icon. (Resolved C2: keep icons.)

## 5. Layout & CSS (`about.css`)
### 5.1 Top: portrait beside bio
- Mobile (<768px): portrait **above** bio, centered, `max-width: 260px`, rounded `var(--radius-lg)`, subtle `--color-border` ring. Bio stacks below.
- ≥768px: portrait **left** (fixed ~320px), bio to the right; grid `1fr 2fr`, `gap: var(--space-8)`.

### 5.2 Skillset grid
- Mobile: 1 column. ≥640px: 2 columns. ≥1024px: 3 columns. `gap: var(--space-4)`.
- `.skill-card` — `background: var(--color-surface)`, `border: var(--color-border)`, `border-radius: var(--radius-md)`, `padding: var(--space-4)`. Icon (if any) top, label bold, items as a wrapped chip list (`display: flex; flex-wrap: wrap; gap: 6px`), each item a subtle pill (`background: var(--color-bg-2); border-radius: var(--radius-pill); font-family: var(--font-mono); font-size: var(--text-xs)`).

### 5.3 Bio paragraph color (flagged)
Per `02` §3 design note: per-paragraph color dropped; text is uniform `--color-text`. Escape hatch: wrap a paragraph in `<span class="pop-green">…</span>` inline HTML in the markdown (sanitizer allows `class` on `<span>` for `pop-*` classes). Confirm in review.

## 6. Responsive wireframe
```
Mobile:                         Desktop ≥768px:
┌───────────────┐               ┌───────────────────────────────────┐
│  About Me     │               │  About Me                         │
│  in more depth│               │  in more depth                    │
├───────────────┤               ├─────────┬─────────────────────────┤
│   [portrait]  │               │         │ I was born and raised... │
├───────────────┤               │ [portr. │ Ever since I was young...│
│ I was born... │               │  320px] │ As an outdoor person...   │
│ Ever since... │               │         │ I have a deep interest...  │
│ As an out...  │               │         │ Professionally...          │
│ ...           │               │         │ I have completed my...     │
├───────────────┤               ├─────────┴─────────────────────────┤
│ Professional  │               │ Professional Skillset             │
│ Skillset      │               │ ┌────┐ ┌────┐ ┌────┐               │
│ ┌──────────┐  │               │ │Lang│ │Emb │ │Hw  │  (3-col grid) │
│ │Languages │  │               │ └────┘ └────┘ └────┘               │
│ └──────────┘  │               │ ┌────┐ ┌────┐ ┌────┐               │
│ ┌──────────┐  │               │ │Clou│ │DB  │ │Frmw│               │
│ │Embedded  │  │               │ └────┘ └────┘ └────┘               │
│ └──────────┘  │               └───────────────────────────────────┘
```

## 7. Implementation notes
- Bio paragraphs and skillset groups are authored in `content/about.md` — see `02` §3.
- Portrait: a static `<img>` with explicit `width/height` (no CLS), `loading="eager"` (above the fold on this page), and a plain navy placeholder background while loading (no blur-up library — simpler, fine for one image).
- Skillset `icon` is a semantic key mapped to a small inline SVG in `icons.tsx` (`code`, `chip`, `board`, `cloud`, `db`, `layers`). Unmapped → no icon.

## 8. Analytics
- No special events; page_view is auto. The resume link is not on this page (it's on landing + footer). Outbound links (none intrinsic here) would be auto-tagged if added.

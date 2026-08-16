# 07 — Projects Page (`/projects`)

> Route: `routes/projects.tsx` · Content: `content/projects/projects.json` · CSS: `assets/projects.css`
> Goal (design doc): users see a project, a short description, and an optional link for more. **No pro/personal toggle** (Q8) — a single responsive card grid. Order/format not important.

---

## 1. Content source
`projects.json` — `colors` (tag→hex map) + `projects` (flat array). Each project has separate `file` (local) and `url` (external) fields (Q9). Schema → `02` §5.

## 2. Route handler
```tsx
// routes/projects.tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadProjects } from "@/lib/loadContent.ts";
import ProjectsPage from "@/components/ProjectsPage.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const projects = await loadProjects();
    return page({ projects });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <ProjectsPage {...data.projects} />
));
```

## 3. `ProjectsPage` + `ProjectCard` + `Tag` (server components, `components/`)
```tsx
// components/ProjectsPage.tsx
import SectionTitle from "@/components/SectionTitle.tsx";
import ProjectCard from "@/components/ProjectCard.tsx";
import type { Projects } from "@/lib/types.ts";

export default function ProjectsPage({ colors, projects }: Projects) {
  return (
    <article class="projects">
      <SectionTitle title="Projects" subtitle="stuff i've worked on" />
      <div class="project-grid">
        {projects.map((p) => <ProjectCard project={p} colors={colors} />)}
      </div>
    </article>
  );
}
```
```tsx
// components/ProjectCard.tsx
import Tag from "@/components/Tag.tsx";
import type { Project } from "@/lib/types.ts";

export default function ProjectCard({ project, colors }: { project: Project; colors: Record<string, string> }) {
  const more = project.url || project.file || null;
  return (
    <article class="project-card card">
      {project.image && (
        <img class="project-card__img" src={project.image} alt={project.alt} loading="lazy" width="600" height="360" />
      )}
      <div class="project-card__body">
        <h2 class="project-card__title">{project.title}</h2>
        <p class="project-card__desc">{project.description}</p>
        <ul class="project-card__tags">
          {project.tags.map((t) => <Tag tag={t} bg={colors[t]} />)}
        </ul>
        {more && (project.url
          ? <a class="project-card__more" href={project.url} target="_blank" rel="noopener noreferrer">more information ↗</a>
          : <a class="project-card__more" href={project.file}>more information ↗</a>)}
      </div>
    </article>
  );
}
```
```tsx
// components/Tag.tsx
function luminance(hex: string): number {
  /* relative luminance from #rrggbb — small helper */
  return 0;
}
export default function Tag({ tag, bg }: { tag: string; bg: string }) {
  const fg = luminance(bg) > 0.5 ? "#11305c" : "#ffffff";   // auto text color
  return <li class="tag" style={{ backgroundColor: bg, color: fg }}>{tag}</li>;
}
```
- **No toggle, no imperative DOM manipulation.** Pure render of a flat list of cards. State is data-driven from `projects.json`.
- `Tag` computes dark/light text from the hex via the `luminance()` helper (per `02` §5.2). Colors come from JSON → inline style. No CSS per tag.
- Image: native `<img loading="lazy">` with explicit `width/height` to avoid CLS. Images served from `static/projects/` (you can optimize the source files to `.webp` later; not required for v1).

## 4. Layout & CSS (`projects.css`)
```css
.project-grid { display: grid; gap: var(--space-6);
  grid-template-columns: 1fr; }                      /* mobile: 1 col */
@media (min-width: 640px) { .project-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px){ .project-grid { grid-template-columns: repeat(3, 1fr); } }

.project-card { display: flex; flex-direction: column; overflow: hidden; }
.project-card__img { width: 100%; aspect-ratio: 5/3; object-fit: cover; border-bottom: 1px solid var(--color-border); }
.project-card__body { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-4); flex: 1; }
.project-card__title { font-size: var(--text-xl); margin: 0; }
.project-card__desc { font-size: var(--text-sm); color: var(--color-text-subtle); line-height: 1.55; }
.project-card__tags { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; padding: 0; margin: auto 0 0; }  /* tags pinned bottom */
.project-card__more { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-accent); text-decoration: none; align-self: flex-start; }
.project-card__more:hover { color: var(--color-accent-2); }
```
- The old project card had a **fixed-height scrollable description** (`h-40`). We drop that — descriptions are short; natural height is cleaner and more readable. (If a description ever gets long, clamp via `-webkit-line-clamp: 6` — optional, not in v1.)
- Tags pinned to the card bottom (`margin: auto 0 0`) so cards in a row align visually even with different text lengths.

## 5. Responsive wireframe
```
Mobile (1-col):          ≥640px (2-col):        ≥1024px (3-col):
┌────────────┐           ┌──────┐ ┌──────┐     ┌────┐┌────┐┌────┐
│ [img]      │           │[img] │ │[img] │     │[img]││[img]││[img]│
│ MapReduce  │           │MapRed│ │USB   │     │MapR ││USB ││2048│
│ Developed..│           │Developed.│Designed.│  │Developed.│...│...│
│ [C][OpenMP]│           │[C][OM]│ │[SV].. │     │[C]..││[SV]││[C] │
│ more ↗     │           │more↗ │ │       │     │more↗││    ││    │
└────────────┘           └──────┘ └──────┘     └────┘└────┘└────┘
```

## 6. Implementation notes
- Projects and the `colors` map are authored in `content/projects/projects.json` — see `02` §5. The list is a single flat array (no pro/personal split).
- `colors` maps each tag key to a hex (not a CSS class). Every tag used by a project must exist in `colors` (validation enforces).
- `file` vs `url`: a project uses `file` (local PDF) **or** `url` (external) — at most one. If both empty, no "more info" link is shown. Validation enforces mutual exclusivity (`02` §9).

## 7. Analytics (doc `10`)
- `more ↗` external (`url`) → `outbound_click` (label = project title or domain).
- `more ↗` local PDF (`file`) → `project_file_open` (label = filename).
- No nav-style events here; the page is a leaf.

## 8. Open projects questions (→ `12_open_questions.md`)
- **P1** Drop the fixed-height scrollable description (natural height)? (Resolved: yes.)
- **P2** Convert project images to `.webp` for size? (Resolved: defer — ship the existing images first; optimize later.)

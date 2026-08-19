# 07 — Projects Page (`/projects`)

> Route: `routes/projects.tsx` · Content: `content/projects/projects.json` · CSS: `assets/projects.css`
> Wireframe: `09` §4

**Layout:** simple list (not cards). Title + description + tags + optional link. (paco/delba/imkylelambert style)

---

## Route

```tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadProjects } from "@/lib/loadContent.ts";
import ProjectList from "@/components/ProjectList.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const projects = await loadProjects();
    return page({ projects });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <ProjectList {...data.projects} />
));
```

## Component

```tsx
// components/ProjectList.tsx
import Tag from "@/components/Tag.tsx";
import type { Projects } from "@/lib/types.ts";

export default function ProjectList({ projects }: Projects) {
  return (
    <article class="projects">
      <SectionTitle title="Projects" subtitle="stuff I've worked on" />
      <ul class="project-list">
        {projects.projects.map((p) => (
          <li class="project-row">
            <div class="project-row__header">
              <h2 class="project-row__title">{p.title}</h2>
              {p.link && (
                <a class="project-row__link" href={p.link} target={p.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">more ↗</a>
              )}
            </div>
            <p class="project-row__desc">{p.description}</p>
            <ul class="project-row__tags">{p.tags.map((t) => <Tag tag={t} />)}</ul>
          </li>
        ))}
      </ul>
    </article>
  );
}
```

```tsx
// components/Tag.tsx — tag colors are CSS classes, not JSON-driven
const TAG_CLASSES: Record<string, string> = {
  c: "tag--yellow", python: "tag--yellow", javascript: "tag--yellow",
  react: "tag--blue", openmp: "tag--green", mpi: "tag--green",
  // ...etc — a fixed palette in components.css
};
export default function Tag({ tag }: { tag: string }) {
  const cls = TAG_CLASSES[tag.toLowerCase()] ?? "tag--default";
  return <li class={`tag ${cls}`}>{tag}</li>;
}
```

- No images, no cards. Just a list with thin dividers.
- `link` is one field — if it starts with `http`, opens external. If empty, no link.
- Tag colors are CSS classes (fixed palette in `components.css`), not JSON-driven inline styles. To add a new tag color, add a CSS class + one line in the map.

## CSS

- `.project-list` — list, thin `border-top` dividers between rows.
- `.project-row__header` — flex, space-between (title left, link right).
- `.project-row__title` — `--text-xl`, bold.
- `.project-row__desc` — `--text-sm`, `--color-text-subtle`.
- `.tag--yellow` / `.tag--blue` / etc — fixed background + text color classes.

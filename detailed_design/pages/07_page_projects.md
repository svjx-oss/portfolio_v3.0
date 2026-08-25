# 07 — Projects Page (`/projects`)

> Route: `routes/projects.tsx` · Content: `content/projects/projects.json` · CSS: `assets/projects.css`
> Wireframe: `09` §4

**Layout:** numbered editorial list (not cards). Decorative number + title + description + optional challenge + tags + meaningful link.

**Goal:** make selected work easy to scan, then direct interested visitors to deeper thinking. End with one text link to `/blog` (`Read writing and notes →`).

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
        {projects.projects.map((p, index) => (
          <li class="project-row">
            <span class="project-row__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div class="project-row__header">
              <h2 class="project-row__title">{p.title}</h2>
              {p.link && (
                <a class="project-row__link" href={p.link} target={p.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{p.link_label} ↗</a>
              )}
            </div>
            <p class="project-row__desc">{p.description}</p>
            {p.challenge && <p class="project-row__challenge"><span>The challenge:</span> {p.challenge}</p>}
            <ul class="project-row__tags">{p.tags.map((t) => <Tag tag={t} />)}</ul>
          </li>
        ))}
      </ul>
      <p class="page-continuation"><a href="/blog">Read writing and notes →</a></p>
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

- No images, no cards. Just a numbered list with thin dividers.
- `link` is one field — if it starts with `http`, opens external. If empty, no link. `link_label` identifies the destination and is shown with `↗` for external targets.
- `challenge` is optional and appears only when it adds useful context beyond the description.
- Tag colors are CSS classes (fixed palette in `components.css`), not JSON-driven inline styles. To add a new tag color, add a CSS class + one line in the map.
- The project list is the launch format. A project may link to a deeper external destination or a case-study post. Add internal `/projects/{slug}` routes only when two or more projects need a consistent case-study presentation; follow `13` §4.

## CSS

- `.project-list` — list, thin `border-top` dividers between rows.
- `.project-row` — grid with a fixed decorative number column and content column; the number uses a muted fixed color sequence and does not carry meaning.
- `.project-row__header` — flex, space-between (title left, destination-specific link right).
- `.project-row__title` — `--text-xl`, bold.
- `.project-row__desc` — `--text-sm`, `--color-text-subtle`.
- `.tag--yellow` / `.tag--blue` / etc — fixed background + text color classes.
- `.project-row__challenge` — small text using a mono `The challenge:` label and normal text value.
- `.page-continuation` follows the project list and is the only page-level forward path.

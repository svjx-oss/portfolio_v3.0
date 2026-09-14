import Markdown from "@/components/Markdown.tsx";
import type { ThingsPost } from "@/lib/shared/types.ts";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

const typeLabels = {
  project: "Project",
  writing: "Writing",
  photography: "Photography",
  notes: "Notes",
  external: "External",
};

export default function ThingsPostPage(
  { title, date, html, headings, accent, type, tags }: ThingsPost,
) {
  return (
    <article class={`things-post accent--${accent}`}>
      <p class="things-post__back">
        <a href="/things">← Back to Things</a>
      </p>
      <header class="things-post__header">
        <h1>{title}</h1>
        <p>
          <span class="things-post__type">{typeLabels[type]}</span>
          {tags.map((tag) => (
            <span class="things-post__tag" key={tag}>{tag}</span>
          ))}
        </p>
        <p class="things-post__date">{formatDate(date)}</p>
      </header>
      <details class="things-post__toc">
        <summary>On this page</summary>
        <ol>
          {headings.map((heading) => (
            <li class={`things-post__toc-item--h${heading.level}`}>
              <a href={`#${heading.id}`} data-event="toc_click">
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </details>
      <Markdown html={html} className="prose things-post__prose" />
    </article>
  );
}

import Markdown from "@/components/Markdown.tsx";
import type { ThingsPost } from "@/lib/types.ts";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function ThingsPostPage(
  { title, date, html, headings, type }: ThingsPost,
) {
  const accentByType = {
    project: "violet",
    writing: "blue",
    photography: "gold",
    notes: "green",
    external: "teal",
  };

  return (
    <article class={`things-post accent--${accentByType[type]}`}>
      <p class="things-post__back">
        <a href="/things">← Back to Things</a>
      </p>
      <header class="things-post__header">
        <h1>{title}</h1>
        <p>{formatDate(date)}</p>
      </header>
      <details class="things-post__toc">
        <summary>On this page</summary>
        <ol>
          {headings.map((heading) => (
            <li class={`things-post__toc-item--h${heading.level}`}>
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </details>
      <Markdown html={html} className="prose things-post__prose" />
    </article>
  );
}

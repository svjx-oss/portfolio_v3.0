import Markdown from "@/components/Markdown.tsx";
import {
  artifactsTypeLabels,
  formatArtifactsDate,
} from "@/lib/shared/artifacts.ts";
import type { ArtifactsPost } from "@/lib/shared/types.ts";

export default function ArtifactsPostPage(
  { title, date, html, headings, accent, type, tags }: ArtifactsPost,
) {
  return (
    <article class={`artifacts-post accent--${accent}`}>
      <p class="artifacts-post__back">
        <a href="/artifacts">← Back to Artifacts</a>
      </p>
      <header class="artifacts-post__header">
        <h1>{title}</h1>
        <p>
          <span class="artifacts-post__type">{artifactsTypeLabels[type]}</span>
          {tags.map((tag) => (
            <span class="artifacts-post__tag" key={tag}>{tag}</span>
          ))}
        </p>
        <p class="artifacts-post__date">{formatArtifactsDate(date)}</p>
      </header>
      {headings.length > 0 && (
        <details class="artifacts-post__toc">
          <summary>On this page</summary>
          <ol>
            {headings.map((heading) => (
              <li
                key={heading.id}
                class={`artifacts-post__toc-item--h${heading.level}`}
              >
                <a href={`#${heading.id}`} data-event="toc_click">
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </details>
      )}
      <Markdown html={html} className="prose artifacts-post__prose" />
    </article>
  );
}

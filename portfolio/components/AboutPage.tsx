// deno-lint-ignore-file react-no-danger

import type { AboutContent } from "@/lib/types.ts";

export default function AboutPage(
  { portrait, portrait_alt, html }: AboutContent,
) {
  return (
    <article class="about">
      <img
        class="about__image"
        src={portrait}
        alt={portrait_alt}
        width="800"
        height="800"
      />
      <div
        class="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <p class="page-continuation">
        <a class="accent-link accent--magenta" href="/experience">
          View experience →
        </a>
      </p>
    </article>
  );
}

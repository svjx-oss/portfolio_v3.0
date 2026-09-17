import Markdown from "@/components/Markdown.tsx";
import type { Experience } from "@/lib/shared/types.ts";

export default function ExperiencePage({ entries }: Experience) {
  return (
    <article class="experience">
      <h1 class="experience__title">Experience</h1>
      <ol class="experience__list">
        {entries.map((entry) => (
          <li
            class="experience-entry"
            style={{ "--experience-accent": entry.color }}
          >
            <p class="experience-entry__year">{entry.year}</p>
            <section class="experience-entry__content">
              <h2 class="experience-entry__company">
                {entry.company}
                {entry.current && (
                  <span class="experience-entry__current">Present</span>
                )}
              </h2>
              <p class="experience-entry__role">
                {entry.role} · {entry.location}
              </p>
              <p class="experience-entry__dates">{entry.dates}</p>
              {entry.summary && (
                <p class="experience-entry__summary">{entry.summary}</p>
              )}
              <Markdown html={entry.html} />
            </section>
          </li>
        ))}
      </ol>
    </article>
  );
}

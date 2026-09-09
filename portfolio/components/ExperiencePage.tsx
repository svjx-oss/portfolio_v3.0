import Markdown from "@/components/Markdown.tsx";
import type { Experience } from "@/lib/types.ts";

export default function ExperiencePage({ entries }: Experience) {
  return (
    <article class="timeline">
      <h1 class="timeline__title">Experience</h1>
      <ol class="timeline__rail">
        {entries.map((entry) => (
          <li
            class="timeline-entry"
            style={{ "--node-color": entry.color }}
          >
            <p class="timeline-entry__year">{entry.year}</p>
            <section class="timeline-entry__content">
              <h2 class="timeline-entry__company">
                {entry.company}
                {entry.current && (
                  <span class="timeline-entry__current">Present</span>
                )}
              </h2>
              <p class="timeline-entry__role">
                {entry.role} · {entry.location}
              </p>
              <p class="timeline-entry__dates">{entry.dates}</p>
              <p class="timeline-entry__summary">{entry.summary}</p>
              <Markdown html={entry.html} />
            </section>
          </li>
        ))}
      </ol>
    </article>
  );
}

import Markdown from "@/components/Markdown.tsx";
import type { Timeline } from "@/lib/types.ts";

export default function TimelinePage({ entries }: Timeline) {
  return (
    <article class="timeline">
      <h1 class="timeline__title">Experience</h1>
      <ol class="timeline__rail">
        {entries.map((entry) => (
          <li class="timeline-entry">
            <p class="timeline-entry__year">{entry.year}</p>
            <section class="timeline-entry__content">
              <h2 class="timeline-entry__company">{entry.company}</h2>
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

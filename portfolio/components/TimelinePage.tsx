import Markdown from "@/components/Markdown.tsx";
import type { Timeline } from "@/lib/types.ts";

export default function TimelinePage({ entries }: Timeline) {
  return (
    <article>
      <h1>Experience</h1>
      {entries.map((entry) => (
        <section>
          <h2>{entry.company}</h2>
          <p>{entry.role}</p>
          <p>{entry.dates}</p>
          <p>{entry.summary}</p>
          <Markdown html={entry.html} />
        </section>
      ))}
    </article>
  );
}

import type { Things } from "@/lib/types.ts";

const typeLabels = {
  built: "Making",
  written: "Writing",
  photographed: "Photography",
  thought: "Note",
  external: "Elsewhere",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function ThingsPage({ entries }: Things) {
  return (
    <article class="things">
      <h1 class="things__title">Things</h1>
      <p class="things__tagline">
        Things I've built, written, photographed, and thought about.
      </p>
      {entries.length === 0
        ? (
          <p class="things__empty" role="status">
            Things are on the way.
          </p>
        )
        : (
          <ol class="things__list">
            {entries.map((entry) => (
              <li class="things-entry">
                <a
                  class="things-entry__link"
                  href={entry.external_url ?? `/things/${entry.slug}`}
                  target={entry.external_url ? "_blank" : undefined}
                  rel={entry.external_url ? "noopener noreferrer" : undefined}
                >
                  <span class="things-entry__title-row">
                    <strong class="things-entry__title">{entry.title}</strong>
                    <span class="things-entry__cue" aria-hidden="true">
                      {entry.external_url ? "↗" : "→"}
                    </span>
                  </span>
                  <span class="things-entry__metadata">
                    {[typeLabels[entry.type], ...entry.tags].join(" · ")}
                  </span>
                  <span class="things-entry__date">
                    {formatDate(entry.date)}
                  </span>
                  <span class="things-entry__excerpt">{entry.excerpt}</span>
                </a>
              </li>
            ))}
          </ol>
        )}
    </article>
  );
}

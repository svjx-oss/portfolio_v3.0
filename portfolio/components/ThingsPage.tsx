import { thingsAccentByType } from "@/lib/content/loadContent.ts";
import type { Things, ThingsFilter } from "@/lib/shared/types.ts";

const typeLabels = {
  project: "Project",
  writing: "Writing",
  photography: "Photography",
  notes: "Notes",
  external: "External",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

const filters: Array<{ label: string; value: ThingsFilter }> = [
  { label: "All", value: "all" },
  { label: "Writing", value: "writing" },
  { label: "Projects", value: "projects" },
  { label: "Photography", value: "photography" },
  { label: "Notes", value: "notes" },
];

export default function ThingsPage({ entries, filter }: {
  entries: Things["entries"];
  filter: ThingsFilter;
}) {
  return (
    <article class="things">
      <h1 class="things__title">Things</h1>
      <p class="things__tagline">
        Things I've built, written, photographed, and thought about.
      </p>
      <nav class="things-filter" aria-label="Filter Things">
        {filters.map((item, index) => (
          <>
            {index > 0 && <span aria-hidden="true">/</span>}
            <a
              class={`things-filter__option things-filter__option--${item.value}`}
              href={`/things?type=${item.value}`}
              aria-current={item.value === filter ? "page" : undefined}
            >
              {item.label}
            </a>
          </>
        ))}
      </nav>
      {entries.length === 0
        ? (
          <p class="things__empty" role="status">
            Things are on the way.
          </p>
        )
        : (
          <ol class="things__list">
            {entries.map((entry) => (
              <li
                class={`things-entry accent--${thingsAccentByType[entry.type]}`}
              >
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
                    <span class="things-entry__type">
                      {typeLabels[entry.type]}
                    </span>
                    {entry.tags.map((tag) => (
                      <span class="things-entry__tag">{tag}</span>
                    ))}
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

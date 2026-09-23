import { Fragment } from "preact";
import {
  artifactsAccentByType,
  artifactsTypeLabels,
  formatArtifactsDate,
} from "@/lib/shared/artifacts.ts";
import type { Artifacts, ArtifactsFilter } from "@/lib/shared/types.ts";

const filters: Array<{ label: string; value: ArtifactsFilter }> = [
  { label: "All", value: "all" },
  { label: "Projects", value: "projects" },
  { label: "Writing", value: "writing" },
  { label: "Photography", value: "photography" },
  { label: "Notes", value: "notes" },
];

export default function ArtifactsPage({ entries, filter }: {
  entries: Artifacts["entries"];
  filter: ArtifactsFilter;
}) {
  return (
    <article class="artifacts">
      <h1 class="artifacts__title">Artifacts</h1>
      <p class="artifacts__tagline">
        Things I've built, written, photographed, and thought about.
      </p>
      <nav class="artifacts-filter" aria-label="Filter Artifacts">
        {filters.map((item, index) => (
          <Fragment key={item.value}>
            {index > 0 && <span aria-hidden="true">/</span>}
            <a
              class={`artifacts-filter__option artifacts-filter__option--${item.value}`}
              href={`/artifacts?type=${item.value}`}
              aria-current={item.value === filter ? "page" : undefined}
            >
              {item.label}
            </a>
          </Fragment>
        ))}
      </nav>
      {entries.length === 0
        ? (
          <p class="artifacts__empty" role="status">
            Artifacts are on the way.
          </p>
        )
        : (
          <ol class="artifacts__list">
            {entries.map((entry) => (
              <li
                key={entry.slug ?? entry.external_url}
                class={`artifacts-entry accent--${
                  artifactsAccentByType[entry.type]
                }`}
                data-analytics-context="artifacts-entry"
              >
                <a
                  class="artifacts-entry__link"
                  href={entry.external_url ?? `/artifacts/${entry.slug}`}
                  target={entry.external_url ? "_blank" : undefined}
                  rel={entry.external_url ? "noopener noreferrer" : undefined}
                  aria-label={entry.external_url
                    ? `${entry.title} (opens in a new tab)`
                    : undefined}
                >
                  <span class="artifacts-entry__title-row">
                    <strong class="artifacts-entry__title">
                      {entry.title}
                    </strong>
                    <span class="artifacts-entry__cue" aria-hidden="true">
                      {entry.external_url ? "↗" : "→"}
                    </span>
                  </span>
                  <span class="artifacts-entry__metadata">
                    <span class="artifacts-entry__type">
                      {artifactsTypeLabels[entry.type]}
                    </span>
                    {entry.tags.map((tag) => (
                      <span class="artifacts-entry__tag">{tag}</span>
                    ))}
                  </span>
                  <span class="artifacts-entry__date">
                    {formatArtifactsDate(entry.date)}
                  </span>
                  <span class="artifacts-entry__excerpt">{entry.excerpt}</span>
                </a>
              </li>
            ))}
          </ol>
        )}
    </article>
  );
}

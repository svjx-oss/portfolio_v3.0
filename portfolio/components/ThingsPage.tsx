import type { Things } from "@/lib/types.ts";

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
          <ol>
            {entries.map((entry) => (
              <li>
                {entry.external_url
                  ? (
                    <a
                      href={entry.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {entry.title}
                    </a>
                  )
                  : <span>{entry.title}</span>}
                <p>{entry.excerpt}</p>
              </li>
            ))}
          </ol>
        )}
    </article>
  );
}

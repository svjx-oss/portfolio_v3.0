import type { LandingContent as LandingData } from "@/lib/types.ts";
import Markdown from "@/components/Markdown.tsx";

function renderTagline(tagline: string, emphasis?: string) {
  if (!emphasis) return tagline;
  const [before, after] = tagline.split(emphasis);
  return (
    <>
      {before}
      <span class="tagline__emphasis">{emphasis}</span>
      {after}
    </>
  );
}

export default function Landing(
  { name, tagline, tagline_emphasis, metadata, html, contacts }: LandingData,
) {
  return (
    <article class="landing">
      <h1 class="hero-name">{name}</h1>
      <p class="tagline">
        {renderTagline(tagline, tagline_emphasis)}
      </p>
      <dl class="landing-metadata">
        {metadata.map((item) => (
          <div class="landing-metadata__row">
            <dt>{item.label.toLowerCase()}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <Markdown html={html} />
      <section class="landing-connect">
        <p class="landing-connect__prompt">connect:</p>
        <nav class="landing-connect__links" aria-label="Elsewhere">
          {contacts.map((contact) => (
            <a
              class={`landing-connect__link accent--${contact.accent}`}
              href={contact.href}
              target={contact.external ? "_blank" : undefined}
              rel={contact.external ? "noopener noreferrer" : undefined}
            >
              <span>{contact.key}:</span>
              <span>{contact.label}</span>
            </a>
          ))}
        </nav>
      </section>
    </article>
  );
}

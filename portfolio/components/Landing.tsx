import type { Landing as LandingData, Site } from "@/lib/types.ts";
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
  { frontmatter, html, site }: LandingData & { site: Site },
) {
  return (
    <article class="landing">
      <h1 class="hero-name">{frontmatter.name}</h1>
      <p class="tagline">
        {renderTagline(frontmatter.tagline, frontmatter.tagline_emphasis)}
      </p>
      <dl class="landing-metadata">
        {frontmatter.metadata.map((item) => (
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
          <a class="landing-connect__link--gold" href={site.social.email}>
            <span>mail:</span>
            <span>dev.sahil.jaganmohan@gmail.com</span>
          </a>
          <a
            class="landing-connect__link--blue"
            href={site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>net:</span>
            <span>linkedin.com/in/sahil-jaganmohan</span>
          </a>
          <a
            class="landing-connect__link--magenta"
            href={site.social.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>src:</span>
            <span>github.com/bullpointe</span>
          </a>
          <a class="landing-connect__link--violet" href={site.resume}>
            <span>doc:</span>
            <span>resume.pdf</span>
          </a>
        </nav>
      </section>
    </article>
  );
}

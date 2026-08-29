import type { Site } from "@/lib/types.ts";

export default function Footer({ site }: { site: Site }) {
  const year = new Date().getFullYear();

  return (
    <footer class="site-footer">
      <p class="footer-links">
        <a href={site.social.email}>email</a>
        <span aria-hidden="true">·</span>
        <a
          href={site.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          linkedin <span aria-hidden="true">↗</span>
        </a>
        <span aria-hidden="true">·</span>
        <a href={site.social.github} target="_blank" rel="noopener noreferrer">
          github <span aria-hidden="true">↗</span>
        </a>
        <span aria-hidden="true">·</span>
        <a href={site.resume}>resume</a>
      </p>
      <p class="footer-contact">
        Interested in working together?{" "}
        <a href={site.social.email}>Email me.</a>
      </p>
      <p class="footer-copyright">© Sahil Jaganmohan {year}</p>
    </footer>
  );
}

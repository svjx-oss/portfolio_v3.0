import type { Site } from "@/lib/types.ts";
import ThemeToggle from "@/islands/ThemeToggle.tsx";

export default function Footer({ site }: { site: Site }) {
  const year = new Date().getFullYear();
  const pageAccents = [
    "accent--gold",
    "accent--blue",
    "accent--magenta",
    "accent--violet",
    "accent--teal",
    "accent--gold",
    "accent--green",
  ];
  return (
    <footer class="site-footer">
      <div class="footer-controls">
        <nav class="footer-pages" aria-label="Pages">
          {site.nav.map((item, index) => (
            <>
              {index > 0 && (
                <span class="footer-pages__separator" aria-hidden="true">
                  /
                </span>
              )}
              <a class={pageAccents[index]} href={item.href}>{item.label}</a>
            </>
          ))}
        </nav>
      </div>
      <div class="footer-meta">
        <p class="footer-copyright">© {year} Sahil Jaganmohan</p>
        <span class="footer-meta__separator" aria-hidden="true">·</span>
        <ThemeToggle />
      </div>
    </footer>
  );
}

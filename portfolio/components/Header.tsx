import type { Site } from "@/lib/types.ts";
import MobileNav from "@/islands/MobileNav.tsx";
import ThemeToggle from "@/islands/ThemeToggle.tsx";

export default function Header(
  { site, pathname }: { site: Site; pathname: string },
) {
  return (
    <header class="site-header">
      <a class="site-logo" href="/" aria-label={`${site.title} home`}>
        <span aria-hidden="true">SJ</span>
        <span class="visually-hidden">
          TODO(asset): replace with Bitmoji.png
        </span>
      </a>
      <div class="header-controls">
        <ThemeToggle />
        <MobileNav nav={site.nav} pathname={pathname} />
      </div>
    </header>
  );
}

import type { Site } from "@/lib/types.ts";

export default function Header(
  { site, pathname }: { site: Site; pathname: string },
) {
  return (
    <header
      class={`site-header${pathname === "/" ? " site-header--home" : ""}`}
    >
      <div class="header-start" />
      {pathname !== "/" && (
        <a class="site-logo" href="/" aria-label={`${site.title} home`}>
          <span aria-hidden="true">SJ</span>
        </a>
      )}
      <div class="header-end" />
    </header>
  );
}

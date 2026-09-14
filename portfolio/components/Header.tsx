import Logo from "@/components/Logo.tsx";
import type { Site } from "@/lib/shared/types.ts";

export default function Header(
  { site, pathname }: { site: Site; pathname: string },
) {
  const accent = site.nav.find((item) => item.href === pathname)?.accent ??
    "sienna";

  return (
    <header
      class={`site-header${pathname === "/" ? " site-header--home" : ""}`}
    >
      {pathname !== "/" && (
        <a
          class={`site-logo site-logo--${accent}`}
          href="/"
          aria-label={`${site.title} home`}
        >
          <Logo />
        </a>
      )}
      <div class="header-end" />
    </header>
  );
}

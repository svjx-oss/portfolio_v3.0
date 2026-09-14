import type { ComponentChildren } from "preact";
import type { Site } from "@/lib/shared/types.ts";
import Analytics from "@/islands/Analytics.tsx";
import Footer from "./Footer.tsx";
import Header from "./Header.tsx";

export default function Layout(
  { children, hostname, site, pathname }: {
    children: ComponentChildren;
    hostname: string;
    site: Site;
    pathname: string;
  },
) {
  const isThingsPost = /^\/things\/[^/]+$/.test(pathname);

  return (
    <div class={`site-shell${pathname === "/" ? " site-shell--home" : ""}`}>
      <Header site={site} pathname={pathname} />
      <main id="main-content" class="site-main">
        {pathname !== "/" && !isThingsPost && (
          <a
            class={`page-back page-back--${
              site.nav.find((item) => item.href === pathname)?.accent ??
                "sienna"
            }`}
            href="/"
          >
            ← Back to Home
          </a>
        )}
        {children}
      </main>
      <Footer site={site} />
      {site.ga4_id && hostname !== "localhost" && <Analytics />}
    </div>
  );
}

import type { ComponentChildren } from "preact";
import type { Site } from "@/lib/types.ts";
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
  return (
    <div class={`site-shell${pathname === "/" ? " site-shell--home" : ""}`}>
      <Header site={site} pathname={pathname} />
      <main id="main-content" class="site-main">{children}</main>
      <Footer site={site} />
      {site.ga4_id && hostname !== "localhost" && <Analytics />}
    </div>
  );
}

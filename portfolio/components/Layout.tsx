import type { ComponentChildren } from "preact";
import type { Site } from "@/lib/types.ts";
import Footer from "./Footer.tsx";
import Header from "./Header.tsx";

export default function Layout(
  { children, site, pathname }: {
    children: ComponentChildren;
    site: Site;
    pathname: string;
  },
) {
  return (
    <div class="site-shell">
      <Header site={site} pathname={pathname} />
      <main id="main-content" class="site-main">{children}</main>
      <Footer site={site} />
    </div>
  );
}

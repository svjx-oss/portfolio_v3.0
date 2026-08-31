import type { Site } from "@/lib/types.ts";

const themeScript =
  `(function(){try{var p=localStorage.getItem("themePreference");document.documentElement.dataset.theme=p==="light"||p==="dark"?p:"dark"}catch(e){document.documentElement.dataset.theme="dark"}})();`;

export default function Seo(
  { site, pathname }: { site: Site; pathname: string },
) {
  const title = pathname === "/" ? site.title : `${site.title} | Portfolio`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={site.description} />
      <meta
        name="theme-color"
        content="#141619"
        media="(prefers-color-scheme: dark)"
      />
      <meta
        name="theme-color"
        content="#F7F5F0"
        media="(prefers-color-scheme: light)"
      />
      <link rel="icon" href="/favicon.ico" />
      {/* Required before paint to resolve the stored or system color theme. */}
      <script>{themeScript}</script>
    </>
  );
}

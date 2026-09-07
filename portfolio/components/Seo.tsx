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
        content="#0C111A"
        media="(prefers-color-scheme: dark)"
      />
      <meta
        name="theme-color"
        content="#F2F6FD"
        media="(prefers-color-scheme: light)"
      />
      <link rel="icon" href="/favicon.ico" />
      {/* Set the stored preference or dark default before the first paint. */}
      <script>{themeScript}</script>
    </>
  );
}

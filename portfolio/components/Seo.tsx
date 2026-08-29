import type { Site } from "@/lib/types.ts";

const themeScript =
  `(function(){try{var p=localStorage.getItem("themePreference")||"system";var d=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var t=p==="system"?d:p;document.documentElement.dataset.theme=t;document.documentElement.dataset.themePreference=p}catch(e){var t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t;document.documentElement.dataset.themePreference="system"}})();`;

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
        content="#0E1726"
        media="(prefers-color-scheme: dark)"
      />
      <meta
        name="theme-color"
        content="#E8F2FF"
        media="(prefers-color-scheme: light)"
      />
      <link rel="icon" href="/favicon.ico" />
      {/* Required before paint to resolve the stored or system color theme. */}
      <script>{themeScript}</script>
    </>
  );
}

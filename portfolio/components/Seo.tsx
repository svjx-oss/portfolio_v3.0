import type { Site } from "@/lib/shared/types.ts";
import { themeColors, themeInitScript } from "@/lib/shared/theme.ts";

export default function Seo(
  { site, pathname, hostname }: {
    site: Site;
    pathname: string;
    hostname: string;
  },
) {
  const title = pathname === "/" ? site.title : `${site.title} | Portfolio`;
  const url = `${site.url}${pathname}`;
  const image = `${site.url}/sample.jpeg`;
  const analyticsEnabled = Boolean(site.ga4_id) && hostname !== "localhost";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={site.description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={site.description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.title} />
      <meta property="og:image" content={image} />
      {analyticsEnabled && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${site.ga4_id}`}
          />
          <script>
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${site.ga4_id}");`}
          </script>
        </>
      )}
      <meta
        name="theme-color"
        content={themeColors.dark}
        media="(prefers-color-scheme: dark)"
      />
      <meta
        name="theme-color"
        content={themeColors.light}
        media="(prefers-color-scheme: light)"
      />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      {/* Set the stored preference or dark default before the first paint. */}
      {/* deno-lint-ignore-file react-no-danger */}
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    </>
  );
}

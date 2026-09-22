import type { Site } from "@/lib/shared/types.ts";
import { themeColors, themeInitScript } from "@/lib/shared/theme.ts";

const pageTitles = {
  "/": "Home | Sahil Jaganmohan",
  "/about": "About | Sahil Jaganmohan",
  "/experience": "Experience | Sahil Jaganmohan",
  "/things": "Things | Sahil Jaganmohan",
} as const;

export default function Seo(
  { site, pathname, hostname, post }: {
    site: Site;
    pathname: string;
    hostname: string;
    post?: { slug: string; title: string; excerpt: string };
  },
) {
  const isThingsPost = /^\/things\/[^/]+$/.test(pathname);
  const title = post
    ? post.title
    : pageTitles[pathname as keyof typeof pageTitles] ??
      `${site.title} | Portfolio`;
  const description = post?.excerpt ?? site.description;
  const url = `${site.url}${pathname}`;
  const image = isThingsPost
    ? `${site.url}/og/things/${post?.slug}.png`
    : `${site.url}/og/default.png`;
  const analyticsEnabled = Boolean(site.ga4_id) && hostname !== "localhost";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.title} />
      <meta property="og:image" content={image} />
      <meta
        property="og:image:alt"
        content={post ? `${post.title} preview` : `${site.title} preview`}
      />
      <meta property="og:image:width" content="2400" />
      <meta property="og:image:height" content="1260" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta
        name="twitter:image:alt"
        content={post ? `${post.title} preview` : `${site.title} preview`}
      />
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

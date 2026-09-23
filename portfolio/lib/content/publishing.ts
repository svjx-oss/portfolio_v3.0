import type { ArtifactsEntry, Site } from "@/lib/shared/types.ts";
import { escapeXml } from "@/lib/shared/xml.ts";

export function buildRssFeed(site: Site, posts: ArtifactsEntry[]): string {
  const items = posts.map((post) => {
    const url = `${site.url}/artifacts/${post.slug}`;
    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${escapeXml(url)}</link>
        <guid>${escapeXml(url)}</guid>
        <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
        <description>${escapeXml(post.excerpt)}</description>
      </item>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${escapeXml(site.url)}</link>
    <description>${escapeXml(site.description)}</description>${items}
  </channel>
</rss>`;
}

export function buildSitemap(site: Site, posts: ArtifactsEntry[]): string {
  const urls = [
    "/",
    "/about",
    "/experience",
    "/artifacts?type=all",
    ...posts.map((post) => `/artifacts/${post.slug}`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
    urls.map((path) => `
  <url><loc>${escapeXml(`${site.url}${path}`)}</loc></url>`).join("")
  }
</urlset>`;
}

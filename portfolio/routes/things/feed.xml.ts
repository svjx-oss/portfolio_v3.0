import { loadPublishedThingsPosts, loadSite } from "@/lib/loadContent.ts";
import { escapeXml } from "@/lib/xml.ts";

export const handler = {
  async GET() {
    const [site, posts] = await Promise.all([
      loadSite(),
      loadPublishedThingsPosts(),
    ]);
    const items = posts.map((post) => {
      const url = `${site.url}/things/${post.slug}`;
      return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${escapeXml(url)}</link>
        <guid>${escapeXml(url)}</guid>
        <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
        <description>${escapeXml(post.excerpt)}</description>
      </item>`;
    }).join("");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${escapeXml(site.url)}</link>
    <description>${escapeXml(site.description)}</description>${items}
  </channel>
</rss>`;
    return new Response(xml, {
      headers: { "content-type": "application/rss+xml; charset=utf-8" },
    });
  },
};

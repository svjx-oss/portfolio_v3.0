import {
  loadPublishedThingsPosts,
  loadSite,
} from "@/lib/content/loadContent.ts";
import { escapeXml } from "@/lib/shared/xml.ts";

export const handler = {
  async GET() {
    const [site, posts] = await Promise.all([
      loadSite(),
      loadPublishedThingsPosts(),
    ]);
    const urls = [
      "/",
      "/about",
      "/experience",
      "/things?type=all",
      ...posts.map((post) => `/things/${post.slug}`),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
      urls.map((path) => `
  <url><loc>${escapeXml(`${site.url}${path}`)}</loc></url>`).join("")
    }
</urlset>`;
    return new Response(xml, {
      headers: { "content-type": "application/xml; charset=utf-8" },
    });
  },
};

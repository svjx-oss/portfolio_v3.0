import { buildSitemap } from "@/lib/content/publishing.ts";
import {
  loadPublishedArtifactsPosts,
  loadSite,
} from "@/lib/content/loadContent.ts";

export const handler = {
  async GET() {
    const [site, posts] = await Promise.all([
      loadSite(),
      loadPublishedArtifactsPosts(),
    ]);
    return new Response(buildSitemap(site, posts), {
      headers: { "content-type": "application/xml; charset=utf-8" },
    });
  },
};

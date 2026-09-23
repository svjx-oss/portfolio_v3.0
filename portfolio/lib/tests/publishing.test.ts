import { buildRssFeed, buildSitemap } from "@/lib/content/publishing.ts";
import type { ArtifactsEntry, Site } from "@/lib/shared/types.ts";

const site: Site = {
  title: "Sahil <J>",
  description: "Portfolio & notes",
  url: "https://example.com",
  ga4_id: "G-TEST",
  nav: [],
};

const post: ArtifactsEntry = {
  title: "Boring <Software>",
  date: "2026-07-15",
  type: "writing",
  excerpt: "Why predictable systems outlast clever abstractions.",
  tags: ["Software"],
  status: "published",
  slug: "why-i-like-boring-software",
  md: "posts/why-i-like-boring-software/why-i-like-boring-software.md",
};

Deno.test("buildRssFeed escapes XML and links post URLs", () => {
  const xml = buildRssFeed(site, [post]);

  if (!xml.includes("<title>Sahil &lt;J&gt;</title>")) {
    throw new Error("Expected the channel title to be escaped.");
  }
  if (!xml.includes("<title>Boring &lt;Software&gt;</title>")) {
    throw new Error("Expected the item title to be escaped.");
  }
  if (
    !xml.includes(
      "<link>https://example.com/artifacts/why-i-like-boring-software</link>",
    )
  ) {
    throw new Error("Expected the post URL in the feed.");
  }
  if (!xml.includes("Wed, 15 Jul 2026 00:00:00 GMT")) {
    throw new Error("Expected a UTC pubDate.");
  }
});

Deno.test("buildSitemap lists base routes and post URLs", () => {
  const xml = buildSitemap(site, [post]);

  for (
    const path of [
      "https://example.com/",
      "https://example.com/about",
      "https://example.com/experience",
      "https://example.com/artifacts?type=all",
      "https://example.com/artifacts/why-i-like-boring-software",
    ]
  ) {
    if (!xml.includes(`<loc>${path}</loc>`)) {
      throw new Error(`Expected ${path} in the sitemap.`);
    }
  }
});

Deno.test("buildRssFeed and buildSitemap handle empty posts", () => {
  if (buildRssFeed(site, []).includes("<item>")) {
    throw new Error("Expected no items for an empty feed.");
  }
  if (!buildSitemap(site, []).includes("<loc>https://example.com/</loc>")) {
    throw new Error("Expected base routes in an empty sitemap.");
  }
});

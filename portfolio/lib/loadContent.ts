import { renderMarkdown } from "@/lib/markdown.ts";
import type { AboutContent, LandingContent, Site } from "@/lib/types.ts";

export async function loadSite(): Promise<Site> {
  return JSON.parse(await Deno.readTextFile("content/site.json"));
}

export async function loadLanding(): Promise<LandingContent> {
  const [landing, body] = await Promise.all([
    Deno.readTextFile("content/landing/landing.json"),
    Deno.readTextFile("content/landing/landing.md"),
  ]);
  return { ...JSON.parse(landing), html: renderMarkdown(body) };
}

export async function loadAbout(): Promise<AboutContent> {
  const [about, body] = await Promise.all([
    Deno.readTextFile("content/about/about.json"),
    Deno.readTextFile("content/about/about.md"),
  ]);
  return { ...JSON.parse(about), html: renderMarkdown(body) };
}

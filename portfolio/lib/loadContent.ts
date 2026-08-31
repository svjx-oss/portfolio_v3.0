import { renderMarkdown } from "@/lib/markdown.ts";
import type { Landing, LandingFrontmatter, Site } from "@/lib/types.ts";

function parseFrontmatter(
  raw: string,
): { frontmatter: LandingFrontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("landing.md must begin with frontmatter.");

  let frontmatter: LandingFrontmatter;
  try {
    frontmatter = JSON.parse(match[1]);
  } catch {
    throw new Error("landing.md: frontmatter must be valid JSON.");
  }

  return { frontmatter, body: match[2] };
}

export async function loadSite(): Promise<Site> {
  return JSON.parse(await Deno.readTextFile("content/site.json"));
}

export async function loadLanding(): Promise<Landing> {
  const raw = await Deno.readTextFile("content/landing.md");
  const { frontmatter, body } = parseFrontmatter(raw);
  return { frontmatter, html: renderMarkdown(body) };
}

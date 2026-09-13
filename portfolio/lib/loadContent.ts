import { renderMarkdown, renderPostMarkdown } from "@/lib/markdown.ts";
import type {
  AboutContent,
  Experience,
  LandingContent,
  Site,
  Things,
  ThingsPost,
} from "@/lib/types.ts";

export async function loadSite(): Promise<Site> {
  return JSON.parse(await Deno.readTextFile("content/site.json"));
}

async function loadThings(): Promise<Things> {
  return JSON.parse(
    await Deno.readTextFile("content/things/things.json"),
  ) as Things;
}

export async function loadPublishedThingsPosts() {
  const things = await loadThings();
  return things.entries.filter((entry) =>
    entry.status === "published" && entry.md && entry.slug
  );
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
  return {
    ...JSON.parse(about),
    html: renderMarkdown(body),
  };
}

export async function loadExperience(): Promise<Experience> {
  const raw = await Deno.readTextFile("content/experience/experience.json");
  const experience = JSON.parse(raw) as Pick<Experience, "entries">;
  const entries = await Promise.all(experience.entries.map(async (entry) => ({
    ...entry,
    html: renderMarkdown(
      await Deno.readTextFile(`content/experience/${entry.content}`),
    ),
  })));
  return { entries };
}

export async function loadThingsIndex(): Promise<Things> {
  const things = await loadThings();
  return {
    entries: things.entries.filter((entry) => entry.status === "published"),
  };
}

export async function loadThingsPost(slug: string): Promise<ThingsPost | null> {
  const things = await loadThings();
  const entry = things.entries.find((item) =>
    item.slug === slug && item.status === "published" && item.md
  );

  if (!entry?.md) return null;
  return {
    ...entry,
    ...renderPostMarkdown(
      await Deno.readTextFile(`content/things/${entry.md}`),
    ),
  };
}

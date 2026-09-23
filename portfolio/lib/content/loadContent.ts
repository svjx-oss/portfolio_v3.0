import { renderMarkdown, renderPostMarkdown } from "@/lib/shared/markdown.ts";
import { artifactsAccentByType } from "@/lib/shared/artifacts.ts";
import type {
  AboutContent,
  Artifacts,
  ArtifactsEntry,
  ArtifactsFilter,
  ArtifactsImage,
  ArtifactsPost,
  Experience,
  LandingContent,
  Site,
} from "@/lib/shared/types.ts";

export function sortArtifactsEntriesByDate<T extends { date: string }>(
  entries: T[],
) {
  return entries.toSorted((a, b) => b.date.localeCompare(a.date));
}

export function isVisibleArtifactsEntry(
  entry: ArtifactsEntry,
  includeDrafts: boolean,
) {
  return includeDrafts || entry.status === "published";
}

export async function loadSite(): Promise<Site> {
  return JSON.parse(await Deno.readTextFile("content/site.json"));
}

async function loadArtifacts(): Promise<Artifacts> {
  return JSON.parse(
    await Deno.readTextFile("content/artifacts/artifacts.json"),
  ) as Artifacts;
}

export async function loadPublishedArtifactsPosts() {
  const artifacts = await loadArtifacts();
  return artifacts.entries.filter((entry) =>
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

export async function loadArtifactsIndex(
  filter: ArtifactsFilter = "all",
): Promise<Artifacts> {
  const artifacts = await loadArtifacts();
  return {
    entries: sortArtifactsEntriesByDate(
      artifacts.entries.filter((entry) =>
        isVisibleArtifactsEntry(entry, import.meta.env.DEV) &&
        (filter === "all" ||
          (filter === "projects" && entry.type === "project") ||
          entry.type === filter)
      ),
    ),
  };
}

export async function loadArtifactsPost(
  slug: string,
): Promise<ArtifactsPost | null> {
  const artifacts = await loadArtifacts();
  const entry = artifacts.entries.find((item) =>
    item.slug === slug && isVisibleArtifactsEntry(item, import.meta.env.DEV) &&
    item.md
  );

  if (!entry?.md || !entry.slug) return null;
  const postDir = `content/artifacts/posts/${entry.slug}`;
  const images = await Deno.readTextFile(`${postDir}/images.json`)
    .then((raw) => JSON.parse(raw) as Record<string, ArtifactsImage>)
    .catch((error) => {
      if (error instanceof Deno.errors.NotFound) return {};
      throw error;
    });
  return {
    ...entry,
    accent: artifactsAccentByType[entry.type],
    ...renderPostMarkdown(
      await Deno.readTextFile(`${postDir}/${entry.slug}.md`),
      entry.slug,
      images,
    ),
  };
}

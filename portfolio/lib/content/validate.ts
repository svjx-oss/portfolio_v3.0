import {
  loadAbout,
  loadExperience,
  loadLanding,
  loadSite,
} from "@/lib/content/loadContent.ts";
import { accentSet } from "@/lib/shared/accents.ts";
import type {
  About,
  Artifacts,
  ArtifactsImage,
  Experience,
  Landing,
  Site,
} from "@/lib/shared/types.ts";

const artifactsTypes = new Set([
  "project",
  "writing",
  "photography",
  "notes",
  "external",
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isHref(value: string) {
  return value.startsWith("/") || value.startsWith("mailto:") ||
    /^https:\/\//.test(value);
}

export interface ArtifactsFiles {
  markdown: (md: string) => Promise<string>;
  images: (slug: string) => Promise<Record<string, ArtifactsImage>>;
  exists: (path: string) => Promise<boolean>;
}

export function validateSite(site: Site) {
  assert(site.title, "site.json: title is required.");
  assert(site.description, "site.json: description is required.");
  assert(
    /^https:\/\//.test(site.url),
    "site.json: url must be an HTTPS origin.",
  );
  assert(site.nav.length > 0, "site.json: nav must not be empty.");
  for (const item of site.nav) {
    assert(item.label, "site.json: nav label is required.");
    assert(
      isHref(item.href),
      "site.json: nav href must be root-relative or HTTPS.",
    );
    assert(
      accentSet.has(item.accent),
      "site.json: nav accent is not supported.",
    );
  }
}

export function validateLanding(landing: Landing) {
  assert(landing.name, "landing.json: name is required.");
  assert(landing.tagline, "landing.json: tagline is required.");
  assert(
    landing.metadata.length > 0,
    "landing.json: metadata must not be empty.",
  );
  assert(
    landing.contacts.length > 0,
    "landing.json: contacts must not be empty.",
  );
  const contactKeys = new Set<string>();
  for (const contact of landing.contacts) {
    assert(contact.key, "landing.json: contact key is required.");
    assert(
      !contactKeys.has(contact.key),
      "landing.json: contact keys must be unique.",
    );
    contactKeys.add(contact.key);
    assert(contact.label, "landing.json: contact label is required.");
    assert(
      isHref(contact.href),
      "landing.json: contact href must be root-relative, mailto, or HTTPS.",
    );
    assert(
      accentSet.has(contact.accent),
      "landing.json: contact accent is not supported.",
    );
  }
  if (landing.tagline_emphasis) {
    const occurrences = landing.tagline.split(landing.tagline_emphasis).length -
      1;
    assert(
      occurrences === 1,
      "landing.json: tagline_emphasis must occur exactly once in tagline.",
    );
  }
}

export function validateAbout(about: About) {
  assert(about.portrait, "about.json: portrait is required.");
  assert(about.portrait_alt, "about.json: portrait_alt is required.");
}

export function validateExperience(experience: Experience) {
  assert(
    experience.entries.length > 0,
    "experience.json: entries must not be empty.",
  );
  for (const entry of experience.entries) {
    assert(entry.year, "experience.json: entry year is required.");
    assert(entry.company, "experience.json: entry company is required.");
    assert(entry.role, "experience.json: entry role is required.");
    assert(entry.location, "experience.json: entry location is required.");
    assert(entry.dates, "experience.json: entry dates is required.");
    assert(
      /^#[0-9A-Fa-f]{6}$/.test(entry.color) ||
        /^linear-gradient\([^\n]+\)$/.test(entry.color),
      "experience.json: entry color must be a hex color or linear gradient.",
    );
    assert(
      entry.content.endsWith(".md"),
      "experience.json: entry content must be a Markdown file.",
    );
  }
}

export async function validateArtifacts(
  artifacts: Artifacts,
  files: ArtifactsFiles,
) {
  const slugs = new Set<string>();
  for (const entry of artifacts.entries) {
    assert(entry.title, "artifacts.json: entry title is required.");
    assert(
      /^\d{4}-\d{2}-\d{2}$/.test(entry.date),
      "artifacts.json: entry date must be ISO.",
    );
    assert(
      artifactsTypes.has(entry.type),
      "artifacts.json: entry type is invalid.",
    );
    assert(entry.excerpt, "artifacts.json: entry excerpt is required.");
    assert(
      entry.tags.length > 0,
      "artifacts.json: entry tags must not be empty.",
    );
    assert(
      entry.status === "published" || entry.status === "draft",
      "artifacts.json: entry status is invalid.",
    );
    assert(
      Boolean(entry.md) !== Boolean(entry.external_url),
      "artifacts.json: each entry needs exactly one of md or external_url.",
    );
    if (entry.external_url) {
      assert(
        /^https:\/\//.test(entry.external_url),
        "artifacts.json: external_url must be HTTPS.",
      );
      continue;
    }
    assert(entry.slug, "artifacts.json: post slug is required.");
    assert(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug),
      "artifacts.json: post slug is invalid.",
    );
    assert(
      !slugs.has(entry.slug),
      "artifacts.json: post slugs must be unique.",
    );
    slugs.add(entry.slug);
    assert(
      typeof entry.md === "string" && entry.md.endsWith(".md"),
      "artifacts.json: post md must be a Markdown file.",
    );
    const postDir = `content/artifacts/posts/${entry.slug}`;
    const markdown = await files.markdown(entry.md);
    const images = await files.images(entry.slug);
    for (const [filename, image] of Object.entries(images)) {
      assert(
        /^images\/[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(filename),
        `images.json: ${filename} must be an image filename under images/.`,
      );
      assert(
        Number.isInteger(image.width) && image.width > 0,
        `images.json: ${filename} width must be a positive integer.`,
      );
      assert(
        Number.isInteger(image.height) && image.height > 0,
        `images.json: ${filename} height must be a positive integer.`,
      );
      if (image.caption !== undefined) {
        assert(
          typeof image.caption === "string" && image.caption.trim(),
          `images.json: ${filename} caption must be a non-empty string.`,
        );
      }
      assert(
        await files.exists(`${postDir}/${filename}`),
        `images.json: ${filename} must exist in ${postDir}.`,
      );
    }
    for (const match of markdown.matchAll(/!\[[^\]]*\]\(([^\s)]+)/g)) {
      const src = match[1];
      if (!src || src.startsWith("/") || /^https?:/.test(src)) continue;
      assert(
        images[src],
        `images.json: ${src} is used by ${entry.md} but has no dimensions.`,
      );
    }
    for (
      const match of markdown.matchAll(
        /(?<!!)(?:^|[^!])\[[^\]]+\]\(([^\s)]+\.pdf)\)/gm,
      )
    ) {
      const src = match[1];
      if (!src || src.startsWith("/") || /^https?:/.test(src)) continue;
      assert(
        /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.pdf$/.test(src),
        `PDF link: ${src} must be a local PDF filename.`,
      );
      assert(
        await files.exists(`${postDir}/files/${src}`),
        `PDF link: ${src} must exist in ${postDir}/files.`,
      );
    }
  }
}

async function loadArtifactsFromDisk(): Promise<Artifacts> {
  return JSON.parse(
    await Deno.readTextFile("content/artifacts/artifacts.json"),
  ) as Artifacts;
}

function diskArtifactsFiles(): ArtifactsFiles {
  return {
    markdown: (md) => Deno.readTextFile(`content/artifacts/${md}`),
    images: async (slug) => {
      try {
        return JSON.parse(
          await Deno.readTextFile(
            `content/artifacts/posts/${slug}/images.json`,
          ),
        ) as Record<string, ArtifactsImage>;
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) return {};
        throw error;
      }
    },
    exists: (path) => Deno.stat(path).then(() => true),
  };
}

export async function validateContent() {
  const [site, landing, about, experience, artifacts, artifactsFiles] =
    await Promise
      .all([
        loadSite(),
        loadLanding(),
        loadAbout(),
        loadExperience(),
        loadArtifactsFromDisk(),
        diskArtifactsFiles(),
      ]);
  validateSite(site);
  validateLanding(landing);
  validateAbout(about);
  validateExperience(experience);
  await validateArtifacts(artifacts, artifactsFiles);
}

if (import.meta.main) {
  await validateContent();
}

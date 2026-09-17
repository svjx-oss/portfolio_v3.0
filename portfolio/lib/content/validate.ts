import {
  loadAbout,
  loadExperience,
  loadLanding,
  loadSite,
} from "@/lib/content/loadContent.ts";
import type {
  AboutContent,
  Experience,
  LandingContent,
  Site,
  Things,
  ThingsImage,
} from "@/lib/shared/types.ts";

const accents = new Set([
  "sienna",
  "coral",
  "blue",
  "magenta",
  "green",
  "violet",
  "teal",
  "gold",
]);

const thingsTypes = new Set([
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

async function readImages(postDir: string) {
  try {
    return JSON.parse(
      await Deno.readTextFile(`${postDir}/images.json`),
    ) as Record<string, ThingsImage>;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return {};
    throw error;
  }
}

function validateSite(site: Site) {
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
    assert(accents.has(item.accent), "site.json: nav accent is not supported.");
  }
}

function validateLanding(landing: LandingContent) {
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
      accents.has(contact.accent),
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

function validateAbout(about: AboutContent) {
  assert(about.portrait, "about.json: portrait is required.");
  assert(about.portrait_alt, "about.json: portrait_alt is required.");
}

function validateExperience(experience: Experience) {
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
      /^#[0-9A-Fa-f]{6}$/.test(entry.color),
      "experience.json: entry color must be a hex color.",
    );
    assert(
      entry.content.endsWith(".md"),
      "experience.json: entry content must be a Markdown file.",
    );
  }
}

async function validateThings() {
  const things = JSON.parse(
    await Deno.readTextFile("content/things/things.json"),
  ) as Things;
  const slugs = new Set<string>();
  for (const entry of things.entries) {
    assert(entry.title, "things.json: entry title is required.");
    assert(
      /^\d{4}-\d{2}-\d{2}$/.test(entry.date),
      "things.json: entry date must be ISO.",
    );
    assert(thingsTypes.has(entry.type), "things.json: entry type is invalid.");
    assert(entry.excerpt, "things.json: entry excerpt is required.");
    assert(entry.tags.length > 0, "things.json: entry tags must not be empty.");
    assert(
      entry.status === "published" || entry.status === "draft",
      "things.json: entry status is invalid.",
    );
    assert(
      Boolean(entry.md) !== Boolean(entry.external_url),
      "things.json: each entry needs exactly one of md or external_url.",
    );
    if (entry.external_url) {
      assert(
        /^https:\/\//.test(entry.external_url),
        "things.json: external_url must be HTTPS.",
      );
      continue;
    }
    assert(entry.slug, "things.json: post slug is required.");
    assert(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug),
      "things.json: post slug is invalid.",
    );
    assert(!slugs.has(entry.slug), "things.json: post slugs must be unique.");
    slugs.add(entry.slug);
    assert(
      entry.md?.endsWith(".md"),
      "things.json: post md must be a Markdown file.",
    );
    const postDir = `content/things/posts/${entry.slug}`;
    const markdown = await Deno.readTextFile(`content/things/${entry.md}`);
    const images = await readImages(postDir);
    for (const [filename, image] of Object.entries(images)) {
      assert(
        !filename.includes("/") && !filename.startsWith("."),
        `images.json: ${filename} must be a local image filename.`,
      );
      assert(
        Number.isInteger(image.width) && image.width > 0,
        `images.json: ${filename} width must be a positive integer.`,
      );
      assert(
        Number.isInteger(image.height) && image.height > 0,
        `images.json: ${filename} height must be a positive integer.`,
      );
      await Deno.stat(`${postDir}/${filename}`);
    }
    for (const match of markdown.matchAll(/!\[[^\]]*\]\(([^\s)]+)/g)) {
      const src = match[1];
      if (!src || src.startsWith("/") || /^https?:/.test(src)) continue;
      assert(
        images[src],
        `images.json: ${src} is used by ${entry.md} but has no dimensions.`,
      );
    }
  }
}

export async function validateContent() {
  const [site, landing, about, experience] = await Promise.all([
    loadSite(),
    loadLanding(),
    loadAbout(),
    loadExperience(),
  ]);
  validateSite(site);
  validateLanding(landing);
  validateAbout(about);
  validateExperience(experience);
  await validateThings();
}

if (import.meta.main) {
  await validateContent();
}

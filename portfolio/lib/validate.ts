import {
  loadAbout,
  loadExperience,
  loadLanding,
  loadSite,
} from "@/lib/loadContent.ts";

const accents = new Set([
  "sienna",
  "blue",
  "magenta",
  "green",
  "violet",
  "teal",
  "gold",
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isHref(value: string) {
  return value.startsWith("/") || value.startsWith("mailto:") ||
    /^https:\/\//.test(value);
}

export async function validateContent() {
  const site = await loadSite();
  const landing = await loadLanding();
  const about = await loadAbout();
  const experience = await loadExperience();

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
  assert(about.portrait, "about.json: portrait is required.");
  assert(about.portrait_alt, "about.json: portrait_alt is required.");
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
    assert(entry.summary, "experience.json: entry summary is required.");
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

import { loadLanding, loadSite } from "@/lib/loadContent.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export async function validateContent() {
  const site = await loadSite();
  const landing = await loadLanding();

  assert(site.title, "site.json: title is required.");
  assert(site.description, "site.json: description is required.");
  assert(
    /^https:\/\//.test(site.url),
    "site.json: url must be an HTTPS origin.",
  );
  assert(site.nav.length > 0, "site.json: nav must not be empty.");
  assert(
    site.resume.startsWith("/"),
    "site.json: resume must be root-relative.",
  );
  assert(
    typeof site.show_writing_fixtures === "boolean",
    "site.json: show_writing_fixtures must be boolean.",
  );

  const { frontmatter } = landing;
  assert(frontmatter.name, "landing.md: name is required.");
  assert(frontmatter.tagline, "landing.md: tagline is required.");
  assert(
    frontmatter.metadata.length === 3,
    "landing.md: metadata must have exactly three rows.",
  );
  assert(
    frontmatter.metadata.map(({ label }) => label).join(",") ===
      "Focus,Based,Exploring",
    "landing.md: metadata labels must be Focus, Based, Exploring.",
  );
  if (frontmatter.tagline_emphasis) {
    const occurrences =
      frontmatter.tagline.split(frontmatter.tagline_emphasis).length - 1;
    assert(
      occurrences === 1,
      "landing.md: tagline_emphasis must occur exactly once in tagline.",
    );
  }
}

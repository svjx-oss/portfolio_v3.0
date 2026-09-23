import {
  type ArtifactsFiles,
  validateAbout,
  validateArtifacts,
  validateExperience,
  validateLanding,
  validateSite,
} from "@/lib/content/validate.ts";
import type { Accent, Artifacts, ArtifactsEntry } from "@/lib/shared/types.ts";

function expectError(fn: () => void, message: string) {
  try {
    fn();
  } catch (error) {
    if (!(error instanceof Error) || error.message !== message) {
      throw new Error(`Expected error "${message}".`);
    }
    return;
  }
  throw new Error(`Expected error "${message}".`);
}

const validEntry: ArtifactsEntry = {
  title: "Example Post",
  date: "2026-01-01",
  type: "project",
  excerpt: "An example post.",
  tags: ["Example"],
  status: "published",
  slug: "example-post",
  md: "posts/example-post/example-post.md",
};

const noFiles: ArtifactsFiles = {
  markdown: () => Promise.resolve(""),
  images: () => Promise.resolve({}),
  exists: () => Promise.resolve(true),
};

Deno.test("validateArtifacts accepts valid entries", async () => {
  const artifacts: Artifacts = { entries: [validEntry] };
  await validateArtifacts(artifacts, noFiles);
});

Deno.test("validateArtifacts rejects invalid entry shapes", async () => {
  const artifacts: Artifacts = {
    entries: [{ ...validEntry, type: "unknown" as ArtifactsEntry["type"] }],
  };
  await validateArtifacts(artifacts, noFiles).then(() => {
    throw new Error("Expected invalid type to be rejected.");
  }, () => {});
});

Deno.test("validateArtifacts requires exactly one of md or external_url", async () => {
  await validateArtifacts(
    { entries: [{ ...validEntry, external_url: "https://example.com" }] },
    noFiles,
  ).then(() => {
    throw new Error("Expected both md and external_url to be rejected.");
  }, () => {});
  await validateArtifacts(
    { entries: [{ ...validEntry, md: undefined }] },
    noFiles,
  ).then(() => {
    throw new Error("Expected missing md to be rejected.");
  }, () => {});
});

Deno.test("validateArtifacts rejects duplicate slugs", async () => {
  await validateArtifacts({ entries: [validEntry, validEntry] }, noFiles).then(
    () => {
      throw new Error("Expected duplicate slugs to be rejected.");
    },
    (error) => {
      expectError(
        () => {
          throw error;
        },
        "artifacts.json: post slugs must be unique.",
      );
    },
  );
});

Deno.test("validateArtifacts requires image dimensions for used images", async () => {
  const files: ArtifactsFiles = {
    ...noFiles,
    markdown: () => Promise.resolve("![Alt](images/example.png)"),
  };
  await validateArtifacts({ entries: [validEntry] }, files).then(() => {
    throw new Error("Expected missing image dimensions to be rejected.");
  }, (error) => {
    expectError(
      () => {
        throw error;
      },
      "images.json: images/example.png is used by posts/example-post/example-post.md but has no dimensions.",
    );
  });
});

Deno.test("validateArtifacts validates external URLs", async () => {
  await validateArtifacts(
    {
      entries: [{
        ...validEntry,
        md: undefined,
        external_url: "http://example.com",
      }],
    },
    noFiles,
  ).then(() => {
    throw new Error("Expected insecure external_url to be rejected.");
  }, () => {});
});

Deno.test("validateSite rejects unsupported nav accents", () => {
  expectError(
    () =>
      validateSite({
        title: "Site",
        description: "Site",
        url: "https://example.com",
        ga4_id: "G-1",
        nav: [{
          label: "Home",
          href: "/",
          accent: "purple" as Accent,
        }],
      }),
    "site.json: nav accent is not supported.",
  );
});

Deno.test("validateLanding rejects duplicate contact keys", () => {
  const contact: {
    key: string;
    label: string;
    href: string;
    accent: Accent;
  } = {
    key: "email",
    label: "Email",
    href: "mailto:me@example.com",
    accent: "blue",
  };
  expectError(
    () =>
      validateLanding({
        name: "Name",
        tagline: "Tagline",
        metadata: [{ label: "Role", value: "Engineer" }],
        contacts: [contact, contact],
      }),
    "landing.json: contact keys must be unique.",
  );
});

Deno.test("validateLanding rejects tagline_emphasis occurring twice", () => {
  expectError(
    () =>
      validateLanding({
        name: "Name",
        tagline: "Building bold bold artifacts",
        tagline_emphasis: "bold",
        metadata: [{ label: "Role", value: "Engineer" }],
        contacts: [{
          key: "email",
          label: "Email",
          href: "mailto:me@example.com",
          accent: "blue",
        }],
      }),
    "landing.json: tagline_emphasis must occur exactly once in tagline.",
  );
});

Deno.test("validateAbout requires portrait alt text", () => {
  expectError(
    () => validateAbout({ portrait: "images/me.jpg", portrait_alt: "" }),
    "about.json: portrait_alt is required.",
  );
});

Deno.test("validateExperience rejects non-hex colors", () => {
  expectError(
    () =>
      validateExperience({
        entries: [{
          year: "2026",
          company: "Company",
          role: "Role",
          location: "Remote",
          dates: "2026",
          color: "blue",
          content: "entry.md",
          html: "",
        }],
      }),
    "experience.json: entry color must be a hex color or linear gradient.",
  );
});

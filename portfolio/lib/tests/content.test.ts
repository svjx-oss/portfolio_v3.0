import {
  isVisibleArtifactsEntry,
  sortArtifactsEntriesByDate,
} from "@/lib/content/loadContent.ts";
import type { ArtifactsEntry } from "@/lib/shared/types.ts";

Deno.test("sortArtifactsEntriesByDate orders entries newest first", () => {
  const entries = sortArtifactsEntriesByDate([
    { date: "2025-01-01", title: "Older" },
    { date: "2025-12-31", title: "Newest" },
    { date: "2025-06-15", title: "Middle" },
  ]);

  if (entries.map((entry) => entry.title).join(",") !== "Newest,Middle,Older") {
    throw new Error("Expected entries to be ordered newest first.");
  }
});

Deno.test("sortArtifactsEntriesByDate does not mutate the input", () => {
  const entries = [{ date: "2025-01-01" }, { date: "2025-12-31" }];
  sortArtifactsEntriesByDate(entries);

  if (entries[0].date !== "2025-01-01") {
    throw new Error("Expected input entries to remain unchanged.");
  }
});

Deno.test("isVisibleArtifactsEntry excludes drafts outside development", () => {
  const draft: ArtifactsEntry = {
    title: "Draft",
    date: "2026-01-01",
    type: "writing",
    excerpt: "Draft post.",
    tags: ["Draft"],
    status: "draft",
    slug: "draft",
    md: "posts/draft/draft.md",
  };

  if (isVisibleArtifactsEntry(draft, false)) {
    throw new Error("Expected production filtering to exclude drafts.");
  }
  if (!isVisibleArtifactsEntry(draft, true)) {
    throw new Error("Expected development filtering to include drafts.");
  }
});

import {
  isVisibleThingsEntry,
  sortThingsEntriesByDate,
} from "@/lib/content/loadContent.ts";
import type { ThingsEntry } from "@/lib/shared/types.ts";

Deno.test("sortThingsEntriesByDate orders entries newest first", () => {
  const entries = sortThingsEntriesByDate([
    { date: "2025-01-01", title: "Older" },
    { date: "2025-12-31", title: "Newest" },
    { date: "2025-06-15", title: "Middle" },
  ]);

  if (entries.map((entry) => entry.title).join(",") !== "Newest,Middle,Older") {
    throw new Error("Expected entries to be ordered newest first.");
  }
});

Deno.test("sortThingsEntriesByDate does not mutate the input", () => {
  const entries = [{ date: "2025-01-01" }, { date: "2025-12-31" }];
  sortThingsEntriesByDate(entries);

  if (entries[0].date !== "2025-01-01") {
    throw new Error("Expected input entries to remain unchanged.");
  }
});

Deno.test("isVisibleThingsEntry excludes drafts outside development", () => {
  const draft: ThingsEntry = {
    title: "Draft",
    date: "2026-01-01",
    type: "writing",
    excerpt: "Draft post.",
    tags: ["Draft"],
    status: "draft",
    slug: "draft",
    md: "posts/draft/draft.md",
  };

  if (isVisibleThingsEntry(draft, false)) {
    throw new Error("Expected production filtering to exclude drafts.");
  }
  if (!isVisibleThingsEntry(draft, true)) {
    throw new Error("Expected development filtering to include drafts.");
  }
});

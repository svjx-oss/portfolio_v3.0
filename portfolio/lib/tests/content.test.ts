import { sortThingsEntriesByDate } from "@/lib/content/loadContent.ts";

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

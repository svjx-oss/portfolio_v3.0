import type { Accent, ThingsEntryType } from "@/lib/shared/types.ts";

export const thingsAccentByType = {
  project: "magenta",
  writing: "green",
  photography: "blue",
  notes: "gold",
  external: "teal",
} satisfies Record<ThingsEntryType, Accent>;

export const thingsTypeLabels = {
  project: "Project",
  writing: "Writing",
  photography: "Photography",
  notes: "Notes",
  external: "External",
} satisfies Record<ThingsEntryType, string>;

export function formatThingsDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

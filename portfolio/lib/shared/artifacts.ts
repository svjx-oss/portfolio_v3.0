import type { Accent, ArtifactsEntryType } from "@/lib/shared/types.ts";

export const artifactsAccentByType = {
  project: "magenta",
  writing: "green",
  photography: "blue",
  notes: "gold",
  external: "teal",
} satisfies Record<ArtifactsEntryType, Accent>;

export const artifactsTypeLabels = {
  project: "Project",
  writing: "Writing",
  photography: "Photography",
  notes: "Notes",
  external: "External",
} satisfies Record<ArtifactsEntryType, string>;

export function formatArtifactsDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

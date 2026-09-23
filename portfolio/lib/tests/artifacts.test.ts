import {
  artifactsAccentByType,
  artifactsTypeLabels,
  formatArtifactsDate,
} from "@/lib/shared/artifacts.ts";
import type { ArtifactsEntryType } from "@/lib/shared/types.ts";

const types: ArtifactsEntryType[] = [
  "project",
  "writing",
  "photography",
  "notes",
  "external",
];

Deno.test("Artifacts display configuration covers every entry type", () => {
  for (const type of types) {
    if (!artifactsTypeLabels[type] || !artifactsAccentByType[type]) {
      throw new Error(`Expected a label and accent for ${type}.`);
    }
  }
});

Deno.test("Artifacts accents use the shared accent configuration", () => {
  for (const accent of Object.values(artifactsAccentByType)) {
    if (!accents.includes(accent)) {
      throw new Error(`Expected ${accent} to be a shared accent.`);
    }
  }
});

Deno.test("formatArtifactsDate formats ISO dates consistently", () => {
  if (formatArtifactsDate("2026-07-15") !== "Jul 15, 2026") {
    throw new Error("Expected stable English ISO date formatting.");
  }
});
import { accents } from "@/lib/shared/accents.ts";

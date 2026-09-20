import {
  formatThingsDate,
  thingsAccentByType,
  thingsTypeLabels,
} from "@/lib/shared/things.ts";
import type { ThingsEntryType } from "@/lib/shared/types.ts";

const types: ThingsEntryType[] = [
  "project",
  "writing",
  "photography",
  "notes",
  "external",
];

Deno.test("Things display configuration covers every entry type", () => {
  for (const type of types) {
    if (!thingsTypeLabels[type] || !thingsAccentByType[type]) {
      throw new Error(`Expected a label and accent for ${type}.`);
    }
  }
});

Deno.test("Things accents use the shared accent configuration", () => {
  for (const accent of Object.values(thingsAccentByType)) {
    if (!accents.includes(accent)) {
      throw new Error(`Expected ${accent} to be a shared accent.`);
    }
  }
});

Deno.test("formatThingsDate formats ISO dates consistently", () => {
  if (formatThingsDate("2026-07-15") !== "Jul 15, 2026") {
    throw new Error("Expected stable English ISO date formatting.");
  }
});
import { accents } from "@/lib/shared/accents.ts";

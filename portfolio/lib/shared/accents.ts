export const accents = [
  "sienna",
  "coral",
  "blue",
  "magenta",
  "green",
  "violet",
  "teal",
  "gold",
] as const;

export type Accent = typeof accents[number];

export const accentSet = new Set<string>(accents);

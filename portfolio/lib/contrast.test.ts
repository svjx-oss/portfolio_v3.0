import { contrastRatio } from "@/lib/contrast.ts";

const darkBackground = "#0C111A";
const lightBackground = "#F2F6FD";
const darkAccents = [
  "#FF8066",
  "#90C8FF",
  "#FF8DCF",
  "#7BF1A8",
  "#BDB2FF",
  "#FFD166",
];
const lightAccents = [
  "#8C3523",
  "#1D4F91",
  "#7F245D",
  "#21613F",
  "#56458E",
  "#705000",
];

Deno.test("theme text tokens meet AA contrast", () => {
  for (
    const [foreground, background] of [
      ["#F3F4F6", darkBackground],
      ["#C5CAD3", darkBackground],
      ["#AAB1BD", darkBackground],
      ["#0F172A", lightBackground],
      ["#334155", lightBackground],
      ["#5F718A", lightBackground],
    ]
  ) {
    if (contrastRatio(foreground, background) < 4.5) {
      throw new Error(`${foreground} on ${background} is below 4.5:1`);
    }
  }
});

Deno.test("accent tokens meet AA contrast", () => {
  for (
    const [foreground, background] of [
      ...darkAccents.map((color) => [color, darkBackground]),
      ...lightAccents.map((color) => [color, lightBackground]),
    ]
  ) {
    if (contrastRatio(foreground, background) < 4.5) {
      throw new Error(`${foreground} on ${background} is below 4.5:1`);
    }
  }
});

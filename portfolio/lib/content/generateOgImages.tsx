import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import {
  loadPublishedThingsPosts,
  loadSite,
} from "@/lib/content/loadContent.ts";
import {
  formatThingsDate,
  thingsAccentByType,
  thingsTypeLabels,
} from "@/lib/shared/things.ts";
import type { ThingsEntry, ThingsEntryType } from "@/lib/shared/types.ts";

const width = 1200;
const height = 630;
const scale = 2;
const fontUrls = [
  {
    weight: 400 as const,
    url:
      "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf",
  },
  {
    weight: 500 as const,
    url:
      "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
  },
  {
    weight: 600 as const,
    url:
      "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
  },
] as const;
const accentColors = {
  blue: "#90C8FF",
  gold: "#FFD166",
  green: "#7BF1A8",
  magenta: "#FF8DCF",
  teal: "#7ED9D1",
  violet: "#BDB2FF",
} as const;
const colors = {
  background: "#0C111A",
  border: "rgba(244, 241, 235, 0.24)",
  divider: "rgba(244, 241, 235, 0.12)",
  text: "#F3F4F6",
  subtle: "#C5CAD3",
  muted: "#AAB1BD",
  url: "#FF8066",
} as const;

interface SatoriElement {
  type: string;
  props: Record<string, unknown>;
}

async function loadFonts() {
  return await Promise.all(
    fontUrls.map(async ({ weight, url }) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Could not load Inter ${weight} from Google Fonts.`);
      }
      return {
        data: await response.arrayBuffer(),
        name: "Inter",
        style: "normal" as const,
        weight,
      };
    }),
  );
}

function el(
  type: string,
  props: Record<string, unknown>,
  ...children: Array<SatoriElement | string>
): SatoriElement {
  return { type, props: { ...props, children } };
}

interface CardData {
  title: string;
  blurb: string;
  type: string;
  accent: string;
  date: string;
  cta: string;
  siteUrl: string;
}

function ctaForType(type: ThingsEntryType) {
  if (type === "photography") return "View the Photograph →";
  return `View the ${thingsTypeLabels[type]} →`;
}

function cardData(post: ThingsEntry, siteUrl: string): CardData {
  return {
    title: post.title,
    blurb: post.excerpt,
    type: thingsTypeLabels[post.type],
    accent: accentColors[thingsAccentByType[post.type as ThingsEntryType]],
    date: formatThingsDate(post.date),
    cta: ctaForType(post.type),
    siteUrl,
  };
}

async function createPng(
  { title, blurb, type, accent, date, cta, siteUrl }: CardData,
  fonts: Awaited<ReturnType<typeof loadFonts>>,
) {
  const svg = await satori(
    el(
      "div",
      {
        style: {
          background: colors.background,
          color: colors.text,
          display: "flex",
          fontFamily: "Inter",
          height,
          padding: 64,
          width,
        },
      },
      el(
        "div",
        {
          style: {
            border: `6px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "64px 58px 48px",
            width: "100%",
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 24,
            },
          },
          el("div", {
            style: {
              background: accent,
              display: "flex",
              height: 8,
              width: 112,
            },
          }),
          el(
            "div",
            {
              style: {
                display: "flex",
                fontSize: 54,
                fontWeight: 600,
                letterSpacing: -1,
                lineHeight: 1.12,
              },
            },
            title,
          ),
          el(
            "div",
            {
              style: {
                color: colors.subtle,
                display: "flex",
                fontSize: 25,
                fontWeight: 500,
                lineHeight: 1.4,
              },
            },
            blurb,
          ),
        ),
        el(
          "div",
          {
            style: {
              borderTop: `3px solid ${colors.divider}`,
              display: "flex",
              gap: 18,
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: 1,
              marginTop: 38,
              paddingTop: 28,
            },
          },
          el(
            "div",
            { style: { color: accent, display: "flex" } },
            type.toUpperCase(),
          ),
          el(
            "div",
            {
              style: {
                color: colors.muted,
                display: "flex",
              },
            },
            date,
          ),
        ),
        el(
          "div",
          {
            style: {
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingTop: 28,
            },
          },
          el(
            "div",
            {
              style: {
                color: colors.text,
                display: "flex",
                fontSize: 20,
                fontWeight: 600,
              },
            },
            cta,
          ),
          el(
            "div",
            {
              style: {
                color: colors.muted,
                display: "flex",
                fontSize: 17,
                fontWeight: 500,
              },
            },
            siteUrl.replace(/^https:\/\//, ""),
          ),
        ),
      ),
    ),
    {
      fonts,
      height,
      width,
    },
  );

  const png = new Resvg(new TextEncoder().encode(svg), {
    fitTo: { mode: "width", value: width * scale },
  }).render().asPng();
  return new Uint8Array(png.buffer, png.byteOffset, png.byteLength);
}

export async function generateOgImages() {
  const [posts, site] = await Promise.all([
    loadPublishedThingsPosts(),
    loadSite(),
  ]);
  const fonts = await loadFonts();
  await Deno.mkdir("static/og/things", { recursive: true });

  await Promise.all(posts.map(async (post) => {
    if (!post.slug) return;
    const image = await createPng(cardData(post, site.url), fonts);
    await Deno.writeFile(`static/og/things/${post.slug}.png`, image);
  }));

  return posts.length;
}

if (import.meta.main) {
  const count = await generateOgImages();
  console.log(`Generated ${count} Things Open Graph images.`);
}

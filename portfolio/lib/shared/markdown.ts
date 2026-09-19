import MarkdownIt from "markdown-it";
import type { Heading, ThingsImage } from "@/lib/shared/types.ts";

const markdown = new MarkdownIt({ html: false });

export function renderMarkdown(raw: string): string {
  return markdown.render(raw);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(
    /^-|-$/g,
    "",
  );
}

export function renderPostMarkdown(
  raw: string,
  slug: string,
  images: Record<string, ThingsImage> = {},
) {
  const headings: Heading[] = [];
  const usedIds = new Map<string, number>();
  const tokens = markdown.parse(raw, {});

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.type !== "heading_open") continue;

    const level = Number(token.tag.slice(1));
    if (level !== 1 && level !== 2) continue;
    const text = tokens[index + 1]?.content ?? "";
    const baseId = slugify(text) || "section";
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    token.attrSet("id", id);
    headings.push({ id, level, text });
  }

  for (const token of tokens) {
    if (token.type !== "inline" || !token.children) continue;
    for (const child of token.children) {
      if (child.type !== "image") continue;
      const src = child.attrGet("src");
      if (
        typeof src !== "string" || src.startsWith("/") || /^https?:/.test(src)
      ) {
        continue;
      }
      const image = images[src];
      const filename = src.split("/").at(-1);
      child.attrSet("src", `/things/${slug}/${filename}`);
      if (image) {
        child.attrSet("width", String(image.width));
        child.attrSet("height", String(image.height));
      }
    }
  }

  return {
    html: markdown.renderer.render(tokens, markdown.options, {}),
    headings,
  };
}

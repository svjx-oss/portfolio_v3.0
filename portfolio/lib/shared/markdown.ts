import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import type { Heading, ThingsImage } from "@/lib/shared/types.ts";

const markdown = new MarkdownIt({
  html: false,
  highlight(code, language) {
    if (!language || !hljs.getLanguage(language)) return "";
    return hljs.highlight(code, { language }).value;
  },
});
const callouts = {
  NOTE: { label: "Note", icon: "i" },
  TIP: { label: "Tip", icon: "*" },
  IMPORTANT: { label: "Important", icon: "!" },
  WARNING: { label: "Warning", icon: "!" },
  CAUTION: { label: "Caution", icon: "!" },
};

export function renderMarkdown(raw: string): string {
  return markdown.render(raw);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(
    /^-|-$/g,
    "",
  );
}

function renderCodeBlock(code: string, info: string) {
  const [language = "", ...attributes] = info.trim().split(/\s+/);
  const title = attributes.join(" ").match(/^title="([^"]+)"$/)?.[1];
  const highlighted = language && hljs.getLanguage(language)
    ? hljs.highlight(code, { language }).value
    : markdown.utils.escapeHtml(code);
  const lineNumbers = code.trimEnd().split("\n").map((_, index) => index + 1)
    .join("\n");
  const header = title
    ? `<div class="things-post__code-header">${
      markdown.utils.escapeHtml(title)
    }</div>`
    : "";

  return `<div class="things-post__code-block">${header}<pre><code class="language-${
    markdown.utils.escapeHtml(language)
  }"><span class="things-post__code-lines" aria-hidden="true">${lineNumbers}</span><span class="things-post__code-content">${highlighted}</span></code></pre></div>`;
}

export function renderPostMarkdown(
  raw: string,
  slug: string,
  images: Record<string, ThingsImage> = {},
) {
  const headings: Heading[] = [];
  const usedIds = new Map<string, number>();
  const tokens = markdown.parse(raw, {});

  for (let index = 0; index < tokens.length - 3; index++) {
    const opening = tokens[index];
    const paragraph = tokens[index + 1];
    const inline = tokens[index + 2];
    const closing = tokens[index + 3];
    if (
      opening.type !== "blockquote_open" ||
      paragraph.type !== "paragraph_open" ||
      inline.type !== "inline" ||
      closing.type !== "paragraph_close"
    ) {
      continue;
    }

    const match = inline.content.match(/^\[!(\w+)\]\n?/);
    const callout = match && callouts[match[1] as keyof typeof callouts];
    if (!callout) continue;

    opening.tag = "aside";
    opening.attrSet(
      "class",
      `things-post__callout things-post__callout--${match[1].toLowerCase()}`,
    );
    opening.attrSet("role", "note");
    inline.content = inline.content.slice(match[0].length);
    if (inline.children?.[0]?.type === "text") {
      inline.children[0].content = inline.children[0].content.slice(
        match[0].length,
      );
    }
    const titleToken = Object.create(paragraph);
    titleToken.type = "html_block";
    titleToken.tag = "";
    titleToken.nesting = 0;
    titleToken.content =
      `<p class="things-post__callout-title"><span aria-hidden="true">${callout.icon}</span>${callout.label}</p>`;
    titleToken.block = true;
    tokens.splice(index + 1, 0, titleToken);
    closing.tag = "aside";
  }

  for (const token of tokens) {
    if (token.type !== "fence") continue;
    token.type = "html_block";
    token.content = renderCodeBlock(token.content, token.info);
  }

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
      const src = child.attrGet(child.type === "link_open" ? "href" : "src");
      if (
        typeof src !== "string" || src.startsWith("/") || /^https?:/.test(src)
      ) {
        continue;
      }
      if (child.type === "link_open" && src.endsWith(".pdf")) {
        child.attrSet("href", `/things/${slug}/${src}`);
        child.attrJoin("class", "things-post__document-link");
        continue;
      }
      if (child.type !== "image") continue;
      const image = images[src];
      const filename = src.split("/").at(-1);
      child.attrSet("src", `/things/${slug}/${filename}`);
      if (image) {
        child.attrSet("width", String(image.width));
        child.attrSet("height", String(image.height));
        if (image.caption) {
          child.attrSet("data-caption", image.caption);
        }
      }
    }
  }

  const imageRenderer = markdown.renderer.rules.image;
  markdown.renderer.rules.image = (tokens, index, options, env, self) => {
    const image = tokens[index];
    const caption = String(image.attrGet("data-caption") ?? "");
    const rendered = imageRenderer
      ? imageRenderer(tokens, index, options, env, self)
      : self.renderToken(tokens, index, options);
    return caption
      ? `<figure>${rendered}<figcaption>${
        markdown.utils.escapeHtml(caption)
      }</figcaption></figure>`
      : rendered;
  };

  const html = markdown.renderer.render(tokens, markdown.options, {}).replace(
    /<p>(<figure>.*?<\/figure>)<\/p>/gs,
    "$1",
  );
  markdown.renderer.rules.image = imageRenderer;

  return {
    html,
    headings,
  };
}

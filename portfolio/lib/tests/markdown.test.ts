import { renderPostMarkdown } from "@/lib/shared/markdown.ts";

Deno.test("renderPostMarkdown renders callouts with labels and body text", () => {
  const { html } = renderPostMarkdown(
    "> [!WARNING]\n> Keep retries bounded.",
    "example",
  );

  if (
    !html.includes('class="things-post__callout things-post__callout--warning"')
  ) {
    throw new Error("Expected a warning callout.");
  }
  if (!html.includes("Warning") || !html.includes("Keep retries bounded.")) {
    throw new Error("Expected the callout label and body.");
  }
  if (html.includes("[!WARNING]")) {
    throw new Error("Expected the callout marker to be removed.");
  }
});

for (
  const [language, source, token] of [
    ["ts", "const answer: number = 42;", "hljs-keyword"],
    ["cpp", "int main() { return 0; }", "hljs-function"],
    ["python", "def greet():\n    return 'hello'", "hljs-keyword"],
  ] as const
) {
  Deno.test(`renderPostMarkdown highlights ${language} code blocks`, () => {
    const { html } = renderPostMarkdown(
      `\`\`\`${language} title="example.${language}"\n${source}\n\`\`\``,
      "example",
    );

    if (!html.includes('class="things-post__code-block"')) {
      throw new Error("Expected a code card.");
    }
    if (!html.includes(`example.${language}`) || !html.includes(token)) {
      throw new Error(`Expected ${language} title and highlighted tokens.`);
    }
    if (
      !html.includes('class="things-post__code-lines" aria-hidden="true">1')
    ) {
      throw new Error("Expected line numbers.");
    }
  });
}

Deno.test("renderPostMarkdown renders code cards without titles", () => {
  const { html } = renderPostMarkdown(
    "```ts\nconst value = 1;\n```",
    "example",
  );

  if (!html.includes('class="things-post__code-block"')) {
    throw new Error("Expected a code card.");
  }
  if (html.includes("things-post__code-header")) {
    throw new Error("Expected no header for a title-less fence.");
  }
  if (!html.includes("hljs-keyword")) {
    throw new Error("Expected highlighted tokens.");
  }
});

Deno.test("renderPostMarkdown deduplicates duplicate heading slugs", () => {
  const { html, headings } = renderPostMarkdown(
    "## Setup\n\nFirst.\n\n## Setup\n\nSecond.",
    "example",
  );

  if (headings.length !== 2) {
    throw new Error("Expected both headings to be collected.");
  }
  if (headings[0].id === headings[1].id) {
    throw new Error("Expected duplicate slugs to be deduplicated.");
  }
  if (
    !html.includes(`id="${headings[0].id}"`) ||
    !html.includes(`id="${headings[1].id}"`)
  ) {
    throw new Error("Expected heading ids to be rendered.");
  }
});

Deno.test("renderPostMarkdown safely renders unsupported code fences", () => {
  const source = "<script>alert('xss')</script>";
  const { html } = renderPostMarkdown(
    `\`\`\`unknown\n${source}\n\`\`\``,
    "example",
  );

  if (!html.includes("&lt;script&gt;alert('xss')&lt;/script&gt;")) {
    throw new Error("Expected unsupported code to be escaped.");
  }
  if (html.includes('<script>alert("xss")</script>')) {
    throw new Error("Expected unsupported code not to render as HTML.");
  }
});

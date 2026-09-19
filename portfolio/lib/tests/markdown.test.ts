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

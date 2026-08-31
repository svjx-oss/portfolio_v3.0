import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({ html: false });

export function renderMarkdown(raw: string): string {
  return markdown.render(raw);
}

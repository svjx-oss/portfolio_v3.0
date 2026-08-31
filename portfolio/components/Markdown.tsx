// deno-lint-ignore-file react-no-danger

export default function Markdown({ html }: { html: string }) {
  // Markdown-it runs with raw HTML disabled before this SSR-only insertion.
  return <div class="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

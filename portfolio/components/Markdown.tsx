// deno-lint-ignore-file react-no-danger

export default function Markdown(
  { html, className = "prose" }: { html: string; className?: string },
) {
  // Markdown-it runs with raw HTML disabled before this SSR-only insertion.
  return <div class={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

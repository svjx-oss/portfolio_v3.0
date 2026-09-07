import Markdown from "@/components/Markdown.tsx";
import type { AboutContent } from "@/lib/types.ts";

export default function AboutPage({ html }: AboutContent) {
  return (
    <article>
      <Markdown html={html} />
    </article>
  );
}

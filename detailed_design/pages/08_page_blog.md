# 08 — Blog (`/blog` + `/blog/{slug}`)

> Routes: `routes/blog/index.tsx`, `routes/blog/[slug].tsx`, `routes/blog/[slug]/[asset].tsx`, `routes/blog/feed.xml.ts` · CSS: `assets/blog.css`
> Wireframe: `09` §5–6

---

## Blog index (`/blog`)

Simple list with author badge, excerpt, and tags (the context they add is worth it).

```tsx
// routes/blog/index.tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadBlogIndex } from "@/lib/loadContent.ts";
import BlogList from "@/components/BlogList.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const blog = await loadBlogIndex();
    return page({ blog });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <BlogList entries={data.blog.entries} />
));
```

```tsx
// components/BlogList.tsx
import SectionTitle from "@/components/SectionTitle.tsx";
import Tag from "@/components/Tag.tsx";
import type { BlogEntry } from "@/lib/types.ts";

// Author badge is hardcoded — single author, no authors.json
const AUTHOR = { name: "Sahil Jaganmohan", image: "/static/authors/sahil.jpg" };

export default function BlogList({ entries }: { entries: BlogEntry[] }) {
  return (
    <article class="blog">
      <SectionTitle title="Blog" subtitle="writing, notes, and elsewhere" />
      {entries.length === 0 && <p class="blog__empty">No posts yet — check back soon.</p>}
      <ul class="blog-list">
        {entries.map((e) => {
          const external = "external_url" in e;
          const href = external ? e.external_url : `/blog/${e.slug}`;
          return (
            <li class="blog-row">
              <div class="blog-row__meta">
                <img class="author-avatar" src={AUTHOR.image} alt={AUTHOR.name} width="24" height="24" />
                <span class="author-name">{AUTHOR.name}</span>
                <span class="blog-row__sep">·</span>
                <time class="blog-row__date">{formatDate(e.date)}</time>
              </div>
              <a class="blog-row__title" href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                {e.title}{external && " ↗"}
              </a>
              <p class="blog-row__excerpt">{e.excerpt}</p>
              {"tags" in e && e.tags.length > 0 && (
                <ul class="blog-row__tags">{e.tags.map((t) => <Tag tag={t} />)}</ul>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
```

- Author badge: circular avatar + name, hardcoded in the component (single author — no `authors.json`).
- Each row: author + date + title (link) + excerpt + tags (for posts). Thin dividers between rows.
- External entries: `↗` marker, new tab, no tags.
- `Elsewhere` section renders `site.elsewhere` (hidden if empty).

---

## Blog post (`/blog/{slug}`)

```tsx
// routes/blog/[slug].tsx
import { page, HttpError } from "fresh";
import { define } from "@/utils.ts";
import { loadBlogPost } from "@/lib/loadContent.ts";
import PostView from "@/components/PostView.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const post = await loadBlogPost(ctx.params.slug);
    if (!post) throw new HttpError(404);
    return page({ post });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <PostView {...data.post} />
));
```

```tsx
// components/PostView.tsx
import type { BlogPost } from "@/lib/types.ts";

export default function PostView({ entry, html, headings }: BlogPost) {
  const toc = headings.filter((h) => h.level <= 2);  // H1 + H2
  return (
    <article class="post">
      <h1 class="post__title">{entry.title}</h1>
      <time class="post__date">{formatDate(entry.date)}</time>

      {toc.length > 0 && (
        <details class="post__toc">
          <summary>On this page</summary>
          <ol>{toc.map((h) => <li><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
        </details>
      )}

      <div class="prose post__body" dangerouslySetInnerHTML={{ __html: html }} />
      <footer><a href="/blog">← back to blog</a></footer>
    </article>
  );
}
```

- No `Toc.tsx` component — TOC is inline, 5 lines.
- No author badge — just date.
- TOC shows H1 (post title) + H2s. Collapses via `<details>` (no JS).
- `throw new HttpError(404)` for missing/draft slugs.

---

## Asset route (`/blog/{slug}/{asset}`)

Serves co-located post images (image types only, long cache):

```tsx
// routes/blog/[slug]/[asset].tsx
import { define } from "@/utils.ts";

const TYPES: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
};

export const handler = define.handlers({
  GET(ctx) {
    const ext = ctx.params.asset.split(".").pop()?.toLowerCase() ?? "";
    const type = TYPES[ext];
    if (!type) return new Response("Not found", { status: 404 });
    try {
      const bytes = Deno.readFileSync(`content/blog/posts/${ctx.params.slug}/${ctx.params.asset}`);
      return new Response(bytes, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000" } });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
});
```

---

## RSS feed (`/blog/feed.xml.ts`)

Renders published posts to RSS 2.0 XML. ~20 lines using `loadBlogIndex()`.

---

## Analytics

- Index click → internal: `blog_open`. External: `blog_outbound`.
- TOC anchor: `toc_click`.

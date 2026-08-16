# 08 — Blog (`/blog` + `/blog/{slug}`)

> Routes: `routes/blog/index.tsx`, `routes/blog/[slug].tsx`, `routes/blog/[slug]/[asset].tsx`, `routes/blog/feed.xml.ts` · Content: `content/blog/blog.json` + `authors.json` + `posts/<slug>/<slug>.md` (+ co-located images) · CSS: `assets/blog.css`
> Goal (design doc): an easy-to-extend markdown blog with a TOC (H2 only, top of page, collapses on mobile). The index also surfaces **external-link entries** (Q13) that redirect off-site.

---

## 1. Content source
- `blog.json` — entries, discriminated by `kind: "post"` (internal) or `kind: "link"` (external). Schema → `02` §6.
- `authors.json` — `id → {name, image}`.
- `posts/<slug>/<slug>.md` — pure markdown body (no frontmatter; metadata lives in `blog.json` to avoid drift).
- `posts/<slug>/*.{png,jpg,...}` — co-located images (future use; the asset route ships from day one).

## 2. Route A — Blog index (`/blog`)

### 2.1 Handler
```tsx
// routes/blog/index.tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadBlogIndex } from "@/lib/loadContent.ts";
import BlogList from "@/components/BlogList.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const blog = await loadBlogIndex();   // joins entries with their author; sorts by date desc; filters drafts
    return page({ blog });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <BlogList entries={data.blog.entries} />
));
```
`loadBlogIndex()`:
- merges each entry with its `author` (from `authors.json`),
- **sorts newest-first by `date`**,
- **excludes** `status: "draft"` entries,
- returns the joined list. (Drafts are still validated at build but hidden at runtime.)

### 2.2 `BlogList` + `BlogCard` + `AuthorBadge` (server, `components/`)
```tsx
// components/BlogList.tsx
import SectionTitle from "@/components/SectionTitle.tsx";
import BlogCard from "@/components/BlogCard.tsx";
import { useSite } from "@/lib/loadContent.ts";   // or read from ctx.state.site via props

export default function BlogList({ entries }: { entries: BlogEntry[] }) {
  return (
    <article class="blog">
      <SectionTitle title="Blog" subtitle="writing, notes, and elsewhere" />
      {entries.length === 0 && <p class="blog__empty">No posts yet — check back soon.</p>}
      <ul class="blog-list">
        {entries.map((e) => <li><BlogCard entry={e} /></li>)}
      </ul>
      <ElsewhereSection />   {/* Q13: off-site links from site.json.elsewhere; hidden if empty */}
    </article>
  );
}
```
```tsx
// components/BlogCard.tsx
import AuthorBadge from "@/components/AuthorBadge.tsx";
import type { BlogEntry } from "@/lib/types.ts";

export default function BlogCard({ entry }: { entry: BlogEntry }) {
  const href = entry.kind === "post" ? `/blog/${entry.slug}` : entry.external_url;
  const external = entry.kind === "link";
  return (
    <a class="blog-card card" href={href}
       target={external ? "_blank" : undefined}
       rel={external ? "noopener noreferrer" : undefined}
       data-event={external ? "blog_outbound" : "blog_open"}>
      <div class="blog-card__meta">
        <AuthorBadge author={entry.author} />
        <time class="blog-card__date">{formatDate(entry.date)}</time>
      </div>
      <h2 class="blog-card__title">{entry.title}</h2>
      <p class="blog-card__excerpt">{entry.excerpt}</p>
      {entry.kind === "post" && entry.tags?.length > 0 && (
        <ul class="blog-card__tags">{entry.tags.map((t) => <li class="tag tag--ghost">{t}</li>)}</ul>
      )}
      {external && <span class="blog-card__ext">↗ external</span>}
    </a>
  );
}
```
- **One card markup** handles both kinds: an internal post links to `/blog/<slug>`; an external entry links to `external_url` in a new tab. The card always shows title + author badge + date + excerpt (per Q13). External cards get a small `↗ external` marker and no tags.
- `AuthorBadge` renders `[circular img] Name` (Q11a): `entry.author.image` (round, 32px) + `entry.author.name`.

### 2.3 `ElsewhereSection` (Q13)
Renders `site.elsewhere` as a small row of icon links (e.g. Medium, GitHub, Substack). If `elsewhere` is `[]`, the section isn't rendered (no "empty" block). Icons via `icons.tsx` keyed by `icon`. This is the "links to other mediums" feature — content-driven, edit `site.json` to change.

### 2.4 Index layout & CSS
```css
.blog-list { list-style: none; padding: 0; display: grid; gap: var(--space-4); }
.blog-card { display: block; text-decoration: none; color: inherit; }
.blog-card__meta { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2); }
.author-badge { display: inline-flex; align-items: center; gap: var(--space-2); }
.author-badge img { width: 32px; height: 32px; border-radius: 50%; }
.author-badge__name { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); }
.blog-card__date { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); }
.blog-card__title { font-size: var(--text-xl); margin: 0 0 var(--space-2); color: var(--color-text); }
.blog-card:hover .blog-card__title { color: var(--color-accent); }
.blog-card__excerpt { font-size: var(--text-sm); color: var(--color-text-subtle); margin: 0; }
.tag--ghost { background: transparent; border: 1px solid var(--color-border); color: var(--color-text-subtle); }
.blog-elsewhere { margin-top: var(--space-16); }
```

## 3. Route B — Blog post (`/blog/{slug}`)

### 3.1 Handler
```tsx
// routes/blog/[slug].tsx
import { page, HttpError } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { loadBlogPost } from "@/lib/loadContent.ts";
import PostView from "@/components/PostView.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const post = await loadBlogPost(ctx.params.slug);  // returns null if missing/draft
    if (!post) throw new HttpError(404);                // -> themed _error.tsx
    return page({ post });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <>
    <Head><title>{data.post.entry.title} — Blog</title></Head>
    <PostView {...data.post} />
  </>
));
```
`loadBlogPost(slug)`:
- finds the `kind: "post"` entry whose `slug` matches,
- rejects drafts (returns null → 404) so a staged draft is never accidentally live,
- reads + renders the `md` body (relative images rewritten to `/blog/<slug>/<file>`),
- returns `{ entry, author, html, headings }`.

### 3.2 `PostView` with TOC (Q12) — server component, `components/PostView.tsx`
```tsx
import AuthorBadge from "@/components/AuthorBadge.tsx";
import type { BlogPost } from "@/lib/types.ts";

export default function PostView({ entry, author, html, headings }: BlogPost) {
  const h2s = headings.filter((h) => h.level === 2);     // TOC = H2 only
  return (
    <article class="post">
      <header class="post__head">
        <h1 class="post__title">{entry.title}</h1>
        <div class="post__meta">
          <AuthorBadge author={author} />
          <time>{formatDate(entry.date)}</time>
        </div>
        {entry.tags?.length > 0 && (
          <ul class="post__tags">{entry.tags.map((t) => <li class="tag tag--ghost">{t}</li>)}</ul>
        )}
      </header>

      <nav class="post__toc" aria-label="Table of contents">
        <details class="toc">
          <summary>On this page</summary>
          <ol>{h2s.map((h) => <li><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
        </details>
      </nav>

      <div class="prose post__body" dangerouslySetInnerHTML={{ __html: html }} />
      <footer class="post__footer"><a href="/blog">← back to blog</a></footer>
    </article>
  );
}
```

### 3.3 TOC behavior (Q12 — confirmed "yes to all")
- **Auto-generated** from `## H2` headings only (the `headings` returned by `renderMarkdown` — `02` §7). No manual TOC in the md file.
- Positioned **above the body**, between the header and the content.
- **Mobile:** wrapped in `<details class="toc"><summary>On this page ▾</summary>…` — native collapse, **no JS** (Q12 + the no-JS principle). Desktop (≥768px): the `<details>` is forced open via CSS (`details.toc[open]` always — or just `display` the inner list, no `<details>` on desktop). Anchors jump to `#id` with `scroll-margin-top` clearing the sticky header.
- `H3+` excluded. Empty H2 list → the TOC `<nav>` isn't rendered.

### 3.4 Post layout & CSS
```css
.post { max-width: var(--content-max); margin-inline: auto; }
.post__title { font-size: var(--text-2xl); margin: var(--space-4) 0 var(--space-3); }
.post__meta { display: flex; align-items: center; gap: var(--space-3); color: var(--color-text-muted); font-family: var(--font-mono); font-size: var(--text-sm); margin-bottom: var(--space-6); }
.post__toc { background: var(--color-bg-2); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3) var(--space-4); margin-bottom: var(--space-8); }
.post__toc ol { list-style: decimal; padding-left: var(--space-6); }
.post__toc a { color: var(--color-text-subtle); text-decoration: none; }
.post__toc a:hover { color: var(--color-accent); }
@media (min-width: 768px){ details.toc > summary { display: none; } details.toc > ol { display: block !important; } }
/* mobile keeps native <details> toggle */
.prose.post__body h2 { scroll-margin-top: 5rem; }   /* clear sticky header on anchor jump */
```

## 4. Route C — Co-located image asset (`/blog/{slug}/{asset}`)
A tiny handler so `![](image01.png)` in a post resolves to a real URL (Q14). Not used until your first image, but ships from day one.
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
    const path = `content/blog/posts/${ctx.params.slug}/${ctx.params.asset}`;
    try {
      const bytes = Deno.readFileSync(path);
      return new Response(bytes, {
        headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000" },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
});
```
- Only image types allowed (no serving `.md`/`.json` from a post folder — defense in depth).
- Long cache (immutable; filename is the cache key).
- The markdown loader rewrites `src="image01.png"` → `src="/blog/<slug>/image01.png"` (per `02` §7).

## 5. The 404 case (missing/draft slug)
`throw new HttpError(404)` in the handler → Fresh renders `routes/_error.tsx` (the unified themed error page, with the 404 message + a link home — Q20). A draft slug hit also 404s, so staged drafts aren't exposed.

## 6. Responsive wireframes
```
Blog index (mobile):               Blog post (mobile):
┌─────────────────────┐           ┌──────────────────────┐
│ Blog                │           │ Post Title            │
│ writing, notes...   │           │ [img] Author · 2026-08│
├─────────────────────┤           │ [tag] [tag]           │
│ [img] Author · date │           ├──────────────────────┤
│ My First Post       │           │ ▾ On this page        │
│ excerpt...          │           │   1. Intro            │
│ [tag][tag]          │           │   2. Build            │
├─────────────────────┤           ├──────────────────────┤
│ [img] Author · date │           │ ## Intro              │
│ External essay ↗    │           │ body...               │
│ excerpt...          │           │ ## Build              │
└─────────────────────┘           │ ...                   │
                                  │ ← back to blog        │
                                  └──────────────────────┘
```
Full diagrams → `09`.

## 7. Implementation notes
- The blog starts empty ("No posts yet — check back soon." message). The schemas in `02` are ready for the first post.
- The blog is the net-new feature called out in the design doc; the data model is designed so adding a post is a 2-step edit (write md + one JSON line — see `11`).

## 8. Analytics (doc `10`)
- Index card → internal post: `blog_open` (label = slug).
- Index card → external: `blog_outbound` (label = external domain).
- TOC anchor clicks: `toc_click` (label = heading text) — gives you "did readers engage with the structure."
- "← back to blog" and footer/nav: auto by destination.

## 9. Supplementary: RSS feed (`/blog/feed.xml`)
A small route renders the published posts to RSS 2.0 XML using `loadBlogIndex()`. ~30 lines. Useful for syndication ("post my thoughts"). Content-type `application/rss+xml; charset=utf-8`. Resolved: yes (see `12` Part D).
```tsx
// routes/blog/feed.xml.ts
import { define } from "@/utils.ts";
import { loadBlogIndex } from "@/lib/loadContent.ts";
import { loadSite } from "@/lib/loadContent.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const site = ctx.state.site;
    const { entries } = await loadBlogIndex();
    const items = entries
      .filter((e) => e.kind === "post")
      .map((e) => `    <item><title>${escape(e.title)}</title><link>${site.url}/blog/${e.slug}</link><pubDate>${new Date(e.date).toUTCString()}</pubDate><guid>${site.url}/blog/${e.slug}</guid></item>`)
      .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(site.title)}</title><link>${site.url}/blog</link><description>${escape(site.description)}</description>\n${items}\n  </channel></rss>`;
    return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
  },
});
```
(`escape` is a tiny XML-escape helper in `lib/markdown.ts` or `lib/utils.ts`.)

## 10. Resolved blog questions (→ `12_open_questions.md`)
- **B-sort** Index sort by `date` desc (manual control). → Resolved: yes.
- **B-draft-preview** Hidden `/blog?drafts=1` route. → Resolved: defer (use `deno task dev`).
- **B-rss** RSS feed. → Resolved: yes (§9 above).

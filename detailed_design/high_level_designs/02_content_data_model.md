# 02 — Content & Data Model

> The "edit layer." Every user-facing string, list, and link lives in `content/`. This doc specifies each file's **schema** and the **validation rules** that guard the build, with short illustrative examples.
>
> **Golden rule:** routes and components never hardcode content. To update the site you edit only files under `content/` (or add `static/` assets). A content edit cannot take the site down because `validate.ts` (§9) rejects malformed input before deploy.
>
> **Content authoring:** the actual written content (bio prose, project descriptions, role bullets, blog posts) is authored directly in these `content/` files by the site owner. The examples below are minimal illustrative samples showing shape only — they are not the real content. The schemas are the contract; fill the files with real content following them.

---

## 0. Where things live (recap)

| Path | Format | Edited by | Purpose |
|---|---|---|---|
| `content/site.json` | JSON | you | global meta: title, nav, social, GA id, resume link, "elsewhere" |
| `content/landing.md` | markdown + frontmatter | you | landing page (typewriter strings + prose) |
| `content/about.md` | markdown + frontmatter | you | about page (bio paragraphs + skillset) |
| `content/timeline/timeline.json` | JSON | you | roles metadata |
| `content/timeline/*.md` | markdown | you | one file per role's detail bullets |
| `content/projects/projects.json` | JSON | you | projects + tag color map |
| `content/blog/blog.json` | JSON | you | blog entries (internal post OR external link) |
| `content/blog/authors.json` | JSON | you | author profiles (avatar + name) |
| `content/blog/posts/<slug>/<slug>.md` | markdown | you | post body (pure markdown, no frontmatter) |
| `content/blog/posts/<slug>/*.{png,jpg,...}` | binary | you | co-located post images (future use, Q14) |
| `static/**` | binary | you | images, PDFs, fonts, favicon — served verbatim |

---

## 1. `content/site.json` — global metadata

Single source of truth for site-wide config. Loaded by `loadSite()`, used by `_app.tsx` (SEO, nav, footer), analytics, and the footer resume link.

### Schema
```ts
interface Site {
  title: string;                 // <title> + SEO
  description: string;           // meta description
  author: string;                // SEO author
  url: string;                   // canonical origin (for OG). TODO: replace placeholder before launch (E3)
  ga4_id: string;                // GA4 measurement id, e.g. "G-XXXXXXX" ("" disables)
  nav: NavLink[];                // top-right nav, in display order
  elsewhere: ElsewhereLink[];    // blog index "elsewhere on the web" (Q13); [] hides section
  social: Social;                // footer social links
  resume: string;                // path to resume PDF (served from static/)
}
interface NavLink   { label: string; href: string; }
interface ElsewhereLink { label: string; href: string; icon?: string; } // icon = semantic key
interface Social { email: string; linkedin: string; github: string; }
```

### Example
```json
{
  "title": "Sahil Jaganmohan",
  "description": "Portfolio and Details about Sahil Jaganmohan",
  "author": "Sahil Jaganmohan",
  "url": "https://TODO.example.com",
  "ga4_id": "G-XXXXXXXXXX",
  "nav": [
    { "label": "Home",        "href": "/" },
    { "label": "About",       "href": "/about" },
    { "label": "Experience",  "href": "/experience" },
    { "label": "Projects",    "href": "/projects" },
    { "label": "Blog",        "href": "/blog" }
  ],
  "elsewhere": [],
  "social": {
    "email":    "mailto:dev.sahil.jaganmohan@gmail.com",
    "linkedin": "https://www.linkedin.com/in/sahil-jaganmohan",
    "github":   "https://github.com/bullpointe"
  },
  "resume": "/static/resume/Sahil_Jaganmohan_Resume_2025.pdf"
}
```

**Validation:** `nav` must contain `/` and each `href` must be a valid internal path; `ga4_id` if non-empty must match `/^G-[A-Z0-9]+$/`; `resume` must end with `.pdf` and the referenced file must exist in `static/` (file-existence check in validate.ts).

---

## 2. `content/landing.md` — Landing page

The landing page mixes a **typewriter** (interactive island) with prose + inline links. Frontmatter holds the structured/interactive bits; the body is markdown prose rendered by `Markdown.tsx`. This keeps everything editable in one file.

### Schema (frontmatter)
```ts
interface LandingFrontmatter {
  eyebrow: string;            // small line above the name, e.g. "Hey! 👋🏼 i'm"
  name: string;               // the h1 (sienna italic bold)
  specialty_prefix: string;   // "i'm a computer engineer specializing in"
  specialties: string[];      // typewriter rotating strings (>=1)
}
// body: markdown — current-role sentence, intro, interest, CTA sentences (inline links)
```

### Example (shape only)
```markdown
---
eyebrow: "Hey! 👋🏼 i'm"
name: "Sahil Jaganmohan"
specialty_prefix: "i'm a computer engineer specializing in"
specialties:
  - "Embedded Systems"
  - "Edge Computing"
  - "Design Optimization"
  - "Robotic Automation"
  - "Software Engineering"
---

currently an Embedded Software Engineer at [Apple](/experience) since Jan 2023.

my curiosity of complex system architecture and critical applications has encouraged me to delve into software/hardware applications, focusing on design optimization and advanced algorithms.

i'm always interested in opportunities related to embedded systems, real-time/critical systems, algorithm design, and SW/HW optimization.

i've built some cool stuff too: [projects](/projects) and my [github](https://github.com/bullpointe).

[take a look at my resume.](/static/resume/Sahil_Jaganmohan_Resume_2025.pdf)
```
> The real content is authored by the site owner in `content/landing.md`.

### How it renders
The route composes:
```
<p class="eyebrow">{eyebrow}</p>
<h1 class="hero-name">{name}</h1>
<p>i'm a computer engineer specializing in <Typewriter strings={specialties} />.</p>
<div class="prose"> {rendered markdown body, with inline links → CTAs} </div>
```
- The typewriter is the **only** island on the landing page.
- Inline markdown links in the body are the CTAs (projects, github, resume). The analytics layer (doc `10`) auto-tags them by destination: internal nav links fire `nav_click`; `github.com` fires `outbound_click`; the resume `.pdf` fires `resume_download`. No per-link config needed — destination-based detection keeps the markdown clean.
- **`{resume}` token:** the landing markdown may use the literal token `{resume}` where the resume link should appear; `loadLanding()` substitutes it with `site.resume` (from `site.json`) before rendering. This single-sources the resume path (R1) — edit `site.json` only. Example body line: `[take a look at my resume.]({resume})`.

**Validation:** `specialties` is a non-empty array of non-empty strings; frontmatter has all four fields; body is non-empty.

---

## 3. `content/about.md` — About page

### Schema (frontmatter)
```ts
interface AboutFrontmatter {
  portrait: string;                 // image path in static/, e.g. "/static/portrait_center_2.jpg"
  portrait_alt: string;
  skillset: SkillGroup[];           // 6 cards
}
interface SkillGroup {
  label: string;                    // e.g. "Languages"
  icon?: string;                    // optional semantic key -> inline SVG in component (no icon lib)
  items: string[];                  // >=1
}
// body: markdown — the biography paragraphs
```

### Example (shape only)
```markdown
---
portrait: "/static/portrait_center_2.jpg"
portrait_alt: "Portrait of Sahil Jaganmohan"
skillset:
  - label: "Languages"
    icon: "code"
    items: ["C/C++", "Java", "Python", "Golang", "JavaScript", "Swift", "Ruby"]
  - label: "Embedded Systems"
    icon: "chip"
    items: ["I2C", "DMA", "SPI", "UART", "ESP32", "NVIDA-CUDA"]
  # ...additional groups: Hardware, Cloud & Containerization, Databases, Frameworks
---

Biography paragraph one...

Biography paragraph two...

(Additional biography paragraphs authored by the site owner.)
```
> Full bio paragraphs and all skillset groups are authored by the site owner in `content/about.md`.

### Design note
Biography paragraphs may be color-emphasized via inline `<span class="pop-green">…</span>` (markdown-it allows raw HTML; sanitizer permits `class` on `<span>` for `pop-*` classes). For now, classic colors apply; per-paragraph coloring is an opt-in escape hatch, not a default.

**Validation:** `portrait` file must exist; `skillset` non-empty, each group has non-empty `label` + `items`; body non-empty.

---

## 4. `content/timeline/timeline.json` + per-role `*.md` — Experience/Timeline

### 4.1 `timeline.json` schema
```ts
interface Timeline {
  entries: TimelineEntry[];     // ordered top→bottom = most recent→oldest
}
interface TimelineEntry {
  year: number;                 // milestone year highlighted on the rail (e.g. 2023)
  company: string;              // "Apple Inc."
  role: string;                 // "Embedded Software Engineer"
  location: string;             // "Cupertino, CA"
  dates: string;                // "Jan 2023 - Present"
  color: string;                // hex for the rail node/dot (company brand color)
  md: string;                   // filename of the role's detail markdown (in same folder)
}
```
Year is the **milestone** marker (Q7) — only years where something changed are shown (one node per role). 

### 4.2 Example `timeline.json` (shape only)
```json
{
  "entries": [
    { "year": 2023, "company": "Apple Inc.", "role": "Embedded Software Engineer", "location": "Cupertino, CA", "dates": "Jan 2023 - Present", "color": "#3b9eff", "md": "apple-seg.md" },
    { "year": 2022, "company": "Purdue University", "role": "Student", "location": "West Lafayette, IN", "dates": "MS Fall 2022 · BS Fall 2021", "color": "#C28E0E", "md": "purdue-student.md" }
    // ...additional entries, most-recent first
  ]
}
```
> A `dates` field may combine multiple milestones in one string (e.g. both degrees). The full set of roles is authored by the site owner.

### 4.3 Per-role markdown
Each `md` file is a **pure markdown body** (lists + bold highlights). No frontmatter. Loaded by `loadTimeline()` which reads the file named by `entry.md` in the same folder.

Example `content/timeline/apple-seg.md` (shape only):
```markdown
- Silicon Engineering Group (SEG)
- Directed design/development of an embedded app that **dynamically predicts latencies** of critical HW IP blocks...
- Technologies: C/C++, RTOS, ARM, Python, Rust, Distributed System Design.
```
> Each role's full bullet list is authored by the site owner in its own `.md` file.

**Why split JSON + md (per the design doc):** the bullets are detailed prose — painful to edit inside a JSON string (escaping, line breaks). Keeping them as a markdown file means you edit natural text with proper formatting; the JSON stays a tiny index. Adding a new role = add a JSON entry + one md file. (Doc `11` has the copy-paste recipe.)

**Validation:** `entries` non-empty; each `year` is an integer 1900–2100; `color` matches `/^#[0-9a-fA-F]{6}$/`; each `md` file **exists** and is non-empty; **no duplicate `md` filenames**; markdown parses.

---

## 5. `content/projects/projects.json` — Projects

### Schema
```ts
interface Projects {
  colors: Record<string, string>;   // tag-key -> hex (pill background). Dark-on-light or light-on-dark decided by luminance helper (§5.2)
  projects: Project[];              // single flat list — NO pro/personal toggle (Q8)
}
interface Project {
  title: string;
  description: string;              // short, inline (no per-project md file — Q9)
  image: string;                    // "/static/projects/<file>" or "" for no image
  alt: string;                      // alt text (required even if no image, for layout)
  tags: string[];                   // each must exist in colors map (validated)
  file: string;                     // local "more info" path in static/, e.g. "/static/project-files/x.pdf" — "" if none
  url: string;                      // external "more info" URL — "" if none
}
```
- **`file` vs `url` are separate fields** (Q9). At most one is non-empty (validated). `file` → served from `static/`, opens same tab (PDF). `url` → external, opens new tab. If both empty, the card shows no "more info" link.

### 5.1 Example (shape only)
```json
{
  "colors": {
    "c": "#f4e409",
    "python": "#f4e409",
    "react": "#61dafb",
    "research": "#3b3b8d"
  },
  "projects": [
    {
      "title": "MapReduce",
      "description": "Short description shown on the card.",
      "image": "/static/projects/mapreduce.png",
      "alt": "mapreduce",
      "tags": ["c", "openmp", "mpi"],
      "file": "/static/project-files/Map_Reduce_using_OpenMP_and_MPI.pdf",
      "url": ""
    },
    {
      "title": "Another Project",
      "description": "Another short description.",
      "image": "",
      "alt": "",
      "tags": ["python"],
      "file": "",
      "url": "https://example.com"
    }
  ]
}
```
> The full `colors` map and project list are authored by the site owner in `content/projects/projects.json`. Every tag used by a project must exist in the `colors` map (validation catches typos).

### 5.2 Tag text color (auto)
A pill's text color (dark vs white) is chosen at render by a tiny luminance helper in `Tag.tsx` (`relativeLuminance(hex) > 0.5 ? dark : light`) — so you only specify the background hex in JSON. No `text_color` field needed.

**Validation:** `colors` is an object of `tag -> /^#hex{6}$/`; `projects` non-empty; each project's `image` (if non-empty) file **exists** in `static/`; each `file` (if non-empty) file **exists**; `file` and `url` are **not both** non-empty; every tag in every project **exists in `colors`** (catches typos).

---

## 6. `content/blog/blog.json` — Blog index

Two entry kinds, distinguished by which field is present:

### Schema
```ts
interface BlogIndex {
  entries: (BlogPostEntry | BlogLinkEntry)[];   // rendered newest-first by `date`
}
interface BlogPostEntry {                       // internal post → /blog/{slug}
  kind: "post";                                 // discriminator
  title: string;
  author: string;                               // id into authors.json
  date: string;                                 // ISO date "YYYY-MM-DD"
  slug: string;                                 // manual, unique, [a-z0-9-]
  excerpt: string;                              // explicit one-liner (Q11e)
  tags: string[];                               // >=0 (required field, may be [])
  status: "draft" | "published";                // drafts excluded from index (Q11d)
  md: string;                                   // path to body, e.g. "posts/<slug>/<slug>.md"
}
interface BlogLinkEntry {                       // external → opens other site (Q13)
  kind: "link";
  title: string;
  author: string;
  date: string;
  excerpt: string;
  external_url: string;                         // https://...
}
```
- `kind` is an explicit discriminator so the schema (and the loader) can branch unambiguously. (Alternative: detect by presence of `md` vs `external_url`; `kind` is clearer and validates better.)
- For `link` entries: no `slug`, `tags`, `status`, `md` (Q11: required "unless it's a hyperlink"). The index card shows title + author badge + date + excerpt and links straight to `external_url` (new tab). No `/blog/{slug}` route is hit.
- `status: "draft"` entries are **excluded from the index** but still validate (so you can stage a post).

### Example
```json
{
  "entries": [
    {
      "kind": "link",
      "title": "My first published essay (on Medium)",
      "author": "sahil",
      "date": "2026-08-01",
      "excerpt": "A short teaser shown on the blog index; clicking opens the external article.",
      "external_url": "https://medium.com/@sahil/example"
    }
  ]
}
```
(No posts exist yet — `content/blog/posts/` starts empty. Adding the first post is documented in `11`.)

### 6.1 `content/blog/authors.json`
```ts
interface Authors { [id: string]: { name: string; image: string; }; }
```
```json
{
  "sahil": { "name": "Sahil Jaganmohan", "image": "/static/authors/sahil.jpg" }
}
```
Every `author` referenced in `blog.json` **must exist** here (validated). The `AuthorBadge` component renders `[circular image] Name` (Q11a). Add a new author by adding one key here.

### 6.2 Post body: `content/blog/posts/<slug>/<slug>.md`
**Pure markdown, no frontmatter** (all metadata lives in `blog.json` — avoids drift). Loaded by `loadBlogPost(slug)` which finds the matching `post` entry in `blog.json` and reads its `md`.

### 6.3 Co-located images (Q14 — future-proof, not used initially)
Images live in the same folder: `posts/my-first-post/my-first-post.md` + `posts/my-first-post/image01.png`. The markdown references them with a **relative path**: `![](image01.png)`. The markdown loader rewrites relative `src` to `/blog/<slug>/<filename>`, and a Fresh route serves them:

- `routes/blog/[slug].tsx` → renders the post HTML at `/blog/<slug>`
- `routes/blog/[slug]/[asset].tsx` → reads `content/blog/posts/<slug>/<asset>`, validates it's an image type (`png|jpg|jpeg|gif|webp|svg`), serves with the correct `Content-Type`. Non-image files 404. This is a ~15-line handler.

This satisfies "same folder" authoring while serving assets at clean URLs. Not used until your first post with an image; the route ships from day one so there's no later plumbing.

**Validation (blog):** `entries` array; discriminated union enforced; every `author` exists in `authors.json`; `date` matches `^\d{4}-\d{2}-\d{2}$`; `slug` matches `^[a-z0-9-]+$` and is **unique** across entries; for `post` kind the `md` file **exists** and is non-empty; `external_url` (for `link` kind) is a valid `https://` URL; published posts' `md` parses (draft posts skipped from parsing to allow WIP).

---

## 7. Markdown rendering pipeline (`lib/markdown.ts`)

One function used by every page that renders markdown:
```ts
function renderMarkdown(raw: string, opts?: { slug?: string }): { html: string; headings: Heading[] }
interface Heading { level: 2|3; text: string; id: string; }   // only H2/H3 returned; TOC uses H2 only (Q12)
```
- **Library:** `markdown-it` via `npm:markdown-it` (Deno supports npm: specifiers). Plugins: `markdown-it-anchor` (ids on H2/H3 for TOC anchors), `markdown-it` GFM built-in (tables, strikethrough, task lists).
- **Headings:** `h2`/`h3` get `id="kebab-of-text"` and `scroll-margin-top` so anchor jumps clear the sticky header.
- **Relative image rewrite:** when `opts.slug` is set (blog posts), `![](image01.png)` → `<img src="/blog/<slug>/image01.png">`. Absolute/`http(s)` URLs untouched.
- **Sanitization:** output HTML is run through a sanitizer (`npm:sanitize-html` or a small allowlist) permitting only prose tags + inline `<span class="pop-*">` for the about-page color escape hatch. **No `<script>`, no event handlers, no `<iframe>`.** Keeps the markdown authorable + safe.
- **Returns headings** so the blog route can build the TOC without a second parse.

---

## 8. Loaders (`lib/loadContent.ts`)

Each loader is a small async function reading from `content/` and returning a **typed** object (types in `lib/types.ts`). They call `validate.ts` (§9) internally OR validation runs once at build — design choice, see §9. Proposed: loaders **parse + return**; a separate `validate.ts` script does the full schema sweep for CI/build; loaders do light runtime checks (file exists) so a missing file in dev gives a clear `HttpError(404)` rather than a crash.

```ts
loadSite():           Promise<Site>
loadLanding():        Promise<{ frontmatter: LandingFrontmatter; html: string }>
loadAbout():          Promise<{ frontmatter: AboutFrontmatter; html: string }>
loadTimeline():       Promise<{ entries: (TimelineEntry & { html: string })[] }>
loadProjects():       Promise<Projects>
loadBlogIndex():      Promise<{ entries: (BlogPostEntry|BlogLinkEntry & { author: Author })[] }>
loadBlogPost(slug):   Promise<{ entry: BlogPostEntry; author: Author; html: string; headings: Heading[] } | null>
```
Paths resolved via `lib/paths.ts` (resolves `content/` relative to the repo root). Reading uses `Deno.readTextFile`. Not cached initially (see `00` §6 — optional mtime cache later).

---

## 9. Validation (`lib/validate.ts`) — the no-downtime backbone

Runs as `deno task validate` (and inside `deno task build`). **Collects all errors, not just the first** — so one bad file shows you everything wrong in one pass.

**Tool:** `npm:zod` for schemas; hand-written checks for cross-file references (file existence, author references, tag existence, unique slugs).

### What it validates (checklist)
| File | Checks |
|---|---|
| `site.json` | schema; `nav` hrefs valid; `ga4_id` format; `resume` file exists |
| `landing.md` | frontmatter schema; `specialties` non-empty; body non-empty |
| `about.md` | frontmatter schema; `portrait` exists; skillset groups valid; body non-empty |
| `timeline.json` | schema; `color` hex; each `md` exists + parses; no duplicate `md`; `year` range |
| `*.md` (timeline) | parses as markdown (no half-broken syntax) |
| `projects.json` | schema; all tags exist in `colors`; `file`/`url` mutually exclusive; referenced image + file exist |
| `blog.json` | discriminated union; `author` exists in `authors.json`; `date` ISO; `slug` unique + format; `md` exists (published); `external_url` https |
| `authors.json` | each `image` exists |

### Output format (clear, actionable)
```
✓ site.json
✓ landing.md
✗ projects.json
    • projects[0].tags: tag "opemp" not found in colors map (did you mean "openmp"?)
    • projects[3].file: file not found: static/project-files/moocs.pdf
✗ blog.json
    • entries[2].author: "sahilx" not found in authors.json

2 files invalid. Build aborted. Fix the above and re-run `deno task validate`.
```
A non-zero exit code aborts the deploy (Deno Deploy's GitHub build runs `deno task build` → `validate`); the previous good deploy stays live. This is the "no downtime from bad edits" guarantee (Q15).

### Levenshtein "did you mean" hints
For tag/author/slug typos, validate emits a closest-match suggestion (tiny helper). Makes a future-you typo obvious in 5 seconds — directly serves the "easy manual debug" goal.

---

## 10. Adding content — at a glance (full recipes in `11`)

| To add… | Do… |
|---|---|
| a blog post | `content/blog/posts/<slug>/<slug>.md` (write body) + add one `kind:"post"` entry to `blog.json` |
| an external blog link | add one `kind:"link"` entry to `blog.json` (no md file) |
| a project | add one object to `projects.projects` (+ image in `static/projects/`) |
| a timeline role | add one entry to `timeline.json` + one `<name>.md` in `content/timeline/` |
| an author | add one key to `authors.json` (+ avatar in `static/authors/`) |
| a nav link / social / GA id | edit `site.json` |

Every one of these is a **content-only** edit. No code, no rebuild config. `deno task check` confirms validity before push.

---

## 11. Open content questions (see `12_open_questions.md`)

- **C1** About-page per-paragraph color: opt-in via `<span class="pop-*">`; classic colors by default. (Resolved.)
- **C2** Skillset `icon` field: keep (small inline-SVG set in `icons.tsx`, keyed by semantic name). (Resolved: yes.)

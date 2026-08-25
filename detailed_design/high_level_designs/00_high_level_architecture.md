# 00 — High-Level Architecture

> A personal portfolio + Writing publication on Deno + Fresh. Minimal, fast, maintainable.

**Site purpose:** Present a body of work, experience, writing, and photography through an intentionally designed, easy-to-read portfolio. The visual system should make a visitor infer care for design and execution before they encounter technical depth in projects and experience, and personal curiosity through writing and visual work.

**Engagement principle:** Earn attention through progressive disclosure, clear editorial paths, and substantive content. Each page answers one visitor question and ends with one relevant next step; the site does not use novelty animation, live-status widgets, or interruptive prompts to increase time on site.

---

## 1. Tech Stack

| Concern | Decision |
|---|---|
| Runtime | **Deno** (TypeScript native) |
| Framework | **Fresh 2.x** (Preact SSR + islands) |
| Hosting | **Deno Deploy** (edge SSR) |
| CSS | **Plain CSS** — semantic classes + CSS custom properties |
| Font | **One active font** (Inter or Geist Sans), switchable via one CSS var |
| Theme | **Light + dark mode** with a toggle. Blue-slate palette with sienna accents. |
| Markdown | **markdown-it** (the only content-pipeline dependency) |
| Validation | **Hand-rolled** (no zod — schemas are simple enough to check directly) |
| VCS | **jj** exclusively |

### Dependencies (intentionally minimal)

| Package | Why | Can't remove? |
|---|---|---|
| `fresh` | the framework | yes |
| `preact` | Fresh's render engine | yes |
| `@preact/signals` | Fresh island state | yes (comes with Fresh) |
| `markdown-it` | markdown → HTML | yes (core to content pipeline) |

That's it. No zod, no sanitize-html, no markdown-it-anchor. We generate heading IDs ourselves and disable raw HTML in Markdown-it. This keeps the content boundary explicit, the dependency tree tiny, and the lockfile stable — the #1 maintenance goal.

---

## 2. Inspirations

| Site | What we pull |
|---|---|
| **imkylelambert.com** | Minimal hero (name + one-liner), compact metadata strip, projects as a simple list |
| **paco.me** | Extreme minimalism, simple project list, almost no chrome, tons of whitespace |
| **leerob.com** | Scannable Writing index, bio-forward landing, minimal footer |
| **maggieappleton.com** | Dark calm bg, muted text that breathes, subtle borders, notebook feel |
| **delba.dev** | Work section as a clean list with descriptions, text-only social links |
| **jhey.dev** | Bold hero statement, playful personality |
| **increment.com** | Editorial structure, clear hierarchy, magazine-like layout |
| **joshwcomeau.com** | Article-focused content, rich footer, personality in copy |

**Net:** an editorial portfolio with a human point of view: ink-blue dark mode, blue-white light mode, restrained sienna accents, generous whitespace, and typography-led hierarchy. The landing uses a minimal hero with one sienna-emphasized phrase, a three-row Focus/Based/Exploring strip, two short point-of-view paragraphs, and a Projects/Writing/Resume link row followed by whitespace. Projects and Writing use divided lists rather than card grids. Writing holds technical essays, personal field notes, and photo essays. The footer uses text links, and one localized nav dropdown serves every breakpoint. No decorative animation or icon boxes.

---

## 3. System Architecture

```
                      ┌──────────────────────────────────┐
   Browser ──HTTP──▶  │       Deno Deploy (edge)           │
                      │  ┌──────────────────────────────┐ │
                      │  │  Fresh app (main.ts)         │ │
                      │  │   routes/*  ── SSR ──▶ HTML  │ │
                      │  │   islands/* ── hydrate       │ │
                      │  │   static/*  ── served as-is  │ │
                      │  └──────────┬───────────────────┘ │
                      │             │ read per request     │
                      │             ▼                      │
                      │  content/  (markdown, json)         │
                      │  lib/      (loaders, markdown)     │
                      └──────────────────────────────────┘
```

**Request lifecycle:**
1. `_middleware.ts` loads `site.json` → `ctx.state.site`.
2. Route handler calls a loader (e.g. `loadAbout()`), returns `page(data)`.
3. Fresh SSRs the page + chrome to HTML. `MobileNav`, `ThemeToggle`, and `Analytics` hydrate where mounted.

### Caching

Files are read per request. For a personal site, this is sub-ms on Deno Deploy's edge. If profiling later shows it matters, a one-line mtime cache in `loadContent.ts` fixes it. Not needed initially.

---

## 4. Directory Structure

```
portfolio/
├── deno.json              # config, tasks, imports
├── main.ts                # App entry
├── client.ts              # CSS imports
├── utils.ts               # createDefine<State>()
├── vite.config.ts
│
├── static/                # served verbatim
│   ├── favicon.ico        # SJ monogram with a small sienna dot
│   ├── Bitmoji.png        # header logo
│   ├── portrait.jpg        # about portrait
│   ├── fonts/             # self-hosted fonts
│   ├── resume.pdf
│   └── projects/<slug>/   # per-project images
│
├── content/               # ★ THE EDIT LAYER
│   ├── site.json           # title, nav, social, GA ID, resume path, fixture flag
│   ├── landing.md          # landing (frontmatter: name, tagline, metadata)
│   ├── about.md            # about (frontmatter: portrait, skillset)
│   ├── timeline/
│   │   ├── timeline.json   # roles
│   │   └── *.md            # per-role bullets
│   ├── projects/
│   │   └── projects.json   # projects (flat list)
│   └── blog/
│       ├── blog.json       # Writing entries (post or external link — flat)
│       └── posts/<slug>/
│           ├── <slug>.md
│           └── *.png       # co-located images
│
├── lib/                   # server-side logic
│   ├── types.ts            # shared interfaces
│   ├── markdown.ts         # markdown → {html, headings} + heading IDs + sanitization
│   ├── loadContent.ts      # typed loaders
│   └── validate.ts         # hand-rolled validation (no zod)
│
├── components/            # server-only Preact (no JS shipped)
│   ├── Layout.tsx  Header.tsx  Footer.tsx  Seo.tsx
│   ├── SectionTitle.tsx  Markdown.tsx
│   ├── ProjectList.tsx  TimelineEntry.tsx  BlogList.tsx
│   └── Tag.tsx
│
├── islands/               # client-hydrated (minimal)
│   ├── MobileNav.tsx      # nav dropdown toggle
│   ├── Analytics.tsx      # delegated event listener + scroll depth
│   └── ThemeToggle.tsx    # light/dark mode toggle
│
├── assets/                # plain CSS
│   ├── theme.css  global.css  layout.css  components.css
│   └── landing.css  about.css  timeline.css  projects.css  blog.css
│
└── routes/
    ├── _app.tsx  _middleware.ts  _error.tsx
    ├── index.tsx  about.tsx  experience.tsx  projects.tsx
    └── blog/
        ├── index.tsx  [slug].tsx  [slug]/[asset].tsx
        └── feed.xml.ts
```

**Intentional architecture choices:**
- No `authors.json` — Writing is single-author and the index does not repeat author information. Drops a file + schema + cross-file validation check.
- No `analytics.ts` lib — analytics is just a `<script>` snippet in Seo + a tiny inline event delegator. No separate module.
- No `paths.ts` — loaders resolve paths directly. One-liner.
- No `Toc.tsx` component — TOC is rendered inline in the Writing post component from `headings`.
- No `BlogCard.tsx`, `AuthorBadge.tsx`, `ProjectCard.tsx` — the Writing index is a text-led simple list (no cards or repeated avatars); projects are a simple list. Fewer components, fewer files.

---

## 5. Route Map

| Route | File | Content source |
|---|---|---|
| `/` | `routes/index.tsx` | `content/landing.md` |
| `/about` | `routes/about.tsx` | `content/about.md` |
| `/experience` | `routes/experience.tsx` | `content/timeline/timeline.json` + `*.md` |
| `/projects` | `routes/projects.tsx` | `content/projects/projects.json` |
| `/blog` | `routes/blog/index.tsx` | Writing index: `content/blog/blog.json` |
| `/blog/{slug}` | `routes/blog/[slug].tsx` | `content/blog/posts/<slug>/<slug>.md` |
| `/blog/{slug}/{asset}` | `routes/blog/[slug]/[asset].tsx` | co-located image |
| `/blog/feed.xml` | `routes/blog/feed.xml.ts` | RSS |
| 404 + 500 | `routes/_error.tsx` | unified error page |

---

## 6. Data Flow

```
content/*.md / *.json
    │
    ▼  lib/loadContent.ts — read file, return typed object
    ▼  lib/markdown.ts    — render → sanitized HTML + headings (with IDs)
    ▼  route handler      — return page(data) → SSR HTML
```

One pipeline. No special cases. Each loader is a small async function.

---

## 7. Interactivity (three islands)

| Island | Why | ~Size |
|---|---|---|
| `MobileNav` | toggles the nav dropdown. ~20 lines. Progressive enhancement over `<details>`. | ~1KB |
| `Analytics` | delegated click listener + scroll depth for GA4 events. ~40 lines. Mounted once in `_app.tsx`. | ~1KB |
| `ThemeToggle` | cycles system/light/dark preference, resolves the active theme, and persists explicit choice. | ~1KB |

All three ship the shared Preact runtime (already amortized). Everything else is static HTML + CSS. The Writing TOC collapses via native `<details>` (no JS). Theming is pure CSS custom property swapping — the island just flips an attribute.

---

## 8. Styling

Plain CSS, no Tailwind. One active font. All CSS in `assets/`, imported once in `client.ts`. Semantic class names. Details → `01`.

---

## 9. Optional Background Layer

Optional muted SVG mosaic behind content, controlled by `--bg-mosaic-opacity`. The solid theme background remains the baseline. Details → `01`.

---

## 10. Build & Deploy

```
deno task dev       # Vite dev server (port 5173)
  deno task check      # fmt + lint + type-check + tests + validate
  deno task build      # vite build + validate
deno deploy --prod   # deploy to edge
```

Failed builds keep the last good deploy live. Details → `11`.

---

## 11. Design Principles

1. **Content is data.** Edit `content/` to update the site. No code changes for content.
2. **One pipeline.** load → render → SSR. New page = new route + new content file.
3. **Three focused islands.** Navigation, theme preference, and analytics are the only client-side behaviors. Content remains static HTML.
4. **Minimal deps.** Four packages total. No validation library, no sanitization library, no anchor plugin.
5. **Plain semantic CSS.** No utility framework.
6. **One visual system, two themes.** Components consume semantic tokens; light and dark modes change tokens, not layout or component structure.
7. **Editorial restraint.** Sienna is the interactive brand accent. Pop and company colors are small supporting details, never large surfaces or the sole carrier of meaning.
8. **Personality through content.** Photography, field notes, and human copy reveal curiosity without adding a separate lifestyle interface or decorative clutter.
9. **Accessible by construction.** Keyboard focus, contrast, semantic structure, reduced motion, target sizes, and skip navigation are component requirements.
10. **One page, one job, one next step.** Each route has a clear purpose and one relevant continuation link at its end. Avoid repeated cross-sells and competing calls to action.

---

## 12. Document Map

| Doc | Scope |
|---|---|
| `00` | This file |
| `01` | Theme: colors, fonts, spacing, CSS, pixel bg |
| `02` | Content: schemas + validation |
| `03` | Layout: header, nav, footer, chrome |
| `04`–`08` | Page implementations |
| `09` | Wireframes |
| `10` | Analytics |
| `11` | Build, deploy, maintenance |
| `12b` | Testing strategy |
| `13` | Content authoring, case studies, writing, and release checklist |

# 00 — High-Level Architecture

> Portfolio 1.0 — a personal portfolio + blog built from scratch on Deno + Fresh.
> This document is the foundation. Every other doc in this folder refines a piece of it.
>
> **Scope note:** This is a brand-new build. The written content (prose, project descriptions, role history) is supplied separately by the site owner into the `content/` files. These docs define only the **architecture, design system, and structure** — nothing here is derived from any previous implementation. An engineer (or agent) can build the site from these docs alone.

---

## 1. Decisions (locked, from design review)

| Concern | Decision | Source |
|---|---|---|
| Engine | **Deno** (TypeScript native) | design doc |
| Framework | **Fresh** (Deno's official web framework) | Q1 response |
| Rendering | **Server-Side Rendered (SSR)**, runtime on Deno Deploy | Q2/Q3 response |
| Hosting | **Deno Deploy** (GitHub integration, edge) | Q3 response |
| CSS | **Plain CSS** (no Tailwind) — CSS custom properties for theming | Q1/Q22 response |
| Fonts | Inter / Geist Sans / PP Neue Montreal — single switch point in CSS | Q5 response |
| Background | Muted pixel-art "digital mosaic" (mountains + ocean), blends in, **last priority** | Q6 response |
| Content | Markdown for prose pages; JSON for structured data; per-post folders for blog | design doc + Q14 |
| No-downtime | Strict build-time validation + Deno Deploy "keep last good deploy" | Q15 response |
| Tooling | `deno fmt` + `deno lint`, `strict: true` TS | Q16/Q17 response |

---

## 2. Why Fresh + Deno Deploy

- **Zero build-tool fatigue.** Deno runs TS natively. No `node_modules`, no Webpack, no GraphQL layer, no dependency-tree rot. Imports use URL/npm specifiers resolved and cached by Deno.
- **Transparent file-system routing.** `routes/about.tsx` → `/about`. No hidden framework magic; the folder structure *is* the mental model. A future you (or any human) can debug by reading files top-to-bottom.
- **Content on demand, not pre-built.** Markdown/JSON is read at request time by small async loaders. Adding a blog post = drop a `.md` + one line in `blog.json`. No "rebuild the whole site" step, no stale-cache surprises.
- **SSR on Deno Deploy** gives a running edge server (good for analytics events, future dynamic features) while staying a tiny codebase. Deploy via GitHub push; failed builds keep the last good version live (satisfies "no downtime").
- **Trade-off accepted:** a runtime server (vs static files) means there *is* a process that must stay up. Mitigated by Deno Deploy's managed edge (no server ops on your side) and the build-validation gate. For a site updated a couple times a year, the operational risk is near zero.

---

## 3. System Architecture

```
                         ┌──────────────────────────────────────────┐
   Browser ──HTTP──▶     │            Deno Deploy (edge)             │
                         │  ┌────────────────────────────────────┐  │
                         │  │  Fresh app (main.ts)               │  │
                         │  │   routes/*  ── SSR ──▶ HTML        │  │
                         │  │   islands/* ── hydrate (Preact)     │  │
                         │  │   static/*  ── served as-is         │  │
                         │  └──────────────┬─────────────────────┘  │
                         │                 │ read at request time    │
                         │                 ▼                        │
                         │  content/  (markdown, json, images)       │
                         │  lib/      (loaders, markdown, validate)  │
                         └──────────────────────────────────────────┘
                                           │
                           (optional) GA4 gtag ──▶ Google Analytics
```

**Request lifecycle (single page load):**

1. Browser requests `GET /about`.
2. `routes/_middleware.ts` runs first: it calls `loadSite()` (in `lib/loadContent.ts`) and stores the `Site` object on `ctx.state.site` so every route and `_app.tsx` can read it without re-fetching.
3. Deno Deploy's edge runs `routes/about.tsx`'s `handler.GET`. The handler calls `loadAbout()` (in `lib/loadContent.ts`), which reads `content/about.md`, parses frontmatter + body via the markdown lib, and returns a typed `About` object, passed to the component via `page(data)` from `fresh`.
4. Fresh renders the route component (`define.page<typeof handler>`) to HTML server-side (Preact SSR). `_app.tsx` wraps it with the chrome (Header/Nav/Footer) and `<head>`. CSS is inlined.
5. HTML streamed to browser. The `Header`/`Nav`/`Footer` (server components) are already in the HTML — instant first paint, no JS needed to see content.
6. Only declared **islands** (e.g. `MobileNav`, `Typewriter` <!-- COMMENT: Why do we have this here? Why do we need the typewriter? Remember that we are looking to re-design the website. And that only things that I have explicitly mentioned should transfer over the other aspects can be left behind in the previous project. -->) ship a small Preact JS bundle and hydrate. Everything else is static HTML. → lightweight, fast.

**Key Fresh 2.x concepts in play here:**

- `main.ts` — the app entry. Creates `new App<State>()`, registers `staticFiles()` middleware, registers `app.notFound()` / `app.onError()` for error handling (Fresh 2.x handles 404/500 in `main.ts`, rendering `routes/_error.tsx`), then `app.fsRoutes()` to load all files in `routes/` as routes. No `start()`/`listen()` call; Vite handles dev, `deno serve` handles prod. Sketch:
  ```ts
  // main.ts
  import { App, staticFiles } from "fresh";
  import { type State } from "./utils.ts";
  export const app = new App<State>();
  app.use(staticFiles());
  app.notFound((ctx) => ctx.render(<ErrorPage code={404} />));   // renders routes/_error.tsx
  app.onError("*", (ctx) => ctx.render(<ErrorPage code={500} error={ctx.error} />));
  app.fsRoutes();   // loads routes/ + islands/ via file conventions
  ```
  (The scaffold's `main.ts` already has this shape — we add the notFound/onError registrations and a `_middleware.ts` for `loadSite()`. Remove the scaffold's demo `exampleLoggerMiddleware` + `/api2/:name` route.)
- `routes/` — one file per URL. Each exports a `handler` (`define.handlers({ async GET(ctx) {...} })` returning `page(data)`) + a default page component (`define.page<typeof handler>(({ data }) => ...)`). Simple pages can use `define.page(async (ctx) => ...)` with inline data fetching and no separate handler.
- `routes/_middleware.ts` — runs before every route; the place to load shared data (`ctx.state.site`) and run cross-cutting logic (e.g. request logging).
- `routes/_app.tsx` — wraps every route in `<html><head>...<body>`. Reads `ctx.state` for SEO metadata and renders the shared chrome (Header/Nav/Footer) around `<ctx.Component />`.
- `islands/` — *only* components that need interactivity. Each island = a separate client bundle. Keep these minimal (our site has 2: mobile nav, typewriter).
- `components/` — server-only Preact components. Never shipped to the browser. This is where ~95% of the UI lives.
- `lib/` — server-side pure logic (file reading, markdown parsing, validation, analytics helpers, shared types). Importable by routes/handlers via the `@/` alias (= repo root).
- `assets/` — plain CSS files. Imported globally in `client.ts` (Vite bundles + inlines them). `assets/theme.css` is the design-token source of truth.
- `static/` — files served verbatim at `/` (images, PDFs, favicon, self-hosted fonts).
- `content/` — the editable content layer (markdown, JSON). Read at request time; never built. <!-- COMMENT: Does this waste alot of cpu usage since this content rarely updates? Do we have a way to easily cache these parses. Is that something deno deploy helps with since we want to optimize for speed-->

---

## 4. Directory Structure (the scaffolded repo)

The Fresh project is scaffolded at `Portfolio_1.0/portfolio/`. Fresh 2.x uses a **flat** layout (no `src/` folder) — components, islands, and lib sit at the root alongside `routes/` and `static/`.

```
Portfolio_1.0/portfolio/                # ← the project repo (Fresh 2.x + Vite)
├── deno.json                  # Deno config: tasks, lint, import map, compilerOptions, jsx:precompile
├── deno.lock                  # pinned dependency lockfile
├── main.ts                    # Fresh app entry: new App<State>(), staticFiles(), app.notFound()/onError(), app.fsRoutes()
├── client.ts                  # client entry: imports global CSS (assets/*.css) for HMR/bundling
├── utils.ts                   # createDefine<State>() + State interface (shared by all routes)
├── vite.config.ts             # Vite config: fresh() plugin
├── README.md                  # Fresh starter readme (update with maintenance pointer)
├── .gitignore
│
├── static/                    # served verbatim at "/" (NOT built)
│   ├── favicon.ico
│   ├── logo.svg               # (starter asset — remove)
│   ├── bitmoji.webp           # header logo (added)
│   ├── portrait_center_2.jpg  # about portrait (added)
│   ├── fonts/                 # self-hosted font files (Inter, Geist; PP Neue Montreal commented out)
│   ├── authors/
│   │   └── sahil.jpg          # author avatar
│   ├── resume/
│   │   └── Sahil_Jaganmohan_Resume_2025.pdf
│   ├── project-files/         # project "more info" PDFs
│   └── projects/              # project card images 
│
├── content/                   # ★ THE EDIT LAYER — what you touch to update the site (added)
│   ├── site.json              # global metadata: title, desc, author, url, GA id, nav, elsewhere, social, resume
│   ├── landing.md             # landing page (frontmatter: typewriter strings, name; body: prose + {resume} token)
│   ├── about.md               # about page (frontmatter: portrait, skillset; body: bio paragraphs)
│   ├── timeline/
│   │   ├── timeline.json      # roles metadata (year, company, role, dates, location, color, md)
│   │   └── *.md               # one markdown file per role's detail bullets
│   ├── projects/
│   │   └── projects.json      # projects array + tag color map (hex)
│   └── blog/
│       ├── blog.json          # entries (internal post OR external link)
│       ├── authors.json       # id -> {name, image}
│       └── posts/
│           └── <slug>/
│               ├── <slug>.md  # post body (pure markdown, no frontmatter)
│               └── *.png      # co-located images for that post
│
├── lib/                       # server-side logic (added; imported via "@/lib/...")
│   ├── types.ts               # shared TS interfaces (Site, Project, TimelineEntry, BlogPost, ...)
│   ├── markdown.ts            # parse markdown + frontmatter -> {html, headings}
│   ├── loadContent.ts         # read content/* files, return typed objects (loadSite/loadLanding/...)
│   ├── validate.ts            # zod schema validation for all JSON/frontmatter (deno task validate)
│   ├── analytics.ts           # gtag event helpers + snippet generation
│   └── paths.ts               # resolve content/static path helpers
│
├── components/                # server-only Preact components (no JS shipped) — fresh starter has Button.tsx (replace)
│   ├── Layout.tsx             # the page chrome wrapper (used by _app.tsx)
│   ├── Header.tsx             # logo + Nav
│   ├── Nav.tsx                # top-right inline nav (desktop)
│   ├── Footer.tsx             # social icon row + copyright
│   ├── Seo.tsx                # <head> meta tags from ctx.state.site
│   ├── Markdown.tsx            # renders sanitized parsed-markdown HTML
│   ├── Toc.tsx                # builds TOC from H2 headings
│   ├── SectionTitle.tsx       # shared "H1 + sienna subtitle" pattern
│   ├── ProjectCard.tsx
│   ├── TimelineEntry.tsx
│   ├── BlogCard.tsx
│   ├── AuthorBadge.tsx        # [img] Name
│   ├── Tag.tsx                # colored tag pill (inline style from hex + luminance fg)
│   └── icons.tsx              # small inline SVG set (mail, linkedin, github, home, document, external, skillset icons)
│
├── islands/                   # client-hydrated (minimal!) — fresh starter has Counter.tsx (remove)
│   ├── Typewriter.tsx         # landing rotating-strings effect
│   └── MobileNav.tsx          # hamburger toggle for nav on small screens (enhances a <details>)
│
├── assets/                    # plain CSS — imported in client.ts (Vite bundles + inlines)
│   ├── theme.css              # ★ single switch point: color/font/spacing custom properties
│   ├── global.css             # reset + base element styles
│   ├── layout.css             # header/nav/footer chrome
│   ├── landing.css
│   ├── about.css
│   ├── timeline.css
│   ├── projects.css
│   ├── blog.css
│   └── components.css          # shared: cards, tags, buttons, badges, prose
│
└── routes/                    # Fresh file-based routing = the URL map
    ├── _app.tsx               # global wrapper: <html><head> (Seo) + Layout (Header/Nav/Footer) + <ctx.Component/>
    ├── _middleware.ts         # loads site.json into ctx.state.site; request logging
    ├── _error.tsx              # unified error page (404 + 500), themed; triggered by `throw new HttpError(404)` or unmatched routes
    ├── index.tsx              # /
    ├── about.tsx              # /about
    ├── experience.tsx         # /experience (the Timeline page)
    ├── projects.tsx           # /projects
    └── blog/
        ├── index.tsx          # /blog
        ├── [slug].tsx          # /blog/{slug}
        ├── [slug]/[asset].tsx # /blog/{slug}/{image} — serves co-located post images
        └── feed.xml.ts        # /blog/feed.xml — RSS 2.0 (B6)
```

<!-- COMMENT: We probably want to better organize the project-files and project folders maybe we can nest them but seems a bit un-organized -->       

<!-- COMMENT: What does the mobile nav look like? Keep in mind that we want new designs that are not like the old website. So what are our other options-->

<!-- COMMENT: Why is it [slug].tsx? Do we need a different tsx file for each blog page everytime we add a new post? -->

> **Scaffold cleanup:** the fresh starter ships `components/Button.tsx`, `islands/Counter.tsx`, `routes/api/[name].tsx`, `static/logo.svg`, and the `fresh-gradient`/counter styles in `assets/styles.css`. These are demo files — **delete them** before building. Replace `assets/styles.css` with the `assets/*.css` set above and import those in `client.ts`.

**Why two content folders (`content/` and `static/`)?**
- `static/` = binary assets served byte-for-byte (images, PDFs, fonts). Never parsed.
- `content/` = text-based editable content (markdown, JSON). Parsed + validated at request time. This is **the only place you edit to update the site** — fulfilling the maintenance goal: "adding new markdown files and linking them where appropriate."

---

## 5. URL / Route Map

| Route | File | Content source | Notes |
|---|---|---|---|
| `/` | `routes/index.tsx` | `content/landing.md` | typewriter island + CTAs |
| `/about` | `routes/about.tsx` | `content/about.md` | portrait + skillset |
| `/experience` | `routes/experience.tsx` | `content/timeline/timeline.json` + `*.md` | left-aligned timeline; route name kept as `/experience` (Q23) |
| `/projects` | `routes/projects.tsx` | `content/projects/projects.json` | responsive card grid, no toggle |
| `/blog` | `routes/blog/index.tsx` | `content/blog/blog.json` + `authors.json` | cards; external entries link out |
| `/blog/{slug}` | `routes/blog/[slug].tsx` | `content/blog/posts/<slug>/<slug>.md` | full post + top TOC; `throw new HttpError(404)` if missing/draft |
| `/blog/{slug}/{asset}` | `routes/blog/[slug]/[asset].tsx` | co-located image | serves post images (image types only) |
| `/blog/feed.xml` | `routes/blog/feed.xml.ts` | `blog.json` | RSS 2.0 (B6) |
| `/404` (+ `/500`) | `routes/_error.tsx` | (unified themed error page) | triggered by `throw new HttpError(404)` or unmatched routes; Fresh 2.x merges 404/500 into one `_error.tsx` |

---

## 6. Data Flow (how content becomes a page)

Every page follows the same 4-step pipeline. This uniformity is intentional — it keeps the mental model tiny and the maintenance trivial.

```
content/*.md / *.json
      │
      ▼  (1) lib/loadContent.ts — read file (Deno.readTextFile)
      │
      ▼  (2) lib/validate.ts    — parse JSON, check schema (zod); parse md frontmatter
      │
      ▼  (3) lib/markdown.ts    — render body markdown -> HTML (markdown-it + plugins), sanitized
      │
      ▼  (4) route handler      — return page({...typed data})  ->  define.page<typeof handler> renders  ->  Preact SSR -> HTML
```

- **(1)** is plain file I/O. `lib/loadContent.ts` exposes typed functions: `loadSite()`, `loadLanding()`, `loadAbout()`, `loadTimeline()`, `loadProjects()`, `loadBlogIndex()`, `loadBlogPost(slug)`. Each reads from `content/` and returns a typed object. `loadSite()` is called once in `routes/_middleware.ts` and cached on `ctx.state.site` for the request.
- **(2)** validation runs **always** (in dev and in the deploy build via `deno task validate`). A bad JSON file or missing required frontmatter throws a clear error *before* any HTML is produced → no broken page ever ships. This is the backbone of the "no downtime" guarantee (see doc `11`).
- **(3)** markdown is parsed with `markdown-it` (via `npm:markdown-it`) with plugins for GitHub-flavored markdown (tables, strikethrough) and anchor IDs on headings (for the TOC). Output HTML is sanitized (no raw `<script>`) before rendering. `lib/markdown.ts` returns `{ html, headings }` so the blog route can build the TOC without a second parse.
- **(4)** the route file's `handler.GET` awaits the loader and returns `page(data)` (imported from `fresh`). The page component (`define.page<typeof handler>(({ data }) => ...)`) is pure presentational — no file I/O, no parsing. Easy to read and edit. The type generic links the handler's return type to the component's `data` prop for autocompletion.

**Caching:** Deno Deploy is stateless across requests but files are read fast. For a personal site this is a non-issue. If desired later, a simple in-memory `Map` cache keyed by file mtime can be added in `lib/loadContent.ts` — one function, no architecture change. Not needed initially.

---

## 7. Interactivity Model (islands, kept minimal)

The site is ~95% static HTML. Only these need client JS:

| Island | Where | Why interactive |
|---|---|---|
| `Typewriter` | Landing `/` | rotating specialty strings (loop). Tiny: a 30-line Preact component + a `requestAnimationFrame` or `setInterval` loop. No library. |
| `MobileNav` | (every page, in Header) | toggles the nav menu open/closed below the header on small screens. ~20 lines. |

<!-- COMMENT: I dont want a typewriter, what are other options that we could add? -->

That's it. Everything else — project cards, timeline, blog TOC — is server-rendered HTML + CSS. The blog TOC collapse on mobile uses the native `<details>` element (no JS needed). This radical minimization is what makes the site lightweight and the codebase debuggable by hand.

> **Why so few islands:** every client JS bundle is a maintenance and perf liability. This site has exactly two interactive elements (a rotating-string typewriter and a mobile menu toggle). Everything else — project cards, timeline, blog TOC — is server-rendered HTML + CSS. The blog TOC collapse on mobile uses the native `<details>` element (no JS). This radical minimization is what makes the site lightweight and the codebase debuggable by hand.

---

## 8. Styling Approach (plain CSS, no Tailwind)

Per Q1/Q22: **no Tailwind.** We use plain CSS with a single source of truth for design tokens.

- `assets/theme.css` — defines all design tokens as **CSS custom properties** on `:root`:
  - Colors: `--color-bg: #11305c; --color-text: #ffffff; --color-accent: ...; --color-subtle: ...` etc.
  - Fonts: `--font-body` and `--font-heading` (the **single switch point** for Q5 — change these two lines to swap Inter↔Geist↔PP Neue Montreal everywhere).
  - Spacing scale, radii, max-width, breakpoints.
- `assets/global.css` — reset + base element styles (body bg/text from vars, headings, links, code).
- One CSS file per page/section (`assets/landing.css`, `assets/about.css`, …) plus shared `assets/components.css` and `assets/layout.css`.
- **All CSS is imported once in `client.ts`** (`import "./assets/theme.css"; import "./assets/global.css"; …`). Vite bundles and inlines them. This is the Fresh 2.x pattern (the scaffold already imports `./assets/styles.css` in `client.ts`) — one place to see the whole stylesheet load order, no per-route CSS imports to forget. *(If a page's CSS grows large later, you can move its import into the route file instead; Vite handles both.)*
- **No utility-class soup.** Class names are semantic (`.project-card`, `.timeline-rail`, `.tag`). This is more lines of CSS but *dramatically* more readable for a human editing later — which is an explicit goal.

Tag colors for projects: the JSON stores **hex colors** keyed by tag (not Tailwind classes). `components/Tag.tsx` applies them via inline `style={{ backgroundColor: tagColor }}`. One place to edit colors = `content/projects/projects.json`. See doc `02`.

Full theme details → `01_theme_and_design_system.md`.

---

## 9. Font Strategy (Q5)

Goal: easy switch between **Inter**, **Geist Sans**, **PP Neue Montreal** from one location.

- Self-host font files in `static/fonts/` (Inter & Geist are open-source / OFL). **PP Neue Montreal is a commercial font — requires a license.** Per resolution E1, you don't own a license, so its `@font-face` block stays **commented out** in `assets/theme.css`. Inter / Geist remain the active options; the switch point still works (reorder `--font-body`). If a license is acquired later, drop the files in `static/fonts/` and uncomment the block.
- `assets/theme.css` defines:
  ```css
  :root {
    --font-body:    "Inter", "Geist Sans", "PP Neue Montreal", system-ui, sans-serif;
    --font-heading: "Inter", "Geist Sans", "PP Neue Montreal", system-ui, sans-serif;
    --font-mono:    "IBM Plex Mono", ui-monospace, monospace;
  }
  ```
  To switch the *primary* font: reorder the list (first found wins) or just set `--font-body: "Geist Sans", ...`. One line, whole site changes. `@font-face` declarations for Inter, Geist, and IBM Plex Mono are active; PP Neue Montreal's is commented out.
- `body { font-family: var(--font-body); }`, headings use `var(--font-heading)`, code/labels use `var(--font-mono)`.

Details → `01_theme_and_design_system.md`.

---

## 10. The "Pixelated Background" (Q6) — last priority

A muted "digital mosaic" of **mountains + ocean**, pixel-art style, sitting behind all content, low contrast so it doesn't fight the text. Implementation plan (built last):

- A fixed-position, full-viewport `<div class="bg-mosaic">` rendered once in `_app.tsx`, `z-index: -1`, `pointer-events: none`.
- Most likely an **SVG** (small, crisp at any scale, no asset binary to maintain) drawn as a grid of colored `<rect>` pixels — a stylized mountain range over an ocean. Muted blues/teals that harmonize with `#11305c`.
- Alternatively a tiny generated PNG tile. SVG preferred (text-editable, git-diffable).
- Opacity tuned low (~15-25%) so content reads cleanly.
- Must not affect CLS or LCP (it's decorative; behind content; no layout impact).

Full spec → `01_theme_and_design_system.md` §6. Built only after everything else works.

---

## 11. Build, Deploy, and the "No Downtime" Guarantee

**Local dev:** `deno task dev` → runs `vite` (Fresh 2.x dev server, port **5173**) with HMR. Reads `content/` live; markdown/JSON edits appear on refresh (Vite watches the repo).

**Deploy flow (via `deno deploy` CLI — the modern command, not `deployctl`):**
1. One-time app creation (see `11` §5.2): `deno deploy create --org <org> --app <app> --source local --build-timeout 5 --build-memory-limit 1024 --region us` (Fresh is auto-detected; build command `deno task build` is inferred). This writes `deploy.org` + `deploy.app` into `deno.json`.
2. Subsequent deploys: run `deno task build` then `deno deploy --prod` from the `portfolio/` directory. (Or wire it to CI/GitHub — Deno Deploy's GitHub integration runs the same build on push.)
3. **If build fails** (TS error, malformed JSON, missing required field): deploy is aborted; the *previous good deploy keeps serving*. Users see no change. You get a failed-check notification.
4. **If build passes**: new version is deployed atomically to all edge regions; the server starts via the entrypoint (`main.ts` → `_fresh/server.js`).

This is the primary lever for "no downtime from bad content/edits" (Q15). The validation layer (`lib/validate.ts`) is therefore the most important defensive code in the project — it must be strict and clear. Spec'd in `02_content_data_model.md` and `11_build_deploy_maintenance.md`.

**Tasks (added to the scaffold's `deno.json`):**
```jsonc
{
  "tasks": {
    "dev":      "vite",
    "build":    "vite build && deno task validate",
    "preview":  "deno serve -A _fresh/server.js",
    "validate": "deno run -A lib/validate.ts",
    "check":    "deno fmt --check . && deno lint . && deno check && deno task validate",
    "update":   "deno run -A -r jsr:@fresh/update ."
  },
  "deploy": {
    "org": "<ORG_NAME>",
    "app": "<APP_NAME>",
    "entrypoint": "main.ts"
  }
}
```
(The scaffold ships `dev`/`build`/`start`/`check`/`update`; we rename `start` → `preview` to match Fresh 2.x convention, add `validate` folded into `build` + `check`, and add the `deploy` block. `deno task check` is the one command to run before pushing — it catches formatting, lint, type, and content errors locally.)

Full ops + maintenance playbook (incl. copy-paste recipes for adding a blog post / project / timeline entry) → `11_build_deploy_maintenance.md`.

---

## 12. Analytics (Q4)

Goal: capture geolocation + clicks + pageviews **and** add detailed cross-page journey tracking.

**Chosen:** **GA4** via direct `gtag.js` (drop GTM — overkill for this site). Rationale:
- GA4 already captures `page_view` per page → **Path Exploration** report reconstructs the full user journey (landing → about → projects → blog...). This closes the gap you described ("lacked the ability to see how the user progressed").
- Geolocation, demographics, device, tech, engagement-rate, scroll-depth — all built-in.
- We add **explicit custom events** on the high-value interactions so journeys are unambiguous:
  - `nav_click` (which nav item, from which page)
  - `cta_click` (resume / projects / github on landing)
  - `outbound_click` (external project/blog links)
  - `resume_download`
  - `blog_open` (internal post vs external redirect)

Rendered server-side into `<head>` by the `Seo` component (called from `_app.tsx`); event helpers in `lib/analytics.ts`. GA4 measurement id stored in `content/site.json` (not hardcoded) so it's one place to edit.

Alternative noted for your review: **PostHog** (open-source; adds heatmaps + session replay + funnels, "even more detail"). Heavier. GA4 chosen as default; switching is isolated to `analytics.ts` + one snippet in `_app.tsx`. → Full spec in `10_analytics.md`.

---

## 13. Cross-Cutting Design Principles (the "why it'll stay maintainable")

These principles are referenced by every page doc that follows. Stating them once here:

1. **Content is data, not code.** Every editable string lives in `content/`. Routes and components never hardcode user-facing text. → Edit the site without touching code; a typo fix can't break the build (validation catches malformed structure, not prose).
2. **One pipeline, all pages.** load → validate → render. No special cases. A new page = new route file + new content file + (optional) new CSS file. Copy a sibling as a template.
3. **Islands are a last resort.** Default to server-rendered HTML + CSS. Reach for an island only when an element *must* react to the user (typewriter, mobile menu). Keeps the client bundle tiny and the code readable.
4. **Strict validation at the edges.** `validate.ts` is the only thing standing between a bad edit and a broken deploy. Schemas are explicit (zod) and documented in `02`. A clear error message beats a clever recovery.
5. **Plain, semantic CSS.** No utility framework. Class names describe *what it is* (`.timeline-entry`), not *how it looks* (`.flex-grow mx-auto`). More lines, far easier to read years later.
6. **Single source of truth per concern.** Colors/fonts → `theme.css`. Tag colors → `projects.json`. Nav links + GA id + author list → `site.json`/`authors.json`. Never duplicate a value in two files.
7. **Carry over only what's used.** The repo should contain only assets and content that are actually referenced. No starter leftovers, no duplicate variants. → small repo, fast clones, fewer "what is this file?" moments.

---

## 14. Document Map (how these design docs fit together)

| Doc | Scope |
|---|---|
| `00_high_level_architecture.md` | **this file** — system overview |
| `01_theme_and_design_system.md` | colors, fonts, spacing, CSS architecture, pixel bg |
| `02_content_data_model.md` | every content file's schema + the validation rules |
| `03_layout_and_navigation.md` | header, top-right nav, footer, page chrome, responsive |
| `04_page_landing.md` | `/` implementation |
| `05_page_about.md` | `/about` implementation |
| `06_page_timeline.md` | `/experience` implementation (left-aligned timeline) |
| `07_page_projects.md` | `/projects` implementation (card grid) |
| `08_page_blog.md` | `/blog` + `/blog/{slug}` implementation |
| `09_wireframes.md` | ASCII wireframes + layout diagrams, all pages × breakpoints |
| `10_analytics.md` | GA4 + custom events + journey tracking |
| `11_build_deploy_maintenance.md` | dev/build/deploy/CI + the maintenance playbook |
| `12_open_questions.md` | living log of open/resolved questions |

Read `00` → `01`/`02`/`03` (the shared layers) → then the page docs `04`-`08` → `09` (visual reference) → `10`/`11` (ops).

---

## 15. Open Items Deferred to Other Docs

- Exact color palette + accent + the mosaic art direction → `01`.
- Exact JSON/MD schemas (field names, required vs optional, examples) → `02`.
- Nav link labels + order + mobile behavior → `03`.
- Per-page component breakdown + handler pseudocode → `04`–`08`.
- CI config (GitHub Actions, if needed beyond Deno Deploy's built-in) → `11`.
- PostHog vs GA4 final call + event taxonomy → `10`.

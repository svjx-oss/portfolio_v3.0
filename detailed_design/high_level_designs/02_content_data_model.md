# 02 — Content & Data Model

> Every user-facing string lives in `content/`. Schemas are intentionally simple — hand-rolled validation, no zod. The goal: a human can edit any content file without touching code or understanding a framework.

---

## File map

| Path | Purpose |
|---|---|
| `content/site.json` | global metadata |
| `content/landing.md` | landing page (frontmatter + concise prose) |
| `content/about.md` | about page (frontmatter + prose) |
| `content/timeline/timeline.json` | roles metadata |
| `content/timeline/*.md` | one file per role |
| `content/projects/projects.json` | projects (flat list) |
| `content/blog/blog.json` | Writing entries (post or external link) |
| `content/blog/posts/<slug>/<slug>.md` | technical essay, field note, or photo essay body |
| `content/blog/posts/<slug>/*.{png,jpg,webp}` | co-located post images |
| `content/blog/fixtures/` | development-only Writing fixtures |

No `authors.json` — Writing is single-author and the index does not repeat author information.

---

## `site.json`

```json
{
  "title": "Sahil Jaganmohan",
  "description": "Portfolio and details about Sahil Jaganmohan",
  "url": "https://TODO.example.com",
  "ga4_id": "",
  "nav": [
    { "label": "Home", "href": "/" },
    { "label": "About", "href": "/about" },
    { "label": "Experience", "href": "/experience" },
    { "label": "Projects", "href": "/projects" },
    { "label": "Writing", "href": "/blog" }
  ],
  "social": {
    "email": "mailto:dev.sahil.jaganmohan@gmail.com",
    "linkedin": "https://www.linkedin.com/in/sahil-jaganmohan",
    "github": "https://github.com/bullpointe"
  },
  "resume": "/resume.pdf",
  "elsewhere": [],
  "show_writing_fixtures": false
}
```

Set `url` to the production site origin. An empty `ga4_id` disables analytics. An empty `elsewhere` array hides that section.

---

## `landing.md`

Frontmatter: hero text, optional sienna-emphasized phrase, and metadata strip. Body: two short paragraphs and a path link row.

```markdown
---
name: "Sahil Jaganmohan"
tagline: "I build thoughtful software and systems with clear, reliable execution."
tagline_emphasis: "thoughtful software and systems"
metadata:
  - { label: "Focus", value: "Clear systems and experiences" }
  - { label: "Based", value: "Cupertino, CA" }
  - { label: "Exploring", value: "Design, photography, and the outdoors" }
---

I like work where the difficult parts are mostly invisible: clear interfaces,
reliable systems, and details that hold up when people rely on them.

I care about the full path from a rough idea to something finished, useful,
and easy to understand.

[Projects](/projects) · [Writing](/blog) · [Resume](/resume.pdf)
```

`tagline_emphasis` must occur exactly once within `tagline`; the component renders that phrase in sienna. Metadata is a compact orientation strip with three short factual or curiosity-led values: what the work focuses on, where the person is based, and what they are exploring. The link row gives visitors clear paths into Projects, Writing, and the resume; no featured-content block appears on the landing page.

---

## `about.md`

```markdown
---
portrait: "/portrait.jpg"
portrait_alt: "Portrait of Sahil Jaganmohan"
intro: "I enjoy turning complex ideas into clear, dependable work."
outside_of_work: "Outside of work, I am usually behind a camera, on a trail, or following a new curiosity."
skillset:
  -
    label: "Systems & software"
    description: "Building reliable tools and systems that make complexity manageable."
    items: ["C/C++", "Python", "Go", "JavaScript"]
  -
    label: "Hardware & embedded"
    description: "Working across software and physical constraints."
    items: ["I2C", "DMA", "SPI", "UART", "RTL", "FPGA"]
  -
    label: "Product & platform"
    description: "Turning working systems into dependable products."
    items: ["Cloud", "CI/CD", "Databases", "Docker"]
---

The longer biography begins here. It describes background, formative experiences,

Continue with additional biography paragraphs as needed.
```

`intro` is a short editorial introduction shown alongside the portrait. The Markdown body is the longer full-width biography. `outside_of_work` is optional, one short personal paragraph placed after the biography. `skillset` is an ordered list of three or four numbered disciplines. Each group has a `label`, a one-sentence `description`, and compact `items`. The display number comes from order (`01`–`04`) and receives its fixed decorative color in CSS; content fields do not contain colors or icons.

---

## `timeline.json` + per-role `*.md`

```json
{
  "entries": [
    {
      "year": 2023,
      "company": "Apple Inc.",
      "role": "Embedded Software Engineer",
      "location": "Cupertino, CA",
      "dates": "Jan 2023 - Present",
      "summary": "Building dependable systems where performance, clarity, and execution matter.",
      "current": true,
      "color": "#3b9eff",
      "md": "apple-seg.md"
    }
  ]
}
```

Each `*.md` is pure Markdown with two to four bullet points. No frontmatter.

---

## `projects.json`

```json
{
  "projects": [
    {
      "title": "MapReduce",
      "description": "Developed a full MapReduce implementation for multi-core machines...",
      "challenge": "Making parallel work predictable across different workloads.",
      "tags": ["C", "OpenMP", "MPI"],
      "link": "",
      "link_label": ""
    },
    {
      "title": "Mood Music",
      "description": "A web interface that suggests music based on heart rate...",
      "challenge": "Turning noisy input signals into a simple, useful recommendation experience.",
      "tags": ["JavaScript", "Fitbit", "Spotify"],
      "link": "https://devpost.com/software/mood-music-0g7f6u",
      "link_label": "Project site"
    }
  ]
}
```

Project conventions:
- **One `link` field** — a root-relative path stays in the site; an HTTP(S) URL opens externally; an empty value renders no link. `link_label` describes the destination (`Repository`, `Demo`, `Project site`, or `Read case study`) rather than using a generic label.
- **Optional `challenge` field** — one concise sentence describing the constraint, question, or difficult part of a strong project. Omit it when it would repeat the description.
- **No project images** — projects are concise divided-list entries.
- **Fixed tag classes** — tag colors come from a small CSS tag-to-class mapping in `components.css`, not JSON-driven inline styles. Add a CSS class and mapping entry for a new tag color.

---

## `blog.json`

```json
{
  "entries": [
    {
      "title": "Designing a low-latency dashboard",
      "date": "2026-08-20",
      "updated_at": "2026-08-24",
      "reading_time": "6 min read",
      "type": "essay",
      "slug": "designing-a-dashboard",
      "excerpt": "A short teaser.",
      "tags": ["engineering", "performance"],
      "status": "published",
      "md": "posts/designing-a-dashboard/designing-a-dashboard.md"
    },
    {
      "title": "My essay on Medium",
      "date": "2026-09-01",
      "type": "external",
      "excerpt": "Teaser shown on the index.",
      "external_url": "https://medium.com/@sahil/example"
    }
  ]
}
```

Simplified:
- `type` is one of `essay`, `field-note`, `photo-essay`, or `external`. It provides a small human-readable category label on the Writing index and does not change routing.
- If `external_url` is present, the entry is an external link (opens new tab). If `md` is present, it is an internal post. If `status: "draft"`, exclude it from the index and return 404 for its slug.
- **No `author` field** — Writing is single-author and the index does not display author information.
- **Required for posts:** title, date, type, slug, excerpt, tags, status, md. **Required for links:** title, date, type, excerpt, external_url. `updated_at` and `reading_time` are optional; include them only when they are accurate.

Post body is pure markdown (no frontmatter). Co-located images in same folder.

---

## Markdown pipeline (`lib/markdown.ts`)

`renderMarkdown(raw, opts?)` → `{ html, headings }`:
- `markdown-it` for parsing.
- **Heading IDs** generated by a 10-line slugify function (no `markdown-it-anchor` dependency).
- Raw HTML is disabled in `markdown-it`. Content uses Markdown only; no HTML allowlist or color spans are accepted. This avoids a custom sanitizer and keeps styling in components rather than authored content.
- Writing post relative images rewritten to `/blog/<slug>/<file>`.
- `headings` includes authored H1/H2 headings. Writing bodies are H2-led; `PostView` prepends the separately rendered post-title H1 to the TOC.

---

## Loaders (`lib/loadContent.ts`)

Typed functions: `loadSite()`, `loadLanding()`, `loadAbout()`, `loadTimeline()`, `loadProjects()`, `loadBlogIndex()`, `loadBlogPost(slug)`. Each reads from `content/`, calls `renderMarkdown` where needed, returns typed objects.

---

## Validation (`lib/validate.ts`)

Hand-rolled (no zod). Collects all errors, prints clear report, exits non-zero. Checks:

- `site.json` — required fields present, `url` is an HTTP(S) origin, `resume` file exists, `ga4_id` is empty or matches a GA4 measurement ID, and `show_writing_fixtures` is boolean.
- `landing.md` — frontmatter has name/tagline and exactly three metadata rows (`Focus`, `Based`, `Exploring`), body has exactly two non-empty paragraphs plus a Projects/Writing/Resume link row; optional `tagline_emphasis` occurs exactly once in `tagline`.
- `about.md` — `portrait` file exists; `intro` is non-empty; optional `outside_of_work` is non-empty when present; skillset has three or four groups, each with non-empty label, description, and items.
- `timeline.json` — `color` is hex, each `md` exists, `summary` is non-empty, and `current` is boolean. Color remains decorative; text never inherits it.
- `projects.json` — projects non-empty, tags are strings, `link` is empty or a valid root-relative/HTTP(S) URL; `link_label` is required and non-empty when `link` is non-empty, and empty when `link` is empty.
- `blog.json` — `slug` unique + valid format, `type` is allowed, `md` exists for posts, `external_url` valid for links, `date` is ISO.

### Development Writing Fixtures

`site.json` includes a boolean `show_writing_fixtures`, defaulting to `false`:

```json
"show_writing_fixtures": false
```

When `show_writing_fixtures` is `true` and the runtime environment is not production, `loadBlogIndex()` merges valid fixture entries from `content/blog/fixtures/` with real entries. Define production with `Deno.env.get("DENO_DEPLOYMENT_ID")` or `Deno.env.get("APP_ENV") === "production"`; this check is centralized in one `isProduction()` helper. Fixtures include Lorem Ipsum prose, headings, code blocks, captions, and sample images for visual testing.

Production validation requires `show_writing_fixtures: false`. Production loaders must never read or expose fixture entries, regardless of content files present.

---

## Adding content

| To add | Do |
|---|---|
| Writing post | `posts/<slug>/<slug>.md` + one entry in `blog.json` |
| External link | one entry in `blog.json` with `external_url` |
| Project | one object in `projects.json` |
| Timeline role | one entry in `timeline.json` + one `<name>.md` |
| Nav / social / GA ID / resume | edit `site.json` |

All content-only edits. No code.

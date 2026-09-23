# 02 — Content & Data Model

> Every user-facing string lives in `content/`. Schemas are intentionally simple — hand-rolled validation, no zod. The goal: a human can edit any content file without touching code or understanding a framework.

---

## File map

| Path | Purpose |
|---|---|
| `content/site.json` | global metadata and navigation |
| `content/landing.json` | landing metadata and contact registry |
| `content/landing.md` | landing prose |
| `content/about.md` | about page (frontmatter + prose) |
| `content/experience/experience.json` | roles metadata |
| `content/experience/*.md` | one file per role |
| `content/artifacts/artifacts.json` | Artifacts entries (post or external link) |
| `content/artifacts/posts/<slug>/<slug>.md` | Artifact body: writing, project reflection, photography, or note |
| `content/artifacts/posts/<slug>/*.{png,jpg,webp}` | co-located post images |
| `content/artifacts/fixtures/` | development-only Artifacts fixtures |

No `authors.json` — Artifacts is single-author and the index does not repeat author information.

---

## `site.json`

```json
{
  "title": "Sahil Jaganmohan",
  "description": "Portfolio and details about Sahil Jaganmohan",
  "url": "https://TODO.example.com",
  "ga4_id": "",
  "nav": [
    { "label": "Home", "href": "/", "accent": "gold" },
    { "label": "About", "href": "/about", "accent": "blue" },
    { "label": "Experience", "href": "/experience", "accent": "magenta" },
    { "label": "Artifacts", "href": "/artifacts", "accent": "teal" }
  ]
}
```

Set `url` to the production site origin. An empty `ga4_id` disables analytics. Each navigation item selects a shared accent class.

---

## Landing content

`landing/landing.json` owns structured metadata and contacts. `landing/landing.md` owns authored prose. `loadLanding()` combines them into one page model.

```json
{
  "name": "Sahil Jaganmohan",
  "tagline": "I build thoughtful software and systems with clear, reliable execution.",
  "tagline_emphasis": "thoughtful software and systems",
  "metadata": [
    { "label": "Focus", "value": "Clear systems and experiences" }
  ],
  "contacts": [
    {
      "key": "mail",
      "label": "dev.sahil.jaganmohan@gmail.com",
      "href": "mailto:dev.sahil.jaganmohan@gmail.com",
      "accent": "gold"
    }
  ]
}
```

`tagline_emphasis` must occur exactly once within `tagline`. Metadata is an ordered, non-empty orientation strip. Contacts have unique keys and use a shared accent name. The Markdown file can contain the landing introduction without a frontmatter parser.

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

## `experience.json` + per-role `*.md`

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

## `artifacts.json`

```json
{
  "entries": [
    {
      "title": "MapReduce",
      "date": "2022-05-01",
      "type": "built",
      "excerpt": "A university systems project revisited with a short retrospective.",
      "tags": ["C", "OpenMP", "MPI"],
      "status": "published",
      "slug": "mapreduce",
      "md": "posts/mapreduce/mapreduce.md"
    }
  ]
}
```

Artifacts conventions:
- `type` is one of `built`, `written`, `photographed`, `thought`, or `external`. It provides a small human-readable category label on the Artifacts index and does not change routing.
- If `external_url` is present, the entry is an external link (opens new tab). If `md` is present, it is an internal post. If `status: "draft"`, exclude it from the index and return 404 for its slug.
- **No `author` field** — Artifacts is single-author and the index does not display author information.
- **Required for posts:** title, date, type, slug, excerpt, tags, status, md. **Required for links:** title, date, type, excerpt, external_url. `updated_at` and `reading_time` are optional; include them only when they are accurate.

Post body is pure markdown (no frontmatter). Co-located images in same folder.

---

## Markdown pipeline (`lib/shared/markdown.ts`)

`renderMarkdown(raw, opts?)` → `{ html, headings }`:
- `markdown-it` for parsing.
- **Heading IDs** generated by a 10-line slugify function (no `markdown-it-anchor` dependency).
- Raw HTML is disabled in `markdown-it`. Content uses Markdown only; no HTML allowlist or color spans are accepted. This avoids a custom sanitizer and keeps styling in components rather than authored content.
- Artifacts post relative images are rewritten to `/artifacts/<slug>/<file>`.
- `headings` includes authored H1/H2 headings. Artifacts bodies are H2-led; `ArtifactsPostPage` prepends the separately rendered post-title H1 to the TOC.

---

## Loaders (`lib/content/loadContent.ts`)

Typed functions: `loadSite()`, `loadLanding()`, `loadAbout()`, `loadExperience()`, `loadArtifactsIndex()`, `loadArtifactsPost(slug)`. Each reads from `content/`, calls `renderMarkdown` where needed, returns typed objects.

---

## Validation (`lib/validate.ts`)

Hand-rolled (no zod). Collects all errors, prints clear report, exits non-zero. Checks:

- `site.json` — required fields present, `url` is an HTTPS origin, and navigation entries have labels, valid destinations, and supported accents.
- `landing/landing.json` — name/tagline, non-empty metadata and contacts, unique contact keys, valid destinations, supported accents, and an optional `tagline_emphasis` occurring exactly once in `tagline`.
- `about.md` — `portrait` file exists; `intro` is non-empty; optional `outside_of_work` is non-empty when present; skillset has three or four groups, each with non-empty label, description, and items.
- `experience.json` — `color` is hex, each `md` exists, `summary` is non-empty, and `current` is boolean. Color remains decorative; text never inherits it.
- `artifacts.json` — `slug` is unique and valid, `type` is allowed, `md` exists for internal entries, `external_url` is valid for links, and `date` is ISO.

## Adding content

| To add | Do |
|---|---|
| Artifact | `posts/<slug>/<slug>.md` + one entry in `artifacts.json` |
| External thing | one entry in `artifacts.json` with `external_url` |
| Experience role | one entry in `experience.json` + one `<name>.md` |
| Navigation or GA ID | edit `site.json` |
| Landing metadata or contacts | edit `landing/landing.json` |
| Landing prose | edit `landing/landing.md` |

All content-only edits. No code.

# 02 — Content & Data Model

> Every user-facing string lives in `content/`. Schemas are intentionally simple — hand-rolled validation, no zod. The goal: a human can edit any content file without touching code or understanding a framework.

---

## File map

| Path | Purpose |
|---|---|
| `content/site.json` | global metadata |
| `content/landing.md` | landing page (frontmatter + prose + "Now" block) |
| `content/about.md` | about page (frontmatter + prose) |
| `content/timeline/timeline.json` | roles metadata |
| `content/timeline/*.md` | one file per role |
| `content/projects/projects.json` | projects (flat list) |
| `content/blog/blog.json` | entries (post or external link) |
| `content/blog/posts/<slug>/<slug>.md` | post body |
| `content/blog/posts/<slug>/*.png` | co-located images |

No `authors.json` — single author (you) is hardcoded in the component.

---

## `site.json`

```json
{
  "title": "Sahil Jaganmohan",
  "description": "Portfolio and details about Sahil Jaganmohan",
  "url": "https://TODO.example.com",
  "ga4_id": "G-XXXXXXXXXX",
  "nav": [
    { "label": "Home", "href": "/" },
    { "label": "About", "href": "/about" },
    { "label": "Experience", "href": "/experience" },
    { "label": "Projects", "href": "/projects" },
    { "label": "Blog", "href": "/blog" }
  ],
  "social": {
    "email": "mailto:dev.sahil.jaganmohan@gmail.com",
    "linkedin": "https://www.linkedin.com/in/sahil-jaganmohan",
    "github": "https://github.com/bullpointe"
  },
  "resume": "/static/resume.pdf",
  "elsewhere": []
}
```

`url` is a TODO placeholder — replace before launch. `ga4_id` empty string disables analytics. `elsewhere` empty array hides the section.

---

## `landing.md`

Frontmatter: hero text + metadata strip + "Now" block (structured list with colored accents). Body: prose with inline links.

```markdown
---
name: "Sahil Jaganmohan"
tagline: "Computer engineer specializing in embedded systems."
metadata:
  - { label: "Discipline", value: "Embedded systems" }
  - { label: "Location", value: "Cupertino, CA" }
  - { label: "Currently", value: "Apple, since Jan 2023" }
now:
  - { label: "Working on", value: "Embedded at Apple, HW/SW co-design", color: "green" }
  - { label: "Learning", value: "Rust for embedded, RTOS scheduling", color: "blue" }
  - { label: "Reading", value: "The Pragmatic Programmer", color: "purple" }
  - { label: "Listening", value: "Deep house, drum and bass", color: "orange" }
---

My curiosity of complex system architecture has encouraged me to
delve into software/hardware applications...

I'm always interested in opportunities related to embedded systems,
real-time/critical systems, algorithm design, and SW/HW optimization.

Built some cool stuff: [projects](/projects) · [github](https://github.com/bullpointe).

Take a look at my [resume](/static/resume.pdf).
```

The `now` field is a list of labeled items. Each has a `label`, `value`, and `color` (one of: `green`, `blue`, `purple`, `orange`, `pink`, `yellow` — maps to `--color-pop-*` tokens). The component renders each as a row with a colored left border (Option B from the design review). Static, no JS.

---

## `about.md`

```markdown
---
portrait: "/static/portrait.jpg"
portrait_alt: "Portrait of Sahil Jaganmohan"
skillset:
  - { label: "Languages", items: ["C/C++", "Java", "Python", "Golang", "JavaScript", "Swift", "Ruby"] }
  - { label: "Embedded Systems", items: ["I2C", "DMA", "SPI", "UART", "ESP32"] }
  - { label: "Hardware", items: ["ASIC Design", "SystemVerilog", "PCB Design", "ARMv6-M", "RTL", "FPGA"] }
  - { label: "Cloud", items: ["Azure", "AWS-EC2", "Docker", "Kubernetes", "Jenkins"] }
  - { label: "Databases", items: ["SQL", "OracleDB", "MongoDB"] }
  - { label: "Frameworks", items: ["React", "OpenMP", "MPI", "Scikit-Learn", "GraphQL"] }
---

Biography paragraph one...

Biography paragraph two...
```

No `icon` field — skillset cards are pure typography (label + items). Simpler.

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
      "color": "#3b9eff",
      "md": "apple-seg.md"
    }
  ]
}
```

Each `*.md` is pure markdown (bullets + bold). No frontmatter.

---

## `projects.json`

```json
{
  "projects": [
    {
      "title": "MapReduce",
      "description": "Developed a full MapReduce implementation for multi-core machines...",
      "tags": ["C", "OpenMP", "MPI"],
      link: ""
    },
    {
      "title": "Mood Music",
      "description": "A web interface that suggests music based on heart rate...",
      "tags": ["JavaScript", "Fitbit", "Spotify"],
      "link": "https://devpost.com/software/mood-music-0g7f6u"
    }
  ]
}
```

Simplified from the prior design:
- **No `file`/`url` split** — one `link` field. If it's a URL, it opens externally. If empty, no link.
- **No `image`/`alt`** — projects are a list now (paco/delba style), not cards with images.
- **No `colors` map** — tag colors are handled by a fixed CSS palette (a small set of tag→class mappings in `components.css`). No JSON-driven inline styles. To add a new tag color, add a CSS class.

---

## `blog.json`

```json
{
  "entries": [
    {
      "title": "Designing a low-latency dashboard",
      "date": "2026-08-20",
      "slug": "designing-a-dashboard",
      "excerpt": "A short teaser.",
      "tags": ["engineering", "performance"],
      "status": "published",
      "md": "posts/designing-a-dashboard/designing-a-dashboard.md"
    },
    {
      "title": "My essay on Medium",
      "date": "2026-09-01",
      "excerpt": "Teaser shown on the index.",
      "external_url": "https://medium.com/@sahil/example"
    }
  ]
}
```

Simplified:
- **No `kind` discriminator** — if `external_url` is present, it's an external link (opens new tab). If `md` is present, it's an internal post. If `status: "draft"`, excluded from index + slug 404s.
- **No `author` field** — single author, hardcoded.
- **Required for posts:** title, date, slug, excerpt, tags, status, md. **Required for links:** title, date, excerpt, external_url.

Post body is pure markdown (no frontmatter). Co-located images in same folder.

---

## Markdown pipeline (`lib/markdown.ts`)

`renderMarkdown(raw, opts?)` → `{ html, headings }`:
- `markdown-it` for parsing.
- **Heading IDs** generated by a 10-line slugify function (no `markdown-it-anchor` dependency).
- **Sanitization** via markdown-it's built-in HTML safety + a small allowlist function (no `sanitize-html` dependency). Strips `<script>`/`<iframe>`; keeps `<span class="pop-*">` for the about-page color escape hatch.
- Blog post relative images rewritten to `/blog/<slug>/<file>`.
- `headings` includes H1 + H2 (for blog TOC).

---

## Loaders (`lib/loadContent.ts`)

Typed functions: `loadSite()`, `loadLanding()`, `loadAbout()`, `loadTimeline()`, `loadProjects()`, `loadBlogIndex()`, `loadBlogPost(slug)`. Each reads from `content/`, calls `renderMarkdown` where needed, returns typed objects.

---

## Validation (`lib/validate.ts`)

Hand-rolled (no zod). Collects all errors, prints clear report, exits non-zero. Checks:

- `site.json` — required fields present, `resume` file exists.
- `landing.md` — frontmatter has name/tagline/metadata, body non-empty.
- `about.md` — `portrait` file exists, skillset non-empty.
- `timeline.json` — `color` is hex, each `md` exists.
- `projects.json` — projects non-empty, tags are strings.
- `blog.json` — `slug` unique + valid format, `md` exists for posts, `external_url` valid for links, `date` is ISO.

---

## Adding content

| To add | Do |
|---|---|
| Blog post | `posts/<slug>/<slug>.md` + one entry in `blog.json` |
| External link | one entry in `blog.json` with `external_url` |
| Project | one object in `projects.json` |
| Timeline role | one entry in `timeline.json` + one `<name>.md` |
| Nav / social / GA id / resume | edit `site.json` |

All content-only edits. No code.

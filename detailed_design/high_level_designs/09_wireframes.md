# 09 — Wireframes

> ASCII layout sketches for every page. This is the only place wireframes live.

**Design language:** Blue Slate Editorial — ink-blue dark mode, blue-white light mode, calm high-contrast text, restrained sienna interaction accents, and generous whitespace. Text-link footer, one localized nav dropdown at every breakpoint, no decorative animation, and no card grids for projects/blog. Light and dark modes share identical geometry.

Inspirations: imkylelambert (metadata strip, project list), paco.me (minimalism), leerob.com (blog as date+title list), maggieappleton (calm dark bg, whitespace), delba.dev (work as list), increment (editorial structure).

Legend: `◐` = logo · `◑` = theme preference · `≡` = nav trigger · `●` = timeline node · `↗` = external link

---

## 0. Shared chrome

```
┌──────────────────────────────────────────────┐
│ [◐]                              ◑  ≡      │ ← logo, theme preference, nav trigger
├──────────────────────────────────────────────┤
│                                              │
│          <main: page content>                │
│                                              │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │ ← text links, no icons
│   © Sahil Jaganmohan 2026                   │
└──────────────────────────────────────────────┘
```

Nav dropdown (all breakpoints, localized, right-aligned):
```
                    ┌──────────┐
                    │ Home      │
                    │ About      │
                    │ Experience │
                    │ Projects  │
                    │ Writing    │
                    └──────────┘
```

---

## 1. Landing `/`

Minimal hero + metadata strip + short prose + path link row.

```
┌──────────────────────────────────────────────┐
│ [◐]                                ◑  ≡    │
├──────────────────────────────────────────────┤
│                                              │
│                                              │
│   Sahil Jaganmohan                           │ ← large, bold
│   I build thoughtful software and systems    │ ← one phrase in sienna
│   with clear, reliable execution.            │
│                                              │
│   ─────────────────────────────────          │
│   ┃ Focus         Clear systems and           │ ← one continuous sienna rule
│   ┃               experiences                 │   groups all metadata rows
│   ┃ Based         Cupertino, CA                │
│   ┃ Exploring     Design, photography, and    │
│   ┃               the outdoors                │
│   ─────────────────────────────────          │
│                                              │
│   I like work where the difficult parts are  │ ← point of view, not resume bio
│   mostly invisible: clear interfaces,        │
│   reliable systems, and details that hold    │
│   up when people rely on them.                │
│                                              │
│   I care about the full path from a rough    │
│   idea to something finished, useful, and    │
│   easy to understand.                        │
│                                              │
│   Projects · Writing · Resume                 │ ← compact path selector
│                                              │
│                                              │ ← intentional ending whitespace
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
│   © Sahil Jaganmohan 2026                   │
└──────────────────────────────────────────────┘
```

---

## 2. About `/about`

Portrait + editorial intro + full-width biography + personal note + numbered disciplines.

```
┌──────────────────────────────────────────────┐
│ [◐]                                ◑  ≡    │
├──────────────────────────────────────────────┤
│                                              │
│   About Me                                   │
│   in more depth                              │
│                                              │
│   ┌─────────┐  I enjoy turning complex ideas │ ← short editorial intro
│   │         │  into clear, dependable work.  │
│   │ portrait│                                 │
│   │         │                                 │
│   └─────────┘                                 │
│                                              │
│   I was born and raised in New Jersey...      │ ← full-width biography
│   Ever since I was young...                   │   resumes below portrait
│   As an outdoor person...                     │
│                                              │
│   ─────────────────────────────────          │
│   Outside of work                             │
│   Usually behind a camera, on a trail, or    │ ← optional personal note
│   following a new curiosity.                  │
│                                              │
│   What I work with                           │
│                                              │
│   01  Systems & software                     │ ← number has muted color
│       Building reliable tools and systems    │
│       that make complexity manageable.       │
│       C/C++ · Python · Go · JavaScript       │
│                                              │
│   ─────────────────────────────────          │
│   02  Hardware & embedded                    │ ← each number uses a
│       Working across software and physical   │   fixed muted color
│       constraints.                           │
│       I2C · DMA · SPI · UART · FPGA          │
│                                              │
│   ─────────────────────────────────          │
│   03  Product & platform                     │
│       Turning working systems into           │
│       dependable products.                   │
│       Cloud · CI/CD · Databases · Docker     │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
│   © Sahil Jaganmohan 2026                   │
└──────────────────────────────────────────────┘
```

Mobile: portrait stacks above the editorial intro; biography, personal note, and numbered disciplines remain a single reading flow.

---

## 3. Timeline `/experience`

Left-aligned rail. Large year on rail, narrative entry to the right.

```
┌──────────────────────────────────────────────┐
│ [◐]                                ◑  ≡    │
├──────────────────────────────────────────────┤
│   Experience                                 │
│   full-time & education                      │
│                                              │
│   │                                          │
│   ● 2023  Apple                      Present │ ← rail + narrative entry
│   │       Embedded Software Engineer · CA     │
│   │       Jan 2023 – Present                  │
│   │       Building dependable systems where   │ ← role summary first
│   │       performance and clarity matter.     │
│   │       • Led design and development of... │
│   │       • Improved...                       │
│   │                                          │
│   │       ─────────────────────────────       │
│   │                                          │
│   ● 2022  Purdue University                   │
│   │       Student · West Lafayette, IN        │
│   │       Developing a foundation in...       │
│   ⋮                                          │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

`●` = company color. The `Present` marker is text, not a live badge. Same reading order mobile → desktop.

---

## 4. Projects `/projects`

**Numbered editorial list** (not a card grid). Decorative number + title + description + optional challenge + tags + meaningful link.

```
┌──────────────────────────────────────────────┐
│ [◐]                                ◑  ≡    │
├──────────────────────────────────────────────┤
│   Projects                                   │
│   stuff I've worked on                       │
│                                              │
│   01  MapReduce                    Repository ↗│
│       Developed a full MapReduce              │
│       implementation for multi-core machines. │
│       The challenge: making parallel work     │
│       predictable across workloads.           │
│       [C] [OpenMP] [MPI]                      │
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   02  Mood Music                  Project site ↗│
│       A web interface that suggests music     │
│       based on heart rate.                    │
│       [JavaScript] [Fitbit] [Spotify]         │
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   03  USB Full-Speed Bulk-Transfer SoC        │
│       Designed a USB peripheral module...     │
│       [SystemVerilog] [ASIC] [RTL]            │
│                                              │
│   ⋮                                          │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

Each project is a row with a thin divider. The decorative number comes from list order. No images or cards. Destination labels state where a link leads; tags are small pills. The optional challenge sentence appears only when it adds useful context.

---

## 5. Writing index `/blog`

One editorial index for essays, field notes, photo essays, and external work. Type labels add context without fragmenting a small archive.

```
┌──────────────────────────────────────────────┐
│ [◐]                                ◑  ≡    │
├──────────────────────────────────────────────┤
│   Writing                                    │
│   notes, essays, and images                  │
│                                              │
│   Essay · Aug 20, 2026                        │ ← type + date
│   Designing a low-latency dashboard          │ ← title (link)
│   A short teaser about the post...           │ ← excerpt
│   [engineering] [performance]                │ ← tags
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   Photo essay · Jul 15, 2026                 │
│   Morning light on the coast                 │
│   A short visual note from a hike...         │
│   [photography] [outdoors]                   │
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   Elsewhere · Jun 15, 2026                   │
│   My essay on Medium                   ↗    │ ← external link marker
│   Teaser shown on the index...               │
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   Field note · Jun 03, 2026                  │
│   Why embedded matters                       │
│   Excerpt...                                 │
│   [embedded] [career]                        │
│   ⋮                                          │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

Each row is text-led: type, date, title, excerpt, and optional tags. It has a thin divider. Internal → `/blog/<slug>`. External → `external_url` (new tab, `↗`). Images appear in posts, not on the Writing index. There is no filter bar at launch.

---

## 6. Writing post `/blog/{slug}`

TOC shows H1 + H2.

```
┌──────────────────────────────────────────────┐
│ [◐]                                ◑  ≡    │
├──────────────────────────────────────────────┤
│                                              │
│   Designing a low-latency dashboard          │ ← H1
│   Aug 20, 2026                               │ ← date only (no author badge)
│                                              │
│   ▾ On this page                             │ ← <details>, no JS
│     Designing a low-latency dashboard        │ ← H1 in TOC
│     Why latency matters                      │ ← H2s in TOC
│     The architecture                         │
│     Results                                 │
│                                              │
│   ## Why latency matters                     │
│   Latency is the time between...             │
│                                              │
│   ## The architecture                        │
│   The system is split into...                │
│                                              │
│   ## Results                                 │
│   We observed a 500% improvement...          │
│                                              │
│   ← back to writing                          │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

---

## 7. Error page

```
┌──────────────────────────────────────────────┐
│ [◐]                                ◑  ≡    │
├──────────────────────────────────────────────┤
│                                              │
│           404: Not Found                     │
│   You just hit a route that doesn't exist... │
│   ← back home                                │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

---

## 8. Layout rules

1. **Centered column** — `--content-max` for prose, `--content-max-wide` for lists.
2. **Section titles** — H1 + sienna subtitle on non-landing pages.
3. **Lists over cards** — projects and Writing are lists (not card grids). Writing rows show type + date + title + excerpt + tags. Projects show title + description + tags + link. Only timeline uses cards (structural necessity).
4. **Mono font** for dates, tags, nav, metadata labels.
5. **Gutter** is the only horizontal padding.
6. **Sticky header** — anchors get `scroll-margin-top`.
7. **Two themes, one layout** — theme changes tokens only; spacing, hierarchy, and component geometry remain fixed.
8. **Color is supporting information** — text labels and structure remain understandable without accent colors.
9. **Controls are explicit** — 44px targets, visible keyboard focus, and accessible names for icon controls.
10. **Landing color moment** — one sienna phrase and metadata rule create visual interest; no multicolor status panel.
11. **Landing progression** — identity → three-row orientation strip → two short point-of-view paragraphs → Projects/Writing/Resume → intentional whitespace.

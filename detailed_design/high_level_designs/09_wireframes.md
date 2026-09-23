# 09 — Wireframes

> ASCII layout sketches for every page. This is the only place wireframes live.

**Design language:** Blue Slate Editorial — ink-blue dark mode, blue-white light
mode, calm high-contrast text, restrained sienna interaction accents, and
generous whitespace. Text-link footer, one localized nav dropdown at every
breakpoint, no decorative animation, and no card grids for projects/blog. Light
and dark modes share identical geometry.

Inspirations: imkylelambert (metadata strip, project list), paco.me
(minimalism), leerob.com (blog as date+title list), maggieappleton (calm dark
bg, whitespace), delba.dev (work as list), increment (editorial structure).

Legend: `◐` = logo · `◑` = theme preference · `≡` = nav trigger · `●` = timeline
node · `↗` = external link

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
│ Artifacts     │
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
│   Artifacts · Resume                             │ ← compact path selector
│                                              │
│                                              │ ← intentional ending whitespace
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
│   © Sahil Jaganmohan 2026                   │
└──────────────────────────────────────────────┘
```

---

## 2. About `/about`

Portrait + editorial intro + full-width biography + personal note + numbered
disciplines.

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

Mobile: portrait stacks above the editorial intro; biography, personal note, and
numbered disciplines remain a single reading flow.

---

## 3. Experience `/experience`

Desktop uses a narrow year column and a narrative entry column. A short colored
bar prefixes the organization name; mobile places the year above its entry.

```
┌──────────────────────────────────────────────┐
│ [◐]                                ◑  ≡    │
├──────────────────────────────────────────────┤
│   Experience                                 │
│                                              │
│   2023  │ Apple                      Present │ ← year + narrative entry
│         │ Embedded Software Engineer · CA     │
│         │ Jan 2023 – Present                  │
│         │ Building dependable systems where   │ ← role summary first
│         │ performance and clarity matter.     │
│         │ • Led design and development of... │
│         │ • Improved...                       │
│         │ ─────────────────────────────       │
│                                              │
│   2022  │ Purdue University                   │
│         │ Student · West Lafayette, IN        │
│         │ Developing a foundation in...       │
│   ⋮                                          │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

`│` before the company name = short company-color bar. The `Present` marker is
text, not a live badge. Same reading order mobile → desktop.

---

## 4. Artifacts `/artifacts`

One chronological archive for Artifacts built, written, photographed, and thought
about. Entries are complete row links; the filter uses a native disclosure and
URL links.

```
┌──────────────────────────────────────────────┐
│ [◐]                                ◑  ≡    │
├──────────────────────────────────────────────┤
│   Artifacts                                     │
│                                              │
│   Artifacts I've built, written, photographed,  │
│   and thought about.                          │
│                                              │
│   All                                      ↓ │
│   ─────────────────────────────────────────  │
│                                              │
│   Why I Like Boring Software               → │
│   Essay · Software · 8 min read · 2026        │
│                                              │
│   A short reflection on why predictable       │
│   systems are often better than clever ones.  │
│                                              │
│   ─────────────────────────────────────────  │
│                                              │
│   Tokyo                                    → │
│   Photography · Japan · 2026                  │
│                                              │
│   ─────────────────────────────────────────  │
│                                              │
│   A Tiny Compiler                          → │
│   Making · Rust · Compilers · 2026            │
│                                              │
│   A small compiler built to understand        │
│   parsing, transformation, and code generation.│
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

The filter opens in normal document flow: `All`, `Writing`, `Making`, `Photos`,
and `Notes` link to the corresponding URL query state. Each row is one full-link
target. Metadata follows the title; excerpts are optional; images appear only in
individual Artifacts.

---

## 5. Artifacts post `/artifacts/{slug}`

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
│   ← back to Artifacts                           │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

---

## 6. Error page

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

1. **Centered column** — `--content-max` for prose, `--content-max-wide` for
   lists.
2. **Section titles** — H1 + sienna subtitle on non-landing pages.
3. **Lists over cards** — Artifacts is a divided list, not a card grid. Artifacts rows
   show title + metadata + optional excerpt + destination cue. Experience
   entries remain the only structured chronological entries.
4. **Mono font** for dates, tags, nav, metadata labels.
5. **Gutter** is the only horizontal padding.
6. **Sticky header** — anchors get `scroll-margin-top`.
7. **Two themes, one layout** — theme changes tokens only; spacing, hierarchy,
   and component geometry remain fixed.
8. **Color is supporting information** — text labels and structure remain
   understandable without accent colors.
9. **Controls are explicit** — 44px targets, visible keyboard focus, and
   accessible names for icon controls.
10. **Landing color moment** — one sienna phrase and metadata rule create visual
    interest; no multicolor status panel.
11. **Landing progression** — identity → three-row orientation strip → two short
    point-of-view paragraphs → Artifacts/Resume → intentional whitespace.

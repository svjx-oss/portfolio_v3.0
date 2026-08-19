# 09 — Wireframes

> ASCII layout sketches for every page. This is the only place wireframes live.

**Design language:** minimal, clean, generous whitespace. Dark navy bg, calm white text. Text-link footer (no icons). One nav dropdown (both desktop + mobile). No animations, no typewriter, no card grids for projects/blog.

Inspirations: imkylelambert (metadata strip, project list), paco.me (Now section, minimalism), leerob.com (blog as date+title list), maggieappleton (calm dark bg, whitespace), delba.dev (work as list), increment (editorial structure).

Legend: `◐` = logo · `≡` = nav trigger · `●` = timeline node · `↗` = external link

---

## 0. Shared chrome

```
┌──────────────────────────────────────────────┐
│ [◐]                                    ≡    │ ← sticky, blur bg
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
                    │ Blog       │
                    └──────────┘
```

---

## 1. Landing `/`

Minimal hero + metadata strip + "Now" block + prose. (imkylelambert + paco.me)

```
┌──────────────────────────────────────────────┐
│ [◐]                                    ≡    │
├──────────────────────────────────────────────┤
│                                              │
│                                              │
│   Sahil Jaganmohan                           │ ← large, bold, sienna
│   Computer engineer specializing in          │ ← one-liner, subtle
│   embedded systems.                          │
│                                              │
│   ─────────────────────────────────          │
│   Discipline    Embedded systems             │ ← metadata strip
│   Location      Cupertino, CA                │
│   Currently     Apple, since Jan 2023        │
│   ─────────────────────────────────          │
│                                              │
│   Now                                        │ ← color-accented rows
│   ┃ Working on                               │   each row has a colored
│   ┃ Embedded at Apple, HW/SW co-design       │   left border (pop-color
│   ┃ Learning                                 │   per category)
│   ┃ Rust for embedded, RTOS scheduling       │
│   ┃ Reading                                  │
│   ┃ The Pragmatic Programmer                  │
│   ┃ Listening                                │
│   ┃ Deep house, drum and bass                │
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   My curiosity of complex system             │
│   architecture has encouraged me to          │
│   delve into software/hardware...            │
│                                              │
│   I'm always interested in opportunities     │
│   related to embedded systems...             │
│                                              │
│   Built some cool stuff: projects · github   │ ← inline links
│   Take a look at my resume.                  │
│                                              │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
│   © Sahil Jaganmohan 2026                   │
└──────────────────────────────────────────────┘
```

---

## 2. About `/about`

Portrait + bio + skillset grid. (maggieappleton calm layout)

```
┌──────────────────────────────────────────────┐
│ [◐]                                    ≡    │
├──────────────────────────────────────────────┤
│                                              │
│   About Me                                   │
│   in more depth                              │
│                                              │
│   ┌─────────┐  I was born and raised in      │
│   │         │  New Jersey...                 │
│   │ portrait│                                 │
│   │         │  Ever since I was young...      │
│   └─────────┘  As an outdoor person...       │
│                                              │
│   Professional Skillset                      │
│   ┌────────┐ ┌────────┐ ┌────────┐           │
│   │Languages│ │Embedded│ │Hardware│           │
│   │C/C++    │ │I2C DMA │ │ASIC    │           │
│   │Java Py  │ │SPI UART│ │RTL FPGA│           │
│   └────────┘ └────────┘ └────────┘           │
│   ┌────────┐ ┌────────┐ ┌────────┐           │
│   │Cloud    │ │DBs     │ │Frameworks│        │
│   └────────┘ └────────┘ └────────┘           │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
│   © Sahil Jaganmohan 2026                   │
└──────────────────────────────────────────────┘
```

Mobile: portrait stacks above bio. Skillset: 1 col.

---

## 3. Timeline `/experience`

Left-aligned rail. Year on rail, card to right.

```
┌──────────────────────────────────────────────┐
│ [◐]                                    ≡    │
├──────────────────────────────────────────────┤
│   Experience                                 │
│   full-time & education                      │
│                                              │
│   │                                          │
│   ● 2023  ┌──────────────────────────────┐   │
│   │       │ Embedded Software Engineer   │   │
│   │       │ Apple · Cupertino, CA        │   │
│   │       │ • Silicon Engineering Group │   │
│   │       │ • Directed design/dev of... │   │
│   │       └──────────────────────────────┘   │
│   │                                          │
│   ● 2022  ┌──────────────────────────────┐   │
│   │       │ Student                      │   │
│   │       └──────────────────────────────┘   │
│   ⋮                                          │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

`●` = company color. Same layout mobile → desktop.

---

## 4. Projects `/projects`

**Simple list** (not a card grid). Title + description + tags + optional link. (paco/delba/imkylelambert)

```
┌──────────────────────────────────────────────┐
│ [◐]                                    ≡    │
├──────────────────────────────────────────────┤
│   Projects                                   │
│   stuff I've worked on                       │
│                                              │
│   MapReduce                          more ↗ │
│   Developed a full MapReduce implementation  │
│   for multi-core machines...                 │
│   [C] [OpenMP] [MPI]                        │
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   Mood Music                         more ↗ │
│   A web interface that suggests music       │
│   based on heart rate...                    │
│   [JavaScript] [Fitbit] [Spotify]           │
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   USB Full-Speed Bulk-Transfer SoC           │
│   Designed a USB peripheral module...        │
│   [SystemVerilog] [ASIC] [RTL]              │
│                                              │
│   ⋮                                          │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

Each project is a row with a thin divider. No images, no cards. Title links externally if `link` is set. Tags are small pills.

---

## 5. Blog index `/blog`

Simple list with author, excerpt, and tags (not a bare date+title list — those aspects add context without clutter).

```
┌──────────────────────────────────────────────┐
│ [◐]                                    ≡    │
├──────────────────────────────────────────────┤
│   Blog                                       │
│   writing, notes, and elsewhere              │
│                                              │
│   [img] Sahil · Aug 20, 2026                │ ← author badge + date
│   Designing a low-latency dashboard          │ ← title (link)
│   A short teaser about the post...           │ ← excerpt
│   [engineering] [performance]              │ ← tags
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   [img] Sahil · Jul 15, 2026                │
│   My essay on Medium                   ↗    │ ← external link marker
│   Teaser shown on the index...              │
│                                              │
│   ─────────────────────────────────          │
│                                              │
│   [img] Sahil · Jun 03, 2026                │
│   Why embedded matters                      │
│   Excerpt...                                │
│   [embedded] [career]                      │
│   ⋮                                          │
│                                              │
│   Elsewhere                                   │ ← hidden if empty
│   Medium · GitHub · Substack                 │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

Author badge (circular avatar + name) is hardcoded — single author, no `authors.json`. Each row has a thin divider. Internal → `/blog/<slug>`. External → `external_url` (new tab, `↗`). Tags shown as small pills.

---

## 6. Blog post `/blog/{slug}`

TOC shows H1 + H2.

```
┌──────────────────────────────────────────────┐
│ [◐]                                    ≡    │
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
│   ← back to blog                             │
├──────────────────────────────────────────────┤
│   email · linkedin · github · resume        │
└──────────────────────────────────────────────┘
```

---

## 7. Error page

```
┌──────────────────────────────────────────────┐
│ [◐]                                    ≡    │
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
3. **Lists over cards** — projects and blog are lists (not card grids). Blog rows show author badge + date + title + excerpt + tags. Projects show title + description + tags + link. Only timeline uses cards (structural necessity).
4. **Mono font** for dates, tags, nav, metadata labels.
5. **Gutter** is the only horizontal padding.
6. **Sticky header** — anchors get `scroll-margin-top`.

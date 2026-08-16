# 09 — Wireframes & Layout Diagrams

<!-- COMMENT: I have a feeling that we are using too much of the prior website design as we did in the prior website. As I stated before we are looking to breakaway from that design with an all new modern design powered by typescript. I want you to look at the websites that I had provided to come up with an inspiration on what the design should be.  Be creative, modern, and minimalistic, it should look clean and effortless and minimal while being easy to read and navigate. -->

> ASCII sketches of every page × breakpoint + the shared chrome + the pixel-mosaic concept. This is the visual companion to the page docs (`04`–`08`) and the chrome doc (`03`). Not pixel-perfect — meant to lock **structure** before code.

Legend: `◐` = bitmoji logo · `☰` = hamburger · `█▍` = typewriter cursor · `●` = timeline node · `│` = rail line · `↗` = external link.

---

## 0. Shared page chrome (every page)

### Desktop (≥768px) — sticky header, inline nav, footer
```
┌──────────────────────────────────────────────────────────────────────────┐
│ [◐]                                          About  Experience  Projects│ ← sticky, blur bg
│                                              Blog                      ▾ │   (no "Home" — logo=home, Q-N1)
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│   ┄┄┄┄┄┄┄┄┄┄┄┄ <main: page content, centered, max-width> ┄┄┄┄┄┄┄┄┄┄┄┄┄   │
│   ┃                                                                      │
│   ┃    (each page's wireframe below goes inside <main>)                  │
│   ┃                                                                      │
│   ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄   │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│              [✉]  [in]  [⌂]  [gh]  [📄]                                  │ ← footer icon row
│                     © Sahil Jaganmohan 2026                              │
└──────────────────────────────────────────────────────────────────────────┘
        ▒▒▒▒▒▒▒  (faint pixel-art mountains+ocean fixed behind, z:-1)  ▒▒▒▒▒
```

### Mobile (<768px) — hamburger, collapsible menu
```
┌────────────────────────┐         ┌─ menu open ───────────┐
│ [◐]                 ☰  │  tap →  │ Home                   │
└────────────────────────┘         │ About                  │
┌────────────────────────┐         │ Experience             │
│                        │         │ Projects               │
│   <main: full width>    │         │ Blog                   │
│   (gutter side padding) │         └────────────────────────┘
│                        │
│                        │
├────────────────────────┤
│  [✉][in][⌂][gh][📄]    │
│  © Sahil Jaganmohan 2026│
└────────────────────────┘
```
Native `<details>` no-JS fallback; island only animates (Q-N2).

---

## 1. Landing `/`

### Desktop
```
┌────────────────────────────────────────────────────────────────────────┐
│ [◐]                                          About Experience Proj Blog│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                                                                        │
│            Hey! 👋🏼 i'm                                                 │
│                                                                        │
│            Sahil Jaganmohan                  ← sienna, italic, huge     │
│                                                                        │
│            i'm a computer engineer specializing in                    │
│            Embedded Systems▍               ← typewriter cycles 5      │
│                                                                        │
│            currently an Embedded Software Engineer at                  │
│            Apple since Jan 2023.            ← "Apple" links /experience │
│                                                                        │
│            my curiosity of complex system architecture and            │
│            critical applications has encouraged me to delve...        │
│                                                                        │
│            i'm always interested in opportunities related to          │
│            embedded systems, real-time/critical systems...             │
│                                                                        │
│            i've built some cool stuff too: projects and my github.     │  ← links
│                                                                        │
│            take a look at my resume.                                  │  ← resume pdf
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│        [✉] [in] [⌂] [gh] [📄]      © Sahil Jaganmohan 2026            │
└────────────────────────────────────────────────────────────────────────┘
```
- Left-biased within the centered column (content starts at the column's left, not visually centered) — reads like an intro, not a centered hero. Confirm left vs. center bias (Q-L1, `12`).

### Mobile
```
┌─────────────────────────┐
│ [◐]                  ☰ │
├─────────────────────────┤
│ Hey! 👋🏼 i'm             │
│                         │
│ Sahil                   │
│ Jaganmohan              │   (wraps; fluid --text-3xl shrinks)
│                         │
│ i'm a computer engineer │
│ specializing in         │
│ Embedded Systems▍       │
│                         │
│ currently an Embedded   │
│ Software Engineer at    │
│ Apple since Jan 2023.   │
│                         │
│ my curiosity of...      │
│                         │
│ i'm always interested   │
│ in...                   │
│                         │
│ i've built some cool    │
│ stuff too: projects     │
│ and my github.          │
│                         │
│ take a look at my       │
│ resume.                 │
├─────────────────────────┤
│[✉][in][⌂][gh][📄]       │
│© Sahil Jaganmohan 2026  │
└─────────────────────────┘
```

---

## 2. About `/about`

### Desktop (≥768px) — portrait left, bio right; skillset 3-col grid
```
┌────────────────────────────────────────────────────────────────────────┐
│ [◐]                                          About Experience Proj Blog│  ← "About" active (sienna)
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   About Me                                                             │   ← SectionTitle
│   in more depth                              ← sienna subtitle          │
│                                                                        │
│   ┌───────────┐  ┌───────────────────────────────────────────────────┐ │
│   │           │  │ I was born and raised in New Jersey, and it's... │ │
│   │           │  │                                                  │ │
│   │ [portrait │  │ Ever since I was young, I've loved to play and... │ │
│   │  320×320] │  │                                                  │ │
│   │           │  │ As an outdoor person, I find my way to be...      │ │
│   │           │  │                                                  │ │
│   └───────────┘  │ I have a deep interest in the stock market...    │ │
│                  │                                                  │ │
│                  │ Professionally, I had always had my eyes set... │ │
│                  │                                                  │ │
│                  │ I have completed my undergraduate and masters... │ │
│                  └──────────────────────────────────────────────────┘ │
│                                                                        │
│   Professional Skillset                                                │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                     │
│   │ [icon] Lang │ │ [icon] Embed│ │ [icon] Hard │                     │
│   │ C/C++ Java  │ │ I2C DMA SPI │ │ ASIC Design │   (3-col grid)      │
│   │ Python Go   │ │ UART ESP32  │ │ SystemVerilog│                    │
│   │ JS Swift RB │ │ NVIDIA-CUDA │ │ PCB ARM RTL FPGA                  │
│   └─────────────┘ └─────────────┘ └─────────────┘                     │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                     │
│   │ [icon] Cloud │ │ [icon] DB  │ │ [icon] Frm  │                     │
│   │ Azure AWS    │ │ SQL Oracle │ │ React OpenMP│                     │
│   │ Docker K8s   │ │ MongoDB    │ │ MPI Scikit  │                     │
│   │ Jenkins      │ │            │ │ GraphQL     │                     │
│   └─────────────┘ └─────────────┘ └─────────────┘                     │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│        [✉] [in] [⌂] [gh] [📄]      © Sahil Jaganmohan 2026            │
└────────────────────────────────────────────────────────────────────────┘
```

### Mobile — portrait on top, 1-col skillset
```
┌─────────────────────────┐
│ [◐]                  ☰ │
├─────────────────────────┤
│ About Me                │
│ in more depth           │
│                         │
│      ┌──────────┐       │
│      │ portrait │       │
│      │  ~260px  │       │
│      └──────────┘       │
│                         │
│ I was born and raised...│
│                         │
│ Ever since I was young..│
│                         │
│ As an outdoor person... │
│ I have a deep interest..│
│ Professionally...       │
│ I have completed my...  │
│                         │
│ Professional Skillset   │
│ ┌─────────────────────┐ │
│ │ [icon] Languages    │ │
│ │ C/C++ Java Python.. │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ [icon] Embedded     │ │
│ │ I2C DMA SPI...      │ │
│ └─────────────────────┘ │
│   (1-col, stacked)      │
├─────────────────────────┤
│[✉][in][⌂][gh][📄]       │
└─────────────────────────┘
```

---

## 3. Timeline `/experience` — left-aligned rail

### Desktop
```
┌────────────────────────────────────────────────────────────────────────┐
│ [◐]                                          Home About Projects Blog │ ← "Experience" active
├────────────────────────────────────────────────────────────────────────┤
│   Experience                                                           │
│   full-time & education                                                │
│                                                                        │
│      │                                                                 │
│   ●  2023   ┌────────────────────────────────────────────────────────┐ │
│      │      │ Embedded Software Engineer                             │ │
│      │      │ Apple Inc. · Cupertino, CA                             │ │
│      │      │ Jan 2023 - Present                                    │ │
│      │      │  • Silicon Engineering Group (SEG)                    │ │
│      │      │  • Directed design/development of an embedded app... │ │
│      │      │  • Resulted in a 15% caching improvement...          │ │
│      │      │  • Designed/implemented a live on-device dashboard.. │ │
│      │      │  • Spearheaded the HW bring-up of multiple IP Blocks.│ │
│      │      │  • Led the team in architecting/accelerating a       │ │
│      │      │    custom large-scale data engineering platform...   │ │
│      │      │  • Technologies: C/C++, RTOS, ARM, Python, Rust...  │ │
│      │      └────────────────────────────────────────────────────────┘ │
│      │                                                                 │
│   ●  2022   ┌────────────────────────────────────────────────────────┐ │
│      │      │ Student                                               │ │
│      │      │ Purdue University · West Lafayette, IN                 │ │
│      │      │ MS Fall 2022 · BS Fall 2021                            │ │
│      │      │  • Teaching Assistant: ECE 469 GTA - ...              │ │
│      │      │  • Relevant Courses: ECE 595AA - ...                  │ │
│      │      └────────────────────────────────────────────────────────┘ │
│      │                                                                 │
│   ●  2022   ┌─ Apple intern ────────────────────────────────────────┐  │
│      │      │ • On the Silicon Engineering Group (SEG) ...           │  │
│      │      └────────────────────────────────────────────────────────┘  │
│      │                                                                 │
│   ●  2021   ┌─ L3Harris ────────────────────────────────────────────┐  │
│      │      │ • Developed embedded solutions on an ARM Controller... │  │
│      │      └────────────────────────────────────────────────────────┘  │
│      │                                                                 │
│   ●  2020   ┌─ AT&T ─────────────────────────────────────────────────┐  │
│      │      │ • Worked on AMP, internal metadata search engine...     │  │
│      │      └────────────────────────────────────────────────────────┘  │
│      │                                                                 │
│   ●  2019   ┌─ CME Group ────────────────────────────────────────────┐  │
│      │      │ • Worked with Order Entry division of the GLOBEX...     │  │
│      │      │ • 2019 CME CodeUp — Won 3rd Place...                    │  │
│      │      └────────────────────────────────────────────────────────┘  │
│      │                                                                 │
│      ▼                                                                 │
├────────────────────────────────────────────────────────────────────────┤
│        [✉] [in] [⌂] [gh] [📄]      © Sahil Jaganmohan 2026            │
└────────────────────────────────────────────────────────────────────────┘
```
- `●` = node in the company color (Apple blue, Purdue gold, L3Harris red, AT&T orange, CME blue). Year above the node in the same color. The rail (`│`) is a continuous `border-left`.

### Mobile — same structure (the whole point of left-aligned)
```
┌─────────────────────────┐
│ [◐]                  ☰ │
├─────────────────────────┤
│ Experience              │
│ full-time & education   │
│                         │
│  │                      │
│ ● 2023                  │
│  │ ┌──────────────────┐ │
│  │ │ Embedded SW Eng  │ │
│  │ │ Apple · Cupertino │ │
│  │ │ Jan 2023-Present  │ │
│  │ │ • SEG...          │ │
│  │ │ • Directed...     │ │
│  │ └──────────────────┘ │
│  │                      │
│ ● 2022                  │
│  │ ┌──────────────────┐ │
│  │ │ Student          │ │
│  │ │ Purdue...        │ │
│  │ └──────────────────┘ │
│  ⋮                      │
├─────────────────────────┤
│[✉][in][⌂][gh][📄]       │
└─────────────────────────┘
```
The rail's left offset shrinks via the gutter on mobile; cards fill remaining width. **No layout reflow** between breakpoints — the same markup/CSS works.

---

## 4. Projects `/projects` — card grid

### Desktop (3-col)
```
┌────────────────────────────────────────────────────────────────────────┐
│ [◐]                                          Home About Experience Blog│ ← "Projects" active
├────────────────────────────────────────────────────────────────────────┤
│   Projects                                                             │
│   stuff i've worked on                                                 │
│                                                                        │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │
│   │ [img 5:3]    │ │ [img 5:3]    │ │ [img 5:3]    │                    │
│   ├──────────────┤ ├──────────────┤ ├──────────────┤                    │
│   │ Project One  │ │ Project Two  │ │ Project Three│                    │
│   │ Short desc...│ │ Short desc...│ │ Short desc...│                    │
│   │ [tag][tag]   │ │ [tag][tag]   │ │ [tag][tag]   │                    │
│   │ more ↗       │ │ more ↗       │ │              │                    │
│   └──────────────┘ └──────────────┘ └──────────────┘                    │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │
│   │ Project Four │ │ Project Five │ │ Project Six  │                    │
│   │ [tag][tag]   │ │ [tag]        │ │ [tag][tag]   │                    │
│   │              │ │ more ↗       │ │              │                    │
│   └──────────────┘ └──────────────┘ └──────────────┘                    │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │
│   │ Project Seven│ │ Project Eight│ │ Project Nine │                    │
│   │ [tag][tag]   │ │ [tag][tag]   │ │ [tag]        │                    │
│   │ more ↗       │ │ more ↗       │ │ more ↗       │                    │
│   └──────────────┘ └──────────────┘ └──────────────┘                    │
├────────────────────────────────────────────────────────────────────────┤
│        [✉] [in] [⌂] [gh] [📄]      © Sahil Jaganmohan 2026            │
└────────────────────────────────────────────────────────────────────────┘
```
- Cards equal-height per row; tags pinned to the bottom. Images lazy-load.

### Mobile (1-col)
```
┌─────────────────────────┐
│ [◐]                  ☰ │
├─────────────────────────┤
│ Projects                │
│ stuff i've worked on    │
│ ┌─────────────────────┐ │
│ │ [img 5:3]           │ │
│ │ Project One         │ │
│ │ Short description...│ │
│ │ [tag][tag][tag]     │ │
│ │ more ↗              │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ [img] Project Two...│ │
│ └─────────────────────┘ │
│   (stacked)             │
├─────────────────────────┤
│[✉][in][⌂][gh][📄]       │
└─────────────────────────┘
```

---

## 5. Blog `/blog`

### Desktop
```
┌────────────────────────────────────────────────────────────────────────┐
│ [◐]                                          Home About Experience Proj│ ← "Blog" active
├────────────────────────────────────────────────────────────────────────┤
│   Blog                                                                 │
│   writing, notes, and elsewhere                                       │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────────┐ │
│   │ [img] Sahil Jaganmohan · Aug 01, 2026                            │ │
│   │ My first published essay (on Medium)             ↗ external       │ │
│   │ A short teaser shown on the blog index; clicking opens the       │ │
│   │ external article.                                                │ │
│   └──────────────────────────────────────────────────────────────────┘ │
│   ┌──────────────────────────────────────────────────────────────────┐ │
│   │ [img] Sahil Jaganmohan · Jul 15, 2026                            │ │
│   │ Designing a low-latency dashboard                  (internal)     │ │
│   │ Excerpt of an internal post...     [engineering] [performance]   │ │
│   └──────────────────────────────────────────────────────────────────┘ │
│   ⋮                                                                    │
│                                                                        │
│   Elsewhere                                                            │  ← hidden if site.elsewhere=[]
│   [Medium ↗]  [GitHub ↗]  [Substack ↗]                                  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│        [✉] [in] [⌂] [gh] [📄]      © Sahil Jaganmohan 2026            │
└────────────────────────────────────────────────────────────────────────┘
```
- Each card is a full-card link (`<a>`). External → opens new tab + `↗ external` marker; internal → `/blog/<slug>`.

### Mobile — 1-col list
```
┌─────────────────────────┐
│ [◐]                  ☰ │
├─────────────────────────┤
│ Blog                    │
│ writing, notes...       │
│ ┌─────────────────────┐ │
│ │[img] Sahil · Aug 01 │ │
│ │My first published   │ │
│ │essay (on Medium)  ↗ │ │
│ │A short teaser...    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │[img] Sahil · Jul 15 │ │
│ │Designing a low-...  │ │
│ │[engineering]        │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│[✉][in][⌂][gh][📄]       │
└─────────────────────────┘
```

---

## 6. Blog post `/blog/{slug}`

### Desktop
```
┌────────────────────────────────────────────────────────────────────────┐
│ [◐]                                          Home About Experience Proj│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   Designing a low-latency dashboard              ← H1                   │
│   [img] Sahil Jaganmohan · July 15, 2026         ← author + date        │
│   [engineering] [performance]                     ← tags               │
│                                                                        │
│   ┌─ On this page ─────────────────────────────────┐                   │
│   │  1. Why latency matters                       │  ← TOC (H2 only)   │
│   │  2. The architecture                          │   auto-generated   │
│   │  3. Results                                   │                   │
│   └────────────────────────────────────────────────┘                   │
│                                                                        │
│   ## Why latency matters                       ← body (.prose)         │
│   Latency is the time between...                                       │
│                                                                        │
│   ## The architecture                                                  │
│   The system is split into...                                          │
│   - collection                                                         │
│   - aggregation                                                        │
│                                                                        │
│   ![diagram](diagram.png)   ← co-located image, future use (Q14)      │
│                                                                        │
│   ## Results                                                           │
│   We observed a 500% improvement...                                   │
│                                                                        │
│   ← back to blog                                                       │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│        [✉] [in] [⌂] [gh] [📄]      © Sahil Jaganmohan 2026            │
└────────────────────────────────────────────────────────────────────────┘
```
<!-- COMMENT: It should be H1 And H2 shown here. "Up to H2 heading shown" -->

### Mobile — TOC collapses
```
┌─────────────────────────┐
│ [◐]                  ☰ │
├─────────────────────────┤
│ Designing a low-        │
│ latency dashboard       │
│ [img] Sahil · Jul 15    │
│ [engineering]           │
│                         │
│ ▾ On this page          │ ← <details>, no JS
│   (tap to expand)       │
│                         │
│ ## Why latency matters  │
│ Latency is the time...  │
│                         │
│ ## The architecture     │
│ The system is split...  │
│                         │
│ ## Results              │
│ We observed a 500%...   │
│                         │
│ ← back to blog          │
├─────────────────────────┤
│[✉][in][⌂][gh][📄]       │
└─────────────────────────┘
```

---

## 7. Error page (`_error.tsx` — 404 + 500)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [◐]                                          About Experience Proj Blog│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                                                                        │
│                          404: Not Found                                │
│                                                                        │
│           You just hit a route that doesn't exist...                   │
│                          the sadness.                                  │
│                                                                        │
│                       ← back home                                      │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│        [✉] [in] [⌂] [gh] [📄]      © Sahil Jaganmohan 2026            │
└────────────────────────────────────────────────────────────────────────┘
```
Message per the design (Q20); themed; one home link.

---

## 8. The pixel-art mosaic background (concept — Q6, last priority)

A fixed, muted "digital mosaic" of **mountains over an ocean** behind all pages. Rough pixel sketch (16×8 conceptual grid; real SVG uses more tiles):

```
pixel palette (muted, harmonize with #11305c):
  sky   : #163a6b   (#11305c lightened)
  far mtn: #1a4a7e
  near mtn: #1f5a96
  sea light: #2a6ba0
  sea dark : #15457a

  ┌────────────────────────────────────────┐
  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ sky band
  │ ░░░░░░▓▓▓▓▓▓░░░░░░░▓▓▓░░░░░░░░░░░░░░░ │ far mountains (stepped pixels)
  │ ░░░░▓▓▓▓░░░░▓▓▓▓▓▓░░░░░▓▓▓▓▓▓░░░░░░░░ │
  │ ░░▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓░░░░ │ near mountains
  │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │ sea (light)
  │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ sea (dark)
  └────────────────────────────────────────┘
         opacity ~0.5, z-index -1, fixed, behind content
```

- Implemented as an inline `<svg>` of `<rect>` tiles (per `01` §6). Brightest tile (`#2a6ba0`) still gives white text ≥ AA contrast at body sizes (verified — body sits over darker bands; cards sit on `--color-surface`).
- The whole layer is off until you flip `--bg-mosaic-opacity` > 0 (built last; site looks correct with it off).

---

## 9. Cross-cutting layout rules (visual language)

1. **Centered column** for prose pages (`/`, `/about`, `/blog`, `/blog/*`): `max-width: var(--content-max)` (~736px). Wider `--content-max-wide` (~960px) for `/experience` + `/projects`.
2. **Section titles** (`SectionTitle`) on every non-landing page: big H1 + sienna subtitle, left-aligned, `--space-12` top margin. Landing has its own hero (no `SectionTitle`).
3. **Cards** (`.card`) share surface bg, border, radius, shadow — used by project, blog, and timeline cards for one consistent "container" look.
4. **Tags** appear on projects (colored, from JSON) and blog posts (ghost/outline style). Same `.tag` base, two variants.
5. **Mono font** (`--font-mono` = IBM Plex Mono) for: dates, nav links, tag pills, captions, footer copyright, "more ↗" links — the "engineering" accent. Body uses `--font-body` (Inter/Geist/PP Neue Montreal).
6. **Gutter** (`--gutter`, fluid) is the only horizontal padding — consistent side spacing everywhere.
7. **Sticky header** stays at top; all `#id` anchors have `scroll-margin-top: 4-5rem` so jumps clear it.

---

## 10. Layout open questions (→ `12_open_questions.md`)

- **L1** Landing: left-bias the content within the centered column (recommended) or center it?
- **L2** Projects/timeline: use `--content-max-wide` (960px) — confirm vs. the prose `--content-max` (736px).
- **L3** Should project cards have a subtle hover-lift (translateY) or just shadow change? (Recommended: shadow only — less motion.)

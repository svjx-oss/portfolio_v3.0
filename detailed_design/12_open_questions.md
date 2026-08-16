# 12 — Open Questions & Resolutions Log

> Living log. **Part A** records the foundational decisions. **Part B** records resolutions to the questions raised during detailed design. **Part C** records confirmations. Items still genuinely open (few) are marked 🟡.

---

## PART A — FOUNDATIONAL DECISIONS (locked)

| Q | Decision |
|---|---|
| Q1 | **Deno + Fresh** (not Lume). No Tailwind. |
| Q2/Q3 | **SSR** on **Deno Deploy** (not static SSG). |
| Q4 | **GA4** direct + custom event layer (see doc `10`). PostHog documented as upgrade path. |
| Q5 | Fonts **Inter / Geist Sans / PP Neue Montreal**, switchable from one location (`theme.css` `--font-body`/`--font-heading`). PP Neue Montreal is commercial (license required). |
| Q6 | **Muted pixel-art mosaic** (mountains + ocean), blends in, non-interfering. **Last priority.** |
| Q7 | **Left-aligned timeline** (not zig-zag — mobile-friendly). Year highlighted on the rail. |
| Q8 | **Drop** the professional/personal toggle. Simple project cards. |
| Q9 | **Separate `file` (local) and `url` (external) fields** per project. No per-project markdown file. |
| Q10 | Content authored by the site owner into `content/` files; may change before deploy. Docs specify schemas/structure only. |
| Q11 | Blog fields **required unless hyperlink**: author `[img] Name` (via `authors.json`), manual slug, tags, status (draft/published), explicit excerpt. External-link entries need only title/author/date/excerpt/external_url. |
| Q12 | TOC **auto-generated** from H2, top of page, collapses on mobile via native `<details>` (no JS). H3+ excluded. |
| Q13 | External blog entries: index shows excerpt+date+author; click **redirects** to external site (new tab). No `/blog/{slug}` for them. |
| Q14 | Markdown image support future-proofed. Co-located: `posts/<slug>/<slug>.md` + `posts/<slug>/image01.png`. Asset route ships day one. |
| Q15 | Strict build-time validation + Deno Deploy "keep last good deploy." |
| Q16 | `deno fmt` + `deno lint`. |
| Q17 | `strict: true` TS. |
| Q18 | Only carry the current resume PDF. |
| Q19 | Carry over only assets actually referenced. |
| Q20 | Custom themed 404 + home link. |
| Q21 | Keep bitmoji as the logo. |
| Q22 | No Tailwind — plain CSS (tag colors via hex in JSON + inline style). |
| Q23 | Routes: `/`, `/about`, `/experience` (kept, not renamed), `/projects`, `/blog`, `/blog/{slug}`. |

---

## PART B — DESIGN-QUESTION RESOLUTIONS (from review)

### B1. Navigation
- **N1** Drop "Home" from top-right inline nav (logo = home), keep in mobile menu. → **Yes.**
- **N2** `<details>`-based no-JS fallback for mobile menu (island only enhances). → **Yes.**
- **N3** "Back to top" affordance on long pages. → **No.**

### B2. Layout
- **L1** Landing content: **left-bias** within the centered column.
- **L2** `/experience` + `/projects` use the wider `--content-max-wide` (960px) — **yes**, keeping mobile viewing in mind (fluid scales auto-shrink on small screens).
- **L3** Project card hover: **shadow-only** (no translateY lift).

### B3. Content / porting
- **C1** About per-paragraph color: **opt-in** via `<span class="pop-green">` (etc.); classic colors by default. The escape hatch is documented in `02` §3 and `01` §2.4.
- **C2** Skillset `icon` field: **keep** (small inline-SVG set in `icons.tsx`).
- **C3** Old project URL specifics: **not carried / not cared about** — old project stuff is authored fresh by the owner.

### B4. Timeline
- **T1** Inline company-name highlights inside bullets: **neutral bold** (company color already on year + company line).
- **T2** Year node as clickable deep-link anchor: **no** (YAGNI).

### B5. Projects
- **P1** Drop fixed-height scrollable description (natural height): **yes.**
- **P2** Convert project images to `.webp`: **defer.**
- **P3** Old project URL specifics: **not cared about** (same as C3).

### B6. Blog
- **B (sort)** Sort by `date` desc (manual control). → **Yes.**
- **B (draft preview)** Hidden `/blog?drafts=1` route: **defer** (use `deno task dev` locally).
- **B (RSS)** Add an RSS feed (`/blog/feed.xml`): **yes.** *(Add to doc `08` as a small extra route — see note below.)*

### B7. Analytics
- **A1** Suppress GA4 on localhost: **yes.**
- **A2** Landing in-body "Apple"→`/experience` link: **`cta_click`.**
- **A3** Cookie/consent banner: **skip** for v1.
- **A4** Document GA4 saved Explorations: **yes** (in `11` §19).

### B8. Maintenance
- **R1** Resume path single-sourced via a `{resume}` template token substituted from `site.json` at render: **yes.** (Landing markdown uses `{resume}`; `loadLanding()` resolves it from `site.json`. Prevents drift.)
- **R2** `deno task check` as a git pre-push hook: **yes** (document + provide an optional hook).

---

## PART C — CONFIRMATIONS

1. Only the current resume PDF is carried (no older-resumes archive page). → **Yes.**
2. Blog starts empty ("No posts yet — check back soon."). → **Yes.**
3. Unused starter/legacy files are not carried. → **Yes.**
4. Unused images are not carried. → **Yes.**
5. Favicon generated from the bitmoji for now. → **Yes.**
6. Production domain: confirm later; use a placeholder canonical in `site.json` for now. → **Yes.**

---

## PART D — ITEMS ADDED BY THE RESOLUTIONS (to implement)

- **RSS feed** (B6): add `routes/blog/feed.xml.ts` rendering the published posts to RSS 2.0 XML. ~30 lines; uses `loadBlogIndex()`. Documented in `08` as a supplementary route.
- **`{resume}` token** (R1): `loadLanding()` substitutes `{resume}` in the landing markdown body with `site.resume` before rendering. Documented in `02` §2 and `11` §18.
- **Optional pre-push hook** (R2): a `.githooks/pre-push` running `deno task check`, with install instructions in `11`.

---

## PART E — RESOLVED (from review)

- **E1** PP Neue Montreal — **no license owned**; keep its `@font-face` block **commented out** in `theme.css`. Inter / Geist Sans remain the active options; the switch point (`--font-body` / `--font-heading`) still works — reorder those two to switch. If a license is acquired later, drop files in `static/fonts/` and uncomment the block.
- **E2** Pixel-art mosaic art direction — **deferred**; finalized when built (last milestone, per `01` §6 / `09` §8). Site ships correct on plain `#11305c` until then.
- **E3** Production domain — **use a placeholder** in `content/site.json` (`url`) with a `// TODO` marking it for replacement before launch. `Seo` reads this value for canonical/OG tags.

---

## Document index
- `high_level_designs/00_high_level_architecture.md` ✓
- `high_level_designs/01_theme_and_design_system.md` ✓
- `high_level_designs/02_content_data_model.md` ✓
- `high_level_designs/03_layout_and_navigation.md` ✓
- `high_level_designs/09_wireframes.md` ✓
- `pages/04_page_landing.md` ✓
- `pages/05_page_about.md` ✓
- `pages/06_page_timeline.md` ✓
- `pages/07_page_projects.md` ✓
- `pages/08_page_blog.md` ✓
- `addons/10_analytics.md` ✓
- `addons/11_build_deploy_maintenance.md` ✓
- `12_open_questions.md` (this file) ✓

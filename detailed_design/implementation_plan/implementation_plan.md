# Implementation Plan

> High-level breakdown of the development process into reviewable, testable jj commits. Each commit is **independent** (applies cleanly), **small** (a reviewer can eyeball it in minutes), and **testable** (you can run `deno task dev` and/or `deno test` to verify it).
>
> **VCS policy:** This project uses **jj (Jujutsu)** exclusively. No `git` commands. Each step below is one jj commit. The workflow:
> - Start each commit on a new change: `jj new` (creates a new working-copy change).
> - Make the changes described.
> - Describe it: `jj describe -m "feat: landing page"`.
> - Run `deno task check` (the gate — fmt + lint + types + tests + validate).
> - Review in `deno task dev` (visual checks).
> - When ready to move on: `jj new` starts the next change. The previous one is preserved in jj's log.
> - To share/push: `jj git push` (jj wraps a git backend for remote hosting like GitHub/Deno Deploy, but you never invoke `git` directly).
> - To review a specific commit in isolation: `jj edit <change-id>` puts that change in the working copy.
>
> **Conventions:**
> - Each commit ships with its own tests where applicable (see `detailed_design/addons/12b_testing_strategy.md`). `deno test` is green from commit 4 onward.
> - Each commit lists **Visual checks** (what to look at in `deno task dev`) and **Automated checks** (`deno test` files that ship with it).
> - Stub/placeholder content is used in early commits so each step is testable without the real content. **TODO comments** mark every place you'll later replace stubs with real content — grep `TODO(content)` to find them all.
> - You may interleave content-authoring commits between these as you see how things look; the plan accounts for that.
> - jj commit messages are prefixed `feat:` / `chore:` / `test:` / `refactor:` / `docs:` per Conventional Commits.
>
> **Reading order:** commits 1–3 are foundation (skeleton + tooling), 4–6 are the shared chrome (every page depends on these), 7–12 are the pages (one per route), 13–16 are cross-cutting features, 17 is cleanup.

---

## Phase 1 — Foundation (commits 1–3)

### Commit 1 — `chore: scaffold cleanup + project config`
**What:** Strip the Fresh starter demo files and configure the project for our site.

Changes:
- Delete `components/Button.tsx`, `islands/Counter.tsx`, `routes/api/[name].tsx`, `static/logo.svg`.
- Replace `assets/styles.css` content with a single comment header (will be filled in commit 6).
- Update `deno.json`: rename `start` → `preview`, add `validate` task, add `deploy` block (placeholders), add content/markdown deps to `imports` (`markdown-it`, `markdown-it-anchor`, `sanitize-html`, `zod`).
- Create `utils.ts` `State` interface with `site?: Site` field (forward declaration; `Site` type comes in commit 5).
- `routes/index.tsx`: replace the counter demo with a plain `<h1>Portfolio</h1>` placeholder.
- Add `.github/workflows/ci.yml` running `deno task check`.
- Add `README.md` note pointing to `detailed_design/`.

**Visual checks:** `deno task dev` loads at `localhost:5173`, shows "Portfolio" heading, no console errors.
**Automated checks:** `deno task check` passes (fmt + lint + type-check). No tests yet.

---

### Commit 2 — `feat: content layer scaffolding + stub fixtures`
**What:** Create the `content/` directory structure with stub content and a fixture tree for tests.

Changes:
- Create `content/` with **stub** files following the schemas in `detailed_design/02`:
  - `content/site.json` — minimal valid site (title "Sahil Jaganmohan", placeholder `url: "https://TODO.example.com"` with `// TODO(content): replace with real domain`, nav, social, `ga4_id: ""`).
  - `content/landing.md` — stub with the frontmatter fields + one placeholder paragraph + `{resume}` token.
  - `content/about.md` — stub with one skillset group + one placeholder bio paragraph.
  - `content/timeline/timeline.json` — one stub role + `content/timeline/stub-role.md`.
  - `content/projects/projects.json` — one stub project + a minimal `colors` map.
  - `content/blog/blog.json` — `{"entries": []}` + `content/blog/authors.json` with one author.
- Every stub file gets a top `<!-- TODO(content): replace with real content -->` comment.
- Create `test/fixtures/content/` — a valid minimal tree (copies of the stubs, used by tests in commits 4–6). This is the canonical "known-good" fixture.
- Add `lib/paths.ts` — resolves `content/` and `static/` paths from repo root.
- Add `lib/types.ts` — all shared TS interfaces (`Site`, `LandingFrontmatter`, `About`, `TimelineEntry`, `Project`, `BlogEntry`, `BlogPost`, `Heading`).

**Visual checks:** none (no UI yet).
**Automated checks:** `deno check` passes (types are sound). No tests yet (validate.ts comes in commit 4).

---

### Commit 3 — `feat: markdown rendering pipeline`
**What:** The markdown → HTML + headings extractor, with sanitization. Pure logic, fully tested.

Changes:
- `lib/markdown.ts` — `renderMarkdown(raw, opts?)` using `markdown-it` + `markdown-it-anchor`, sanitizer, relative-image rewrite for blog slugs. Returns `{ html, headings }`.
- `lib/markdown.test.ts` — the test matrix from `12b` §1.2 (plain md, H2/H3 ids, headings extraction, script stripping, `<span class="pop-*">` kept, image rewrite, GFM table/strikethrough).
- Wire `markdown-it` + `sanitize-html` + `markdown-it-anchor` into `deno.json` imports (already added in commit 1; confirm they resolve with `deno install`).

**Visual checks:** none (pure logic).
**Automated checks:** `deno test lib/markdown.test.ts` — all cases pass.

---

## Phase 2 — Shared chrome (commits 4–6)

### Commit 4 — `feat: content validation gate`
**What:** The no-downtime backbone. Schemas + cross-file checks + the `deno task validate` command. Fully tested.

Changes:
- `lib/validate.ts` — zod schemas for every content file; cross-file checks (file existence via `Deno.statSync`, author refs, tag existence, unique slugs, duplicate `md`); collects all errors; prints a clear report with "did you mean?" hints; exits non-zero.
- `lib/validate.test.ts` — the test matrix from `12b` §1.1 (valid fixture passes; each malformed variant rejects with the right error).
- Add `validate` to the `check` task (so `deno task check` now runs fmt + lint + type-check + **test** + **validate**).
- Run `deno task validate` against the stub `content/` — must pass (the stubs are valid by construction from commit 2).

**Visual checks:** none.
**Automated checks:** `deno test` (all) + `deno task validate` both pass. Verify a deliberate typo in a fixture rejects with a clear message, then revert.

---

### Commit 5 — `feat: content loaders + site middleware`
**What:** The typed loaders that read `content/` → objects, plus the `_middleware.ts` that populates `ctx.state.site`. Fully tested.

Changes:
- `lib/loadContent.ts` — `loadSite()`, `loadLanding()`, `loadAbout()`, `loadTimeline()`, `loadProjects()`, `loadBlogIndex()`, `loadBlogPost(slug)`. Each reads from `content/`, calls `renderMarkdown` where needed, returns typed objects. `loadSite()` is what the middleware uses.
- `lib/loadContent.test.ts` — the matrix from `12b` §1.3 against the fixture tree (all loaders return correct shapes; blog sorts newest-first; drafts excluded; missing/draft slug → null).
- `routes/_middleware.ts` — `define.middleware` that `await`s `loadSite()` and sets `ctx.state.site`. (Throws clear error if `site.json` is malformed — caught by `_error.tsx` once that lands in commit 6.)
- Update `utils.ts` `State` to include `site: Site` (now that `Site` exists in `lib/types.ts`).

**Visual checks:** none yet (no pages consume the data until commit 7+).
**Automated checks:** `deno test` (all loaders) passes.

---

### Commit 6 — `feat: app shell, theme, layout chrome, error page`
**What:** The shared visual foundation every page inherits: `_app.tsx`, `_error.tsx`, the theme tokens, the Header/Footer/Seo/Nav components, and global CSS. After this commit, every page automatically has the chrome.

This is the largest single commit (it's the visual skeleton). It's one commit because the pieces are interdependent — Header needs Nav, Footer needs `site.social`, Seo needs `site`, all need the theme tokens. Splitting would leave the site half-styled between commits.

Changes:
- `assets/theme.css` — all design tokens (colors, fonts with `@font-face` for Inter/Geist/IBM Plex Mono, PP Neue Montreal commented out, spacing, type scale, breakpoints, mosaic opacity var at 0).
- `assets/global.css` — reset + base element styles.
- `assets/layout.css` — header/nav/footer chrome.
- `assets/components.css` — shared `.card`, `.tag`, `.btn`, `.author-badge`, `.section-title`, `.prose` styles.
- `client.ts` — import all CSS files in order (replacing the stub from commit 1).
- `routes/_app.tsx` — `define.page` reading `ctx.state.site`, rendering `<html><head>` (Seo) + Layout (Header/Nav/Footer) around `<ctx.Component />`.
- `routes/_error.tsx` — unified themed error page (404 + 500) with the verbatim 404 message + a home link. Renders inside `_app.tsx` so chrome is consistent.
- `main.ts` — add `app.notFound()` + `app.onError()` registrations rendering `_error.tsx`. Remove the scaffold's demo middleware + `/api2` route.
- `components/Seo.tsx` — `<head>` meta from `site` + `url` (title, description, OG, canonical with the TODO placeholder domain, font preloads). GA4 snippet gated on `ga4_id` non-empty **and** hostname ≠ `localhost` (the A1 rule — no GA4 in dev).
- `components/Layout.tsx` — wraps Header + `<main>` + Footer.
- `components/Header.tsx` — sticky bar, bitmoji logo (left), Nav (right). Active-link state by current path.
- `components/Nav.tsx` — top-right inline links (desktop ≥768px). `Home` omitted from inline (logo is home); full list in the mobile menu (commit 13).
- `components/Footer.tsx` — social icon row from `site.social` + resume link from `site.resume` + dynamic copyright year.
- `components/icons.tsx` — inline SVG set (mail, linkedin, github, home, document, external-link).
- `components/SectionTitle.tsx` — shared "H1 + sienna subtitle" pattern.
- Drop a `static/favicon.ico` (generated from bitmoji per C-CONFIRM-5) and wire the `<link rel="icon">` in Seo.

**Visual checks:** Load `/` — shows the placeholder `<h1>Portfolio</h1>` from commit 1, but now **wrapped in the full chrome**: sticky header with bitmoji + nav links, footer with social icons, themed navy background, Inter font. Resize to mobile — nav links hide (hamburger comes in commit 13; for now mobile shows no inline nav, which is fine). Hit a bad URL like `/nope` — themed `_error.tsx` renders with the 404 message.
**Automated checks:** `deno task check` (incl. `validate`) passes. No new test files (chrome is visual).

---

## Phase 3 — Pages (commits 7–12)

Each page commit follows the same shape: route handler + page component(s) + page-specific CSS. Content comes from the stubs (commit 2); you can swap in real content at any point.

### Commit 7 — `feat: landing page`
**What:** `/` route renders `content/landing.md` with the typewriter island.

Changes:
- `routes/index.tsx` — `define.handlers` calling `loadLanding()` + `define.page` rendering `<Landing>`.
- `components/Landing.tsx` — eyebrow, hero name, specialty prefix, `<Typewriter>`, prose body (with `{resume}` token substituted by `loadLanding()`).
- `islands/Typewriter.tsx` — rotating-strings island with `preact/hooks`, `prefers-reduced-motion` honored.
- `assets/landing.css` — hero typography, left-biased layout (L1), prose spacing.
- Substitute `{resume}` in `loadLanding()` before rendering (R1 single-sourcing).

**Visual checks:** `/` shows the stub eyebrow/name/typewriter cycling stub strings/body. Typewriter animates, loops. `prefers-reduced-motion` (toggle in DevTools → Rendering) freezes it on the first string. Resume link points to the stub PDF path. Click nav links → navigate to other pages (still placeholders).

---

### Commit 8 — `feat: about page`
**What:** `/about` renders `content/about.md` — portrait + bio + skillset grid.

Changes:
- `routes/about.tsx` — handler + page.
- `components/AboutPage.tsx` — SectionTitle + portrait img + prose bio + skillset grid.
- `components/SkillCard.tsx` — card with optional icon (from `icons.tsx`) + label + items.
- `assets/about.css` — portrait-beside-bio on desktop, stacked on mobile; skill grid 1→2→3 cols.

**Visual checks:** `/about` shows stub portrait + stub bio paragraph + one skillset card. Resize: portrait stacks above bio on mobile; grid goes 1→2→3 cols. "About" nav link is active (sienna).

---

### Commit 9 — `feat: timeline page`
**What:** `/experience` renders the left-aligned timeline from `timeline.json` + per-role markdown.

Changes:
- `routes/experience.tsx` — handler + page.
- `components/TimelinePage.tsx` — SectionTitle + `<ol class="timeline__rail">` of `TimelineEntryView`.
- `components/TimelineEntry.tsx` (or inline `TimelineEntryView`) — node + year (company color via `--node-color`) + card (role/company/dates + prose bullets).
- `assets/timeline.css` — left rail (`border-left`), absolute-positioned dots, year above node, card to the right; same structure mobile→desktop.

**Visual checks:** `/experience` shows the one stub role: a colored dot on the left rail, year above it, card with role/company/dates + the stub bullets. Resize to mobile — same layout, just narrower (no reflow). "Experience" nav link active.

---

### Commit 10 — `feat: projects page`
**What:** `/projects` renders the card grid from `projects.json`.

Changes:
- `routes/projects.tsx` — handler + page.
- `components/ProjectsPage.tsx` — SectionTitle + responsive grid.
- `components/ProjectCard.tsx` — image + title + description + tags + optional "more ↗" link (`file` or `url`).
- `components/Tag.tsx` — colored pill with auto dark/light text via `luminance()` helper. Extract `luminance` to `lib/luminance.ts` + `lib/luminance.test.ts` (the matrix from `12b` §1.4) since it's pure logic.
- `assets/projects.css` — grid 1→2→3 cols, card hover shadow-only (L3), tags pinned bottom.

**Visual checks:** `/projects` shows the one stub project card with its colored tags. Tag text is dark on light pills, light on dark pills. "more ↗" link points to the stub `file`/`url`. Hover → shadow change only.
**Automated checks:** `deno test lib/luminance.test.ts` passes.

---

### Commit 11 — `feat: blog index page`
**What:** `/blog` renders the entry list from `blog.json` (empty initially → "No posts yet" message).

Changes:
- `routes/blog/index.tsx` — handler + page.
- `components/BlogList.tsx` — SectionTitle + empty-state message + `<ul>` of `BlogCard` + `ElsewhereSection` (hidden when `site.elsewhere` is empty).
- `components/BlogCard.tsx` — full-card link; internal post → `/blog/<slug>`, external → `external_url` new tab; author badge + date + excerpt + tags (posts only) + "↗ external" marker (links).
- `components/AuthorBadge.tsx` — circular avatar + name.
- `assets/blog.css` — card list, author badge, ghost tags, elsewhere row.

**Visual checks:** `/blog` shows "No posts yet — check back soon." (entries are empty). Add one stub `post` entry to `blog.json` locally → card appears with author badge, date, excerpt, tags. Add one `link` entry → card with "↗ external" marker, opens new tab. Revert stubs.
**Automated checks:** `deno task validate` still passes (the stub `blog.json` is valid empty).

---

### Commit 12 — `feat: blog post page + TOC + asset route`
**What:** `/blog/{slug}` renders a post with the auto-generated H2 TOC; `/blog/{slug}/{asset}` serves co-located images.

This is split from commit 11 because the post page has distinct machinery (TOC, asset route, draft 404ing) worth reviewing separately.

Changes:
- `routes/blog/[slug].tsx` — handler: `loadBlogPost(slug)` → `throw new HttpError(404)` if null/draft; `define.page` rendering `<PostView>`.
- `components/PostView.tsx` — title + author badge + date + tags + `<details>` TOC (H2 anchors) + prose body + "← back to blog".
- `routes/blog/[slug]/[asset].tsx` — image-type-allowlisted file server (the snippet from `08` §4).
- `assets/blog.css` — append post-specific styles (title, meta, TOC `<details>`, prose anchors `scroll-margin-top`).

**Visual checks:** Add a stub post: drop `content/blog/posts/stub-post/stub-post.md` with a couple `## H2`s + one `![](test.png)` + a `test.png`, add the entry to `blog.json`. Load `/blog/stub-post` — title, author, date, TOC (collapsed on mobile via `<details>`, expanded on desktop), prose, image renders. Click a TOC anchor → jumps with the sticky header cleared. Hit `/blog/nonexistent` → themed 404. Set the entry `status: "draft"` → `/blog/stub-post` 404s; index hides it. Revert stubs.

---

## Phase 4 — Cross-cutting features (commits 13–16)

### Commit 13 — `feat: mobile navigation island`
**What:** The `<details>`-based mobile menu, enhanced by a `MobileNav` island.

Changes:
- `islands/MobileNav.tsx` — toggles `aria-expanded` + animates; progressive enhancement over the `<details>` base.
- Update `components/Header.tsx` / `Nav.tsx` to render the `<details class="nav-mobile">` markup on mobile (hidden on ≥768px via CSS), with `MobileNav` as the island.
- `assets/layout.css` — mobile nav panel styles (slide-down, full-width, `--color-bg-2`).

**Visual checks:** Resize to <768px — hamburger appears top-right. Tap → panel slides down with all nav links (including Home). Tap a link → navigates, menu closes. Disable JS → `<details>` still opens/closes natively (the no-JS guarantee, N2). Active link highlighted.

---

### Commit 14 — `feat: GA4 pageview analytics`
**What:** The gtag snippet + pageview tracking. First of two analytics commits.

Changes:
- Set a real `ga4_id` in `content/site.json` (or leave `""` and document where to set it — TODO(content)).
- `components/Seo.tsx` — emit the gtag snippet (already gated from commit 6; this commit confirms the snippet renders when `ga4_id` is set + hostname ≠ localhost).
- Verify in DevTools Network tab that `page_view` hits fire on navigation.

**Visual checks:** With a real `ga4_id`, load a page → Network tab shows GA4 `collect` hits. On `localhost` → no hits (A1 suppression). In GA4 Realtime → see yourself.
**Automated checks:** none (network-call verification is manual per `12b` §3).

---

### Commit 15 — `feat: analytics custom-event delegation`
**What:** The delegated click listener classifying clicks into the event taxonomy (`nav_click`, `cta_click`, `outbound_click`, `resume_download`, `project_file_open`, `blog_open`, `blog_outbound`, `toc_click`, `scroll_depth`). Second of two analytics commits.

Changes:
- `lib/analytics.ts` — `initAnalytics()` delegated listener + classifier + `gtag('event', ...)` calls (no-op if gtag absent). `data-event` hint support.
- `islands/Analytics.tsx` — a tiny island that calls `initAnalytics()` in a `useEffect(..., [])` on mount. (Island over inline-script: type-checked, bundled/testable, and the Preact runtime is already shipped by the Typewriter + MobileNav islands, so the marginal cost is ~1KB of the analytics logic itself — no extra runtime. Events happen on user interaction, which is always after hydration, so the later timing is irrelevant.)
- `scroll_depth` via `IntersectionObserver`/throttled scroll.
- `toc_click` via delegated anchor-click detection on blog posts.
- Mount `<Analytics />` once in `_app.tsx` (inside `<body>`).

**Visual checks:** With GA4 on, click around → Network tab shows `collect` hits with the right `en` (event name) params. Click nav → `nav_click`. Click resume → `resume_download`. Click an external project link → `outbound_click`. Scroll a blog post → `scroll_depth` fires at 25/50/75/100. GA4 Realtime → events appear.
**Automated checks:** none.

---

### Commit 16 — `feat: RSS feed + sitemap`
**What:** `/blog/feed.xml` (RSS 2.0) — the resolved B6 item — plus `/sitemap.xml` for SEO.

Changes:
- `routes/blog/feed.xml.ts` — `define.handlers` GET returning RSS XML from `loadBlogIndex()` (published posts only). XML-escape helper.
- `routes/sitemap.xml.ts` — lists the known static routes (`/`, `/about`, `/experience`, `/projects`, `/blog`) + published blog slugs (from `loadBlogIndex()`). ~20 lines. Cheap SEO win for the "intro myself" goal.
- Wire `<link rel="alternate" type="application/rss+xml" href="/blog/feed.xml">` in `Seo` so feed readers can autodiscover.

**Visual checks:** Load `/blog/feed.xml` → valid RSS (validate at `validator.w3.org/feed/`). Load `/sitemap.xml` → valid XML listing all routes + any stub posts. With a stub post → it appears in both. Subscribe in a reader → works.

---

## Phase 5 — Polish (commit 17)

### Commit 17 — `chore: content TODO sweep, favicon, cleanup`
**What:** Final cleanup pass — sweep all `TODO(content)` markers, confirm favicon, remove dead scaffold remnants.

Changes:
- `grep -r "TODO(content)"` — produce a checklist of every stub to replace with real content (this is **your** list; the commit itself just documents/consolidates the TODOs, doesn't fill them).
- Confirm `static/favicon.ico` wired (from commit 6).
- Remove any unused scaffold files (e.g. `assets/styles.css` if it lingered).
- `README.md` — add the maintenance pointer + link to `detailed_design/addons/11_build_deploy_maintenance.md`.
- Run `deno task check` — all green. Run `deno task build && deno task preview` — production build works.

**Visual checks:** Full site walkthrough — every page, mobile + desktop. `deno task preview` (the built server) renders identically to `deno task dev`.
**Automated checks:** `deno task check` (fmt + lint + types + tests + validate) all green.

---

## After the plan — content authoring (your commits)

Once commit 17 lands, the site is structurally complete with stub content. You then author the real content as your own commits (interleaved whenever you want during the plan too). The `TODO(content)` markers are your map. Typical content commits:
- `content: real landing + about copy`
- `content: real timeline entries + role bullets`
- `content: real projects list + images`
- `content: first blog post`

These are pure content edits — no code, no risk to the build (validation guards them). You can do them in any order, in batches, at any point.

---

## Resolved decisions

1. **Sitemap (commit 16)** — include `/sitemap.xml`. ~20 lines, cheap SEO win for the "intro myself" goal.
2. **Analytics wiring (commit 15)** — use `islands/Analytics.tsx` (not an inline `<script>`). The Preact runtime is already shipped by the Typewriter + MobileNav islands, so the marginal cost is ~1KB of the analytics logic itself — no extra runtime. The island is type-checked, bundled/testable, and runs after hydration (fine — analytics events happen on user interaction, which is always after hydration). Updated in commit 15 above.
3. **Commit ordering** — mobile nav (commit 13) stays late (after all pages). You test pages on desktop first; mobile nav lands once real pages exist to test it against.
4. **Commit 6 size** — keep the app shell as one commit. The pieces (theme, global CSS, components, `_app.tsx`, `_error.tsx`, `main.ts` error handlers) are interdependent; splitting would leave the site half-styled between commits. It's the biggest commit but still a focused, reviewable unit.

---

## How to use this plan

- **VCS:** jj only. Each commit = `jj new` → make changes → `jj describe -m "…"` → `deno task check` → review in `deno task dev`. Never run `git` directly; use `jj git push` to share with the remote.
- **Per commit:** read the "What" + "Changes" for scope, run the "Automated checks" (`deno task check`), then run `deno task dev` and do the "Visual checks."
- **Interleaving content:** you can author real content into `content/` at any point (your own jj commits). The `TODO(content)` markers are your map — grep for them to see every stub to replace.
- **If a commit feels too big in review:** tell me and I'll split it before we proceed to the next.
- **Tests ship with features:** from commit 3 onward, each logic commit includes its `.test.ts` file. `deno test` is always green.
- **`deno task check`** is the universal gate: `deno fmt --check` + `deno lint` + `deno check` + `deno test` + `deno task validate`. Run it before each jj commit; it's what CI runs.

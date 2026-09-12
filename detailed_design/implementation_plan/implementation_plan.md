# Implementation Plan

> Build the Blue Slate Editorial site in vertical slices. Every change delivers a runnable, reviewable part of the website. Introduce a shared component, dependency, loader, schema rule, or island only in the first change that actively uses it.

## Working Rules

- Use the [Personal Portfolio Linear project](https://linear.app/svjx/project/personal-portfolio-6202ca3cda15) as the sole operational source of truth. Before an approved change begins, move its issue to `In Progress` and post the scope and planned verification. During work, post meaningful progress, remaining work, blockers, scope changes, and verification results. When ready for review, post the jj change identifier, complete verification evidence, manual-review results, known gaps, and the requested review decision. Keep the issue `In Progress` until explicit user approval, then mark it `Done` and record the approval. Record only actual blockers.
- Load `.agents/skills/commit-message/SKILL.md` before creating or describing a jj change. It defines the required title, descriptive body, and Linear-trailer format.
- VCS is jj only: `jj new` → edit → `deno task check` → visual review → update the Linear issue → describe the change using `.agents/skills/commit-message/SKILL.md`.
- Each change leaves the app runnable and `deno task check` green.
- At the end of every change, record verification evidence and review status on its Linear issue, then stop for explicit user review approval before starting the next change.
- A page slice includes its content shape, validation, loader, route, component, CSS, and applicable tests. Do not scaffold a future page's code.
- Visual changes are reviewed in light/dark modes at 320px, mobile, desktop, and 200% zoom.
- Accessibility is implemented with each slice; shared cross-page verification happens near release.
- Placeholder content is valid and uses `TODO(content)` only where a production value is required later.

## Phase 1: A Working Home

### `build: remove starter UI and configure checks`

- Remove Fresh starter routes, counter island, demo components, and starter assets.
- Configure tasks: `dev`, `build`, `preview`, `validate`, and `check`.
- Add CI running `deno task check`.
- Add only Fresh/Vite/Preact dependencies required to start the application; add markdown-it when the content-driven landing page needs it.
- Render a small static placeholder at `/` so the dev server and build are demonstrably working.

Verification: `deno task dev` serves `/`; `deno task check` passes.

### `feat: build shell and theme tokens`

- Add minimal `_app.tsx`, Layout, Header, Footer, Seo, and unified error page because the landing immediately uses them.
- Add semantic Blue Slate theme tokens, reset, typography, spacing, focus styles, and light/dark token overrides.
- Add the pre-paint system-theme resolver and `ThemeToggle` because the shell displays it.
- Add Bitmoji header logo, SJ favicon, one localized `<details>` navigation menu, skip link, `main#main-content`, and text-link footer.
- Use static shell links temporarily; content-driven navigation lands with the content-driven landing page.

Verification: themed landing placeholder, no-JS nav fallback, theme preference, skip link, keyboard focus, mobile header, 404 page, and both color schemes work.

### `feat: complete content-driven landing page`

- Add markdown-it with raw HTML disabled; implement only the heading-free landing Markdown rendering needed here.
- Add `site.json`, `landing.md`, `lib/types.ts`, landing loader, and hand-written landing/site validation.
- Replace static shell links with navigation from `site.json`.
- Render the complete landing: hero with optional sienna emphasis, Focus/Based/Exploring metadata strip, two point-of-view paragraphs, and Things/Resume link row.
- Add the base `.prose` styles because landing prose renders in this change; extend them only when a later page introduces new Markdown elements.
- Add `MobileNav` enhancement because the navigation is now driven by the real site map.
- Do not add future-page loaders, schemas, tags, blog routes, or analytics.

Verification: content updates render on `/`; invalid landing/site content reports clear errors; metadata, link row, responsive layout, and intentional ending whitespace match `04` and `09`.

## Phase 2: Portfolio Narrative

### `feat: add editorial About page`

- Add `content/about.md`, its validation and loader, `/about`, and `AboutPage`.
- Render portrait plus editorial intro, full-width Markdown biography, optional Outside of work note, numbered disciplines, and `View experience →`.
- Add the fixed decorative discipline number colors because this is their first use.
- Add only the About CSS needed by this page; extend shared prose styles only if the biography introduces a Markdown element not yet styled.

Verification: `/about` is fully content-driven; portrait and intro stack correctly; biography returns to full measure; discipline order remains meaningful without colors.

### `feat: add narrative Experience timeline`

- Add experience JSON and role Markdown content, validation, loader, `/experience`, and experience CSS.
- Extend markdown rendering only as needed for role bullets and generated heading IDs.
- Render years, company/role/dates, summary, two-to-four bullets, and current `Present` label.
- Add no Things infrastructure.

Verification: `/experience` is chronological, usable without company colors, and readable at narrow widths.

## Phase 3: Things

### `feat: add Things index and visual fixtures`

- Add Things entry schema and type validation (`built`, `written`, `photographed`, `thought`, `external`), index loader, `/things`, and Things CSS.
- Use the approved heading `Things` and tagline `Things I’ve built, written, photographed, and thought about.`
- The page’s visual design is defined in its dedicated page document before implementation.
- Add `content/things/fixtures/` with development-only fixtures spanning the supported entry types.
- Add the centralized `isProduction()` helper (`DENO_DEPLOYMENT_ID` or `APP_ENV=production`) and implement `show_things_fixtures`; local/non-production preview may use it, production validation requires `false` and production loaders never read fixtures.

Verification: chronological index, internal/external entries, empty production state, and fixture-only local preview work. No fixture content is exposed in production mode.

### `feat: add Things posts, TOC, and assets`

- Extend the existing Markdown renderer with unique heading IDs, H1/H2 extraction, and relative-image rewrite as now required by Things posts.
- Add post loader, post validation, dynamic post route, safe co-located image asset route, and post styles.
- Render title, date, title plus H2 TOC, prose, optional one related continuation, and return-to-Things link.
- Support photographs and photo essays as normal Things posts with deliberate image sequence, dimensions, alt text, captions, and responsive behavior. No gallery, masonry layout, slideshow, or lightbox.
- Missing and draft posts render the shared 404 page.

Verification: writing, project, and photography fixtures; TOC anchors; duplicate headings; code blocks; image assets; draft/missing 404; and reduced-motion behavior work.

### `feat: add publishing discovery endpoints`

- Add RSS from published internal Things posts and sitemap from available routes/published posts.
- Add reusable Blue Slate Open Graph fallback metadata/template.
- Add RSS/sitemap tests and XML escaping.

Verification: valid RSS/sitemap output excludes drafts and external-only entries where appropriate; shared links use complete metadata.

## Phase 4: Observation and Release Readiness

### `feat: add optional analytics`

- Add gated GA4 pageviews only when `ga4_id` is non-empty and hostname is not localhost.
- Add `Analytics` island only now, after the routes/events it observes exist.
- Implement documented aggregate events for navigation, external links, resume, Things, TOC, scroll depth, and explicit theme changes.
- Do not add a consent banner or privacy page. Do not send personal data or free-form content.

Verification: analytics remains fully disabled when the ID is empty; local requests are suppressed; event names and payload boundaries match `10`.

### `test: run cross-site accessibility and theme verification`

- Add fixed-token contrast tests and theme-preference unit tests now that all consuming components exist.
- Verify light/dark first paint, persistence, OS preference in system mode, and storage-failure fallback.
- Audit every page for keyboard order, skip link, focus visibility, 44px controls, forced colors, reduced motion, 320px viewport, and 200% zoom.
- Add any small CSS/accessibility fixes discovered by the audit in this same change.

Verification: `deno task check` is green; the complete matrix in `12b_testing_strategy.md` passes.

### `build: audit deployment readiness`

- Keep `show_things_fixtures: false` for production.
- Resolve production-only values when available: domain, optional GA4 ID, resume, portrait, Bitmoji, SJ favicon, fonts, and deployment configuration.
- Remove dead scaffold assets and verify all public links/assets.
- Run production build and preview, then document the deployment command.

Verification: every route works in both themes without fixture exposure, missing assets, unresolved placeholders, console errors, or horizontal overflow.

## Content Growth Decisions

- Things unifies built work, writing, photographs, and thoughts; projects do not receive a separate route or data model.
- Add search only when chronological lists, tags, and RSS no longer support Things discovery.
- Add reading time only when generated reliably; display an update date only after a material revision.
- Prepare photography with responsive AVIF/WebP derivatives, dimensions, alt text, and compression review before publication. This is asset preparation, not a runtime image service.

## Definition of Done

- Every delivered route is content-driven, styled, validated, and visually reviewed when its change lands.
- Shared code exists only because a currently delivered feature uses it.
- The only islands are `MobileNav`, `ThemeToggle`, and optional `Analytics`.
- Landing is concise; About, Experience, and Things follow the documented editorial reading paths.
- Sienna is the interaction accent; pop/company/discipline colors are decorative and labeled.
- `deno task check` and production build pass.
- Every completed change is marked approved in Linear before work begins on its successor.

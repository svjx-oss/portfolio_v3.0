# 12b — Testing Strategy

> How we verify the site works without loading the whole website. This is the testing counterpart to the design docs — review it alongside them.
>
> **Principle:** test the *pure logic* that can silently break (and that you can't eyeball), and verify the *visuals* by loading the dev server. Deno's built-in test runner (`deno test`) covers the former; `deno task dev` + your eyes cover the latter.

---

## 1. What we test with `deno test` (automated, fast, runs in CI)

The site has a thin layer of pure, deterministic logic — exactly the code that breaks silently on a refactor and that you can't verify by looking at a rendered page. Each of these gets a unit test file that runs under `deno test` with no network, no server, no browser.

### 1.1 `lib/validate.test.ts` — the no-downtime backbone
This is the most important test file. `validate.ts` is the only thing standing between a bad content edit and a broken deploy, so it deserves the most coverage.

| Test | Asserts |
|---|---|
| valid `site.json` | passes (no throw) |
| `site.json` missing required field (e.g. no `title`) | rejects with a clear error naming the field |
| `site.json` with bad `ga4_id` format | rejects |
| `site.json` with a `resume` path to a non-existent file | rejects (file-existence check) |
| `landing.md` with empty `specialties` | rejects |
| `landing.md` with empty body | rejects |
| `about.md` with a `portrait` path to a non-existent file | rejects |
| `timeline.json` with a `color` that isn't a 6-digit hex | rejects |
| `timeline.json` entry whose `md` file doesn't exist | rejects |
| `timeline.json` with two entries pointing to the same `md` | rejects (duplicate) |
| `projects.json` with a tag not in the `colors` map | rejects (typo detection) |
| `projects.json` with both `file` and `url` set on one project | rejects (mutual exclusivity) |
| `projects.json` with an `image` path to a non-existent file | rejects |
| `blog.json` `post` entry with `author` not in `authors.json` | rejects |
| `blog.json` with a duplicate `slug` | rejects |
| `blog.json` `link` entry missing `external_url` | rejects |
| valid full `content/` fixture tree | passes (sanity) |
| error output includes a "did you mean?" hint for a near-miss tag/author | (optional, if the helper exists) |

**Fixtures:** a `test/fixtures/content/` tree (a valid minimal copy of `content/`) plus per-test malformed variants. Each test points `validate.ts` at a specific fixture path.

### 1.2 `lib/markdown.test.ts` — the rendering pipeline
| Test | Asserts |
|---|---|
| plain markdown → HTML | basic `#`/`*`/links render correctly |
| `## H2` gets an `id` attribute (kebab of text) | anchor plugin works |
| `### H3` gets an `id` too | |
| `headings` returned includes only H2/H3 with correct text + id | TOC feed is right |
| raw `<script>` in markdown is stripped by sanitizer | security |
| raw `<iframe>` is stripped | security |
| `<span class="pop-green">` is **kept** (allowed-class escape hatch) | about-page color hook works |
| relative image `![](image01.png)` is rewritten to `/blog/<slug>/image01.png` when `slug` option is set | blog asset routing |
| absolute URL `![](https://...)` is **not** rewritten | |
| GFM table renders | plugin enabled |
| strikethrough `~~text~~` renders | GFM enabled |

### 1.3 `lib/loadContent.test.ts` — the loaders
Uses a fixture `content/` tree (same one as `validate.test.ts`).
| Test | Asserts |
|---|---|
| `loadSite()` returns the `Site` object matching the fixture | |
| `loadLanding()` returns frontmatter + rendered html | |
| `loadAbout()` returns frontmatter + rendered html | |
| `loadTimeline()` returns entries with each role's `html` rendered | |
| `loadProjects()` returns the `colors` map + `projects` array | |
| `loadBlogIndex()` returns entries joined with author, sorted newest-first, drafts excluded | |
| `loadBlogPost(slug)` returns `{ entry, author, html, headings }` for a published post | |
| `loadBlogPost(slug)` returns `null` for a draft slug | |
| `loadBlogPost(slug)` returns `null` for a missing slug | |

### 1.4 `components/Tag.test.tsx` (or `lib/luminance.test.ts`) — the tag text-color helper
| Test | Asserts |
|---|---|
| `luminance("#ffffff")` > 0.5 → text is dark (`#11305c`) | light bg → dark text |
| `luminance("#11305c")` < 0.5 → text is light (`#ffffff`) | dark bg → light text |
| `luminance("#f4e409")` > 0.5 → dark text | yellow pill case |
| `luminance("#3b3b8d")` < 0.5 → light text | indigo pill case |

> **Note on component tests:** Preact component rendering tests (e.g. "does `<ProjectCard>` render the title") are possible with `@testing-library/preact` but add a dependency and are fragile. We **skip** them — the dev server covers visual correctness, and the loaders + markdown tests already prove the data is right. We only unit-test pure helpers like `luminance`.

### 1.5 `lib/paths.test.ts` — path resolution (if non-trivial)
| Test | Asserts |
|---|---|
| resolves `content/site.json` to the correct absolute path | |
| resolves `static/...` references correctly | |

(Skip if `paths.ts` ends up being a one-liner — only test it if it has logic.)

---

## 2. What we test by loading the dev server (manual, per commit)

The visual layer — layout, spacing, responsive behavior, typography, colors — is verified by **you** running `deno task dev` at each commit and looking at the page. Each implementation-plan commit will list its "visual checks" so you know what to look at:

- Does the page render without console errors?
- Does the layout match the wireframe (`09`)?
- Does it scale correctly mobile → desktop (resize the browser)?
- Do the colors/fonts match the theme (`01`)?
- Do interactions work (nav clicks, mobile menu toggle, typewriter animation, TOC anchors)?
- Do analytics events fire (check the browser's Network tab for GA4 `collect` hits)?

This is the "reviewer step" baked into the implementation plan — each commit is small enough to eyeball in a few minutes.

---

## 3. What we don't test (and why)

| Skip | Reason |
|---|---|
| Preact component render snapshots | Fragile, high maintenance, the dev server covers it |
| CSS / visual regression | Eyeball at each commit; the design is simple enough |
| End-to-end (Playwright/Puppeteer) | Overkill for a personal site; the route + loader + markdown tests cover the data path, and the dev server covers the rest |
| GA4 event firing (automated) | GA4 hits are network calls to Google; hard to assert without a proxy. Verify manually via the Network tab during the analytics commits |

---

## 4. Test commands & CI

### 4.1 Local
```bash
deno test                         # run all tests, watch for changes with --watch
deno test lib/validate.test.ts    # one file
deno test --coverage=coverage     # with coverage; deno coverage report to view
```

### 4.2 In `deno task check` (the pre-push gate)
The scaffold's `check` task runs `fmt --check` + `lint` + `deno check`. We **add** `deno test` to it so a failing test blocks the push:
```jsonc
"check": "deno fmt --check . && deno lint . && deno check && deno test && deno task validate"
```
(Tests run on the pure-logic layer; they're fast — no server, no browser.)

### 4.3 CI (GitHub Actions)
The CI workflow (doc `11` §5.3) already runs `deno task check`, so tests run on every PR/push automatically once `deno test` is folded into `check`.

### 4.4 File layout
```
portfolio/
├── lib/
│   ├── validate.ts
│   ├── validate.test.ts        ← next to the module it tests
│   ├── markdown.ts
│   ├── markdown.test.ts
│   ├── loadContent.ts
│   ├── loadContent.test.ts
│   └── paths.ts
├── components/
│   └── Tag.tsx                 (luminance helper extracted to lib/luminance.ts + luminance.test.ts if it grows)
└── test/
    └── fixtures/
        └── content/             ← the valid minimal content tree shared by validate + loaders tests
            ├── site.json
            ├── landing.md
            ├── about.md
            ├── timeline/...
            ├── projects/...
            └── blog/...
```
Tests live next to the module (Deno convention). The `test/fixtures/content/` tree is a small, valid content set — separate from the real `content/` so tests don't depend on your authoring.

---

## 5. Test commit cadence (how tests ship in the implementation plan)

Tests are **not** a separate phase at the end. Each logic commit ships with its tests:
- The `lib/validate.ts` commit also adds `lib/validate.test.ts` + the fixture tree.
- The `lib/markdown.ts` commit also adds `lib/markdown.test.ts`.
- The `lib/loadContent.ts` commit also adds `lib/loadContent.test.ts` (reusing the fixture tree).

This way `deno test` is green from the first logic commit onward, and every later refactor is guarded. The implementation plan (in `implementation_plan/`) notes which test files ship with each commit.

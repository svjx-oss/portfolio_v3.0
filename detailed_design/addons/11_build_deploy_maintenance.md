# 11 — Build, Deploy & Maintenance

> How the site runs locally, how it ships, how it stays up, and the **maintenance playbook** — copy-paste recipes for the edits you'll actually make a couple times a year. This is the doc a future-you (or any human) opens first when they need to change something.

---

## 1. Prerequisites

- **Deno** ≥ 2.x installed (`curl -fsSL https://deno.land/install.sh | sh`).
- A **Deno Deploy** account linked to the GitHub repo (Project → linked to `main`).
- The project is scaffolded at `Portfolio_1.0/portfolio/` (Fresh 2.x + Vite). Run all commands from that directory.

## 2. `deno.json` (extends the scaffold's config)
The scaffold ships `dev`/`build`/`start`/`check`/`update` tasks, `fresh`/`preact`/`vite` imports, and `jsx: precompile` compiler options. We **add** `validate` (folded into `build` + `check`), the content/markdown deps, and the `deploy` block (written by `deno deploy create` — see §5.1). Fresh 2.x convention renames `start` → `preview`:
```jsonc
{
  "tasks": {
    "dev":      "vite",
    "build":    "vite build && deno task validate",
    "preview":  "deno serve -A _fresh/server.js",
    "validate": "deno run -A lib/validate.ts",
    "check":    "deno fmt --check . && deno lint . && deno check && deno task validate",
    "update":   "deno run -A -r jsr:@fresh/update ."
  },
  "imports": {
    "fresh": "jsr:@fresh/core@^2.3.3",
    "preact": "npm:preact@^10.29.1",
    "@preact/signals": "npm:@preact/signals@^2.9.0",
    "@fresh/plugin-vite": "jsr:@fresh/plugin-vite@^1.1.2",
    "vite": "npm:vite@^7.1.3",
    "markdown-it": "npm:markdown-it@^14",
    "markdown-it-anchor": "npm:markdown-it-anchor@^9",
    "sanitize-html": "npm:sanitize-html@^2",
    "zod": "npm:zod@^3"
  },
  "deploy": {
    "org": "<ORG_NAME>",
    "app": "<APP_NAME>",
    "entrypoint": "main.ts"
  }
}
```
(Keep the scaffold's `nodeModulesDir`, `lint`, `exclude`, `compilerOptions` — they're already correct. The `@/` → `./` alias is already set.) Pin major versions to avoid surprise breakage — directly serves the "future-proof / no dependency rot" goal. The `deploy` block is populated by `deno deploy create` (§5.1); leave the placeholders until then.

## 3. Local dev
```
deno task dev
```
- Runs `vite` (Fresh 2.x dev server) with HMR. Editing a markdown/JSON file under `content/` or a component hot-reloads the page.
- Opens at `http://localhost:5173` (Vite's default port — Fresh 2.x uses 5173, not 8000).
- No analytics emitted (the `Seo` component suppresses the GA4 snippet when `url.hostname === "localhost"` — A1).

## 4. Pre-push check
```
deno task check
```
Runs `fmt --check` + `lint` + `deno check` (type-check) + content validation. **Run this before every push.** It's the local mirror of what Deno Deploy runs. If it passes, the deploy will pass.

## 5. Deploy flow (`deno deploy` CLI — the modern command, not `deployctl`)

### 5.1 One-time app creation
Fresh is auto-detected by the CLI, so build commands are inferred:
```bash
deno deploy create \
  --org <ORG_NAME> --app <APP_NAME> \
  --source local \
  --build-timeout 5 --build-memory-limit 1024 --region us
```
This writes `deploy.org` + `deploy.app` into `deno.json` (already specified in `00` §11) and does the first deploy. Find your org name at `https://console.deno.com/<org-name>`.

### 5.2 Subsequent deploys
```bash
deno task build && deno deploy --prod
```
- Run from the `portfolio/` directory.
- `deno deploy --prod` (no `deployctl`) requires Deno ≥ 2.4.2.
- **Pass** → new version deployed atomically to all regions.
- **Fail** (type error / lint / malformed JSON / missing referenced file) → deploy aborted; **previous good version keeps serving**. You get a failed-check email/GitHub check.

This is the "no downtime from bad edits" guarantee (Q15). The strict validation in `lib/validate.ts` (spec'd in `02` §9) is what makes a bad content edit fail *before* it reaches users.

> **GitHub integration (optional):** you can also wire Deno Deploy to your GitHub repo so pushes to `main` trigger `deno task build` + deploy automatically. The CLI flow above is the manual equivalent.

### 5.3 Recommended: a tiny CI check (belt + suspenders)
Even though Deno Deploy gates on build, add a GitHub Action (`.github/workflows/ci.yml`) that runs `deno task check` on every PR/push — gives you fast PR feedback without waiting for Deno Deploy:
```yaml
name: ci
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: portfolio } }
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
      - run: deno task check
```

## 6. The validation gate (recap — full spec in `02` §9)
`deno task validate`:
- loads every `content/*` file,
- parses JSON (zod schemas) + markdown frontmatter,
- checks cross-file references (file existence, author refs, tag existence, unique slugs),
- collects **all** errors and prints a clear report with "did you mean?" hints,
- exits non-zero on any error.

Run it standalone (`deno task validate`) for fast feedback, or via `deno task build`/`check`.

## 7. Local preview of a production build
```
deno task build && deno task preview   # serve the built server locally (deno serve -A _fresh/server.js)
```
Use this to confirm the deployable artifact works before pushing.

---

# Maintenance Playbook

> Every recipe below is a **content-only** edit (no code). Run `deno task check` after, then push.

## 8. Add a blog post (internal)
1. Create a folder: `content/blog/posts/<slug>/` (e.g. `posts/designing-a-dashboard/`).
2. Write the body: `content/blog/posts/<slug>/<slug>.md` — **pure markdown, no frontmatter**. Use `## H2` for sections (they auto-build the TOC). Use `![](image.png)` for images (drop them in the same folder).
3. Add one entry to `content/blog/blog.json`:
   ```json
   {
     "kind": "post",
     "title": "Designing a low-latency dashboard",
     "author": "sahil",
     "date": "2026-08-20",
     "slug": "designing-a-dashboard",
     "excerpt": "A short one-line teaser for the index.",
     "tags": ["engineering", "performance"],
     "status": "published",
     "md": "posts/designing-a-dashboard/designing-a-dashboard.md"
   }
   ```
4. To stage without publishing: set `"status": "draft"` (excluded from the index, and `/blog/<slug>` returns 404).
5. `deno task check` → fix any errors → `jj git push` (jj wraps the git backend for remote hosting; never invoke `git` directly).

## 9. Add an external blog link (redirects off-site)
Add to `content/blog/blog.json`:
```json
{
  "kind": "link",
  "title": "My essay on Medium",
  "author": "sahil",
  "date": "2026-09-01",
  "excerpt": "Teaser shown on the index; clicking opens the external article.",
  "external_url": "https://medium.com/@sahil/essay"
}
```
No md file needed. The card shows author + date + excerpt and links out (new tab).

## 10. Add a project
1. Drop the card image into `static/projects/` (e.g. `static/projects/newproj.png`).
2. (If a "more info" PDF) drop it into `static/project-files/`.
3. Add one object to `content/projects/projects.json → projects`:
   ```json
   {
     "title": "New Project",
     "description": "Short description shown on the card.",
     "image": "/static/projects/newproj.png",
     "alt": "new project",
     "tags": ["c", "openmp"],
     "file": "/static/project-files/newproj.pdf",
     "url": ""
   }
   ```
   - `file` (local PDF) **or** `url` (external) — leave the other `""`. Use `""` for both if no link.
   - Each `tag` must exist in the `colors` map (validation catches typos). To use a new tag, also add it to `colors`.
4. `deno task check` → push.

## 11. Add a timeline / experience entry
1. Create `content/timeline/<name>.md` with the bullet list (markdown, bold for highlights).
2. Add one entry to `content/timeline/timeline.json`:
   ```json
   {
     "year": 2026,
     "company": "NewCo",
     "role": "Senior Engineer",
     "location": "City, ST",
     "dates": "Jan 2026 - Present",
     "color": "#aabbcc",
     "md": "newco-senior.md"
   }
   ```
   - `color` = company brand color (hex) → drives the node + year + company-name accent.
   - Order in the array = display order (most-recent first).
3. `deno task check` → push.

## 12. Add an author (rare)
1. Drop avatar into `static/authors/<id>.jpg`.
2. Add to `content/blog/authors.json`:
   ```json
   "guest": { "name": "Guest Author", "image": "/static/authors/guest.jpg" }
   ```
3. Reference `"author": "guest"` in a blog entry. Validation catches a missing id.

## 13. Edit nav links / social / resume / GA id / "elsewhere"
All in **one file**: `content/site.json`.
- `nav`: array of `{label, href}` — reorder/add/remove.
- `social`: footer links.
- `resume`: path to the active resume PDF (drop new PDF in `static/resume/`, update this line).
- `ga4_id`: GA4 measurement id (or `""` to disable).
- `elsewhere`: blog index "elsewhere" cards (icon + label + url); `[]` hides the section.

## 14. Edit the landing / about text
- Landing: `content/landing.md` (frontmatter for typewriter strings + name; body markdown for the sentences + links).
- About: `content/about.md` (frontmatter skillset; body bio paragraphs).
- About skillset `icon`: optional; maps to a key in `icons.tsx`. To add a new icon, add one inline SVG there (code edit, but tiny + isolated).

## 15. Change the font (Q5 switch point)
Edit `assets/theme.css`:
```css
--font-body:    "Geist Sans", "Inter", ...;   /* move your preferred font first */
--font-heading: "Geist Sans", ...;
```
Drop the font file in `static/fonts/` and ensure its `@font-face` is active in the same file. One edit, whole site changes.

## 16. Change a color
- Background/accent/text: `assets/theme.css` tokens (§2 of `01`).
- A company dot color: `content/timeline/timeline.json` → entry `color`.
- A project tag color: `content/projects/projects.json` → `colors` map.

## 17. Toggle the pixel-art background (when built)
`assets/theme.css`: `--bg-mosaic-opacity: 0` → `0.5` (and ensure the SVG is in `_app.tsx`). Built last per `01` §6 / `09` §8.

## 18. Update the resume
1. Drop the new PDF in `static/resume/` (e.g. `Sahil_Jaganmohan_Resume_2027.pdf`).
2. Update `content/site.json → resume`. The landing markdown uses the `{resume}` token, which `loadLanding()` substitutes from `site.json` — so this is the **single** edit (R1). No second place to update.

## 19. Optional: pre-push hook (R2)
To run `deno task check` automatically before every push:
```sh
# from the repo root
echo 'deno task check' > .githooks/pre-push
chmod +x .githooks/pre-push
git config core.hooksPath .githooks
```
One-time setup. Now a bad push fails locally before it reaches Deno Deploy. (Not required — `deno task check` works as a manual habit too.)

---

## 20. Useful GA4 views to save (recommended, A4)
Once live, create these saved Explorations in GA4 so future-you doesn't rebuild them:
- **Path Exploration** root = `/` → see where landing visitors go next (About/Projects/Blog/Resume).
- **Funnel Exploration**: `/` → `/projects` → `/blog` (the engagement funnel).
- **Events** report filtered to `cta_click`, `outbound_click`, `resume_download`, `blog_open` — the high-value actions.
- **Pages & Screens** + **Engagement rate** per page.
- **Geo** (Users → Geo → Location) — geolocation reporting.

## 21. When something breaks (debugging guide)
- **Deploy failed** → read the Deno Deploy build log; `validate.ts` prints the exact file + reason + a "did you mean" hint. Fix the content file; re-push.
- **Page shows 404 for a blog slug** → the entry is missing, `slug` mismatched, or `status: "draft"`. Check `blog.json`.
- **Tag pill looks wrong** → check the tag exists in the `colors` map; `Tag` auto-picks text color from hex luminance.
- **A content edit didn't appear** → you're on a cached page; hard-refresh. (Deno Deploy caches static assets by filename; content/JSON is read per request — no cache on those.)
- **"Cannot find module"** → a `deno.json` import URL is stale; re-pin Fresh/npm versions (rare — pinning prevents this).
- **Local won't start** → `deno task dev`; ensure Deno ≥ 2.x; check port 5173 free.

## 22. Maintenance cadence (realistic)
- **Couple times a year:** add a blog post / project / timeline entry (recipes §8–§11). ~10 min each.
- **Yearly:** update the resume PDF (§18), bump Deno/Fresh pinned versions (run `deno task check` to confirm).
- **Rare:** reface fonts (§15), retune colors (§16), build the mosaic (§17).
- **Never:** edit a route/component unless adding a feature. The content layer covers all routine updates.

## 23. Maintenance open questions (→ `12_open_questions.md`)
- **R1** Resume path single-sourced via `{resume}` token. (Resolved: yes — see §18.)
- **R2** `deno task check` as a git pre-push hook. (Resolved: yes — see §19.)

# 11 — Build, Deploy & Maintenance

> Run, ship, maintain. Kept simple.

---

## Prerequisites

- Deno ≥ 2.x. Project at `Portfolio_1.0/portfolio/`.
- Deno Deploy account.

## `deno.json`

```jsonc
{
  "tasks": {
    "dev":      "vite",
    "build":    "vite build && deno task validate",
    "preview":  "deno serve -A _fresh/server.js",
    "validate": "deno run -A lib/validate.ts",
    "check":    "deno fmt --check . && deno lint . && deno check && deno test && deno task validate"
  },
  "deploy": { "org": "<ORG>", "app": "<APP>", "entrypoint": "main.ts" },
  "imports": {
    "fresh": "jsr:@fresh/core@^2.3.3",
    "preact": "npm:preact@^10.29.1",
    "@preact/signals": "npm:@preact/signals@^2.9.0",
    "@fresh/plugin-vite": "jsr:@fresh/plugin-vite@^1.1.2",
    "vite": "npm:vite@^7.1.3",
    "markdown-it": "npm:markdown-it@^14"
  }
}
```

Five deps. No zod, no sanitize-html, no markdown-it-anchor.

## Local dev
```
deno task dev      # Vite, port 5173, HMR
```

## Pre-push check
```
deno task check     # fmt + lint + types + tests + validate
```

## Deploy
```bash
# One-time:
deno deploy create --org <org> --app <app> --source local --build-timeout 5 --build-memory-limit 1024 --region us

# Then:
deno task build && deno deploy --prod
```

Failed builds keep the last good deploy live.

---

# Maintenance Playbook

All recipes are content-only. Run `deno task check` after, then `jj git push`.

## Add a Writing post
1. Create `content/blog/posts/<slug>/<slug>.md` (pure markdown, `## H2` for sections).
2. Add one entry to `content/blog/blog.json` with `slug`, `date`, `title`, `excerpt`, `tags`, `status: "published"`, `md`.
3. `deno task check` → `jj git push`.

Follow `13_content_authoring_guide.md` for post structure, excerpts, code/media treatment, and the publishing checklist.

## Test Writing fixtures

Set `site.json → show_writing_fixtures` to `true` only in local development or a non-production preview. The centralized `isProduction()` helper treats `DENO_DEPLOYMENT_ID` or `APP_ENV=production` as production. Fixtures render Lorem Ipsum, headings, code blocks, captions, and sample images for visual review. Production validation requires the flag to be `false`; fixtures are never exposed in production.

## Add an external blog link
Add one entry to `blog.json` with `external_url` (no `slug`/`md`/`status`).

## Add a project
Add one object to `projects.json` (`title`, `description`, `tags`, `link`).

Use `13_content_authoring_guide.md` §4 to write the row. For deeper work, begin with a case-study post; add an internal project-detail route only after the case-study format is needed for multiple projects.

## Update landing orientation
Edit `content/landing.md`:
- `tagline` and optional `tagline_emphasis` for the hero statement.
- Three metadata rows: `Focus`, `Based`, and `Exploring`.
- Two point-of-view paragraphs and the `Projects · Writing · Resume` link row.

## Add a timeline role
Add one entry to `timeline.json` + one `<name>.md` in `content/timeline/`.

## Edit nav / social / GA id / resume
Edit `site.json`.

Analytics is optional: leave `ga4_id` empty to disable it. The launch site has no consent banner or dedicated privacy page; use only the documented aggregate events and do not send personal data. Revisit that policy if audience, jurisdiction, legal requirements, or tracking scope changes.

## Content Review

Before publishing material content, use the release checklist in `13_content_authoring_guide.md` §7. Keep the resume, external profiles, and contact details current.

## Change font
`assets/theme.css` → `--font-body` (one line).

## Change a color
- Background/accent: update both theme blocks in `assets/theme.css`, then run contrast tests
- Company dot: `timeline.json` → entry `color`
- Tag: `assets/components.css` → add a `.tag--<name>` class + one line in `Tag.tsx` map

Color maintenance rules:
- Sienna remains the only brand/interaction accent.
- Pop and company colors stay on small labeled details, never body text or large surfaces.
- Do not add raw hex values in page CSS; add or revise a semantic token.
- Review every new fixed foreground/background pair in both themes.

## Verify themes
1. Clear `localStorage.themePreference`; confirm the system theme renders before first paint.
2. Cycle `system → light → dark`; reload after each preference.
3. Change the OS theme while in `system`; confirm it updates. Confirm explicit light/dark do not change.
4. Check keyboard focus, 200% zoom, mobile width, reduced motion, and forced colors.

## Update resume
Drop new PDF in `static/`, update `site.json → resume`.

## Debugging
- **Build fails** → `validate.ts` prints the file + reason.
- **Writing 404** → entry missing, slug mismatch, or `status: "draft"`.
- **Local won't start** → `deno task dev`; Deno ≥ 2.x; port 5173 free.

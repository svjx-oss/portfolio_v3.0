# 11 — Build, Deploy & Maintenance

> Run, ship, maintain. Kept simple.

---

## Prerequisites

- Deno ≥ 2.x. Project at `Portfolio_v3.0/portfolio/`.
- Deno Deploy account and the production organization/app identifiers.

## `deno.json`

```jsonc
{
  "tasks": {
    "dev":      "vite",
    "build":    "vite build && deno task validate",
    "preview":  "deno serve -A _fresh/server.js",
    "validate": "deno run -A lib/content/validate.ts",
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
# One-time, after replacing `<org>` and `<app>` with the production identifiers:
deno deploy create --org <org> --app <app> --source local --build-timeout 5 --build-memory-limit 1024 --region us

# Then, from `portfolio/`:
deno task build && deno deploy --prod
```

Failed builds keep the last good deploy live.

## Change descriptions

Use jj only. Before creating or describing a change, load `.agents/skills/commit-message/SKILL.md`; it is the sole authority for the title, required descriptive body, and Linear references. The body explains the meaningful changes and their purpose before the `ref:` trailers. Linear is the sole progress tracker: move the issue to `In Progress` before approved work begins, post meaningful progress and blockers during work, post verification evidence when review is requested, and mark it `Done` only after explicit user approval. See `detailed_design/README.md` §Linear Workflow.

---

# Maintenance Playbook

All recipes are content-only. Run `deno task check` after, then `jj git push`.

## Add an Artifact
1. Create `content/artifacts/posts/<slug>/<slug>.md` (pure markdown, `## H2` for sections).
2. Add one entry to `content/artifacts/artifacts.json` with `slug`, `date`, `type`, `title`, `excerpt`, `tags`, `status: "published"`, `md`.
3. `deno task check` → `jj git push`.

Follow `13_content_authoring_guide.md` for post structure, excerpts, code/media treatment, and the publishing checklist.

## Test Artifacts fixtures

Set `site.json → show_artifacts_fixtures` to `true` only in local development or a non-production preview. The centralized `isProduction()` helper treats `DENO_DEPLOYMENT_ID` or `APP_ENV=production` as production. Fixtures render Lorem Ipsum, headings, code blocks, captions, and sample images for visual review. Production validation requires the flag to be `false`; fixtures are never exposed in production.

## Add an external Artifact
Add one entry to `artifacts.json` with `type: "external"` and `external_url` (no `slug`/`md`/`status`).

## Update landing orientation
Edit `content/landing.md`:
- `tagline` and optional `tagline_emphasis` for the hero statement.
- Three metadata rows: `Focus`, `Based`, and `Exploring`.
- Two point-of-view paragraphs and the `Artifacts · Resume` link row.

## Add an experience role
Add one entry to `experience.json` + one `<name>.md` in `content/experience/`.

## Edit nav / social / GA id / resume
Edit `site.json`.

Analytics is optional: leave `ga4_id` empty to disable it. The launch site has no consent banner or dedicated privacy page; use only the documented aggregate events and do not send personal data. Revisit that policy if audience, jurisdiction, legal requirements, or tracking scope changes.

## Content Review

Before publishing material content, use the release checklist in `13_content_authoring_guide.md` §7. Keep the resume, external profiles, and contact details current.

## Change font
`assets/theme.css` → `--font-body` (one line).

## Change a color
- Background/accent: update both theme blocks in `assets/theme.css`, then review the resulting foreground/background pairs with an accessibility checker
- Experience company bar: `experience.json` → entry `color`
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
- **Artifacts 404** → entry missing, slug mismatch, or `status: "draft"`.
- **Local won't start** → `deno task dev`; Deno ≥ 2.x; port 5173 free.

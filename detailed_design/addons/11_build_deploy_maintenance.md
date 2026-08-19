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
    "check":    "deno fmt --check . && deno lint . && deno check && deno task validate"
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
deno task check     # fmt + lint + types + validate
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

## Add a blog post
1. Create `content/blog/posts/<slug>/<slug>.md` (pure markdown, `## H2` for sections).
2. Add one entry to `content/blog/blog.json` with `slug`, `date`, `title`, `excerpt`, `tags`, `status: "published"`, `md`.
3. `deno task check` → `jj git push`.

## Add an external blog link
Add one entry to `blog.json` with `external_url` (no `slug`/`md`/`status`).

## Add a project
Add one object to `projects.json` (`title`, `description`, `tags`, `link`).

## Add a timeline role
Add one entry to `timeline.json` + one `<name>.md` in `content/timeline/`.

## Edit nav / social / GA id / resume
Edit `site.json`.

## Change font
`assets/theme.css` → `--font-body` (one line).

## Change a color
- Background/accent: `assets/theme.css`
- Company dot: `timeline.json` → entry `color`
- Tag: `assets/components.css` → add a `.tag--<name>` class + one line in `Tag.tsx` map

## Update resume
Drop new PDF in `static/`, update `site.json → resume`.

## Debugging
- **Build fails** → `validate.ts` prints the file + reason.
- **Blog 404** → entry missing, slug mismatch, or `status: "draft"`.
- **Local won't start** → `deno task dev`; Deno ≥ 2.x; port 5173 free.

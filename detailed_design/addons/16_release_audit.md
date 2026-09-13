# 16 — Release Audit

> Final checks before production deployment.

## Automated verification

Run from `portfolio/`:

```sh
deno task check
```

The build runs validation after generating the production bundle. Both commands
must pass before requesting release approval.

## Production configuration

Before deployment, replace or confirm these values:

- `content/site.json → url` is the production HTTPS origin.
- `content/site.json → ga4_id` is either the approved GA4 measurement ID or empty.
- `content/site.json → show_things_fixtures` is `false` when that field is present.
- `content/about/about.json → portrait` points to the final portrait asset.
- `site.json` contains the final resume and social/contact links when available.
- Deployment organization and app identifiers are configured for Deno Deploy.

Placeholder content and the sample image are acceptable for local review only.
Replace them before presenting the public site as final.

## Manual verification

Review every route in light and dark themes at 320px, desktop width, and 200%
zoom. Confirm keyboard focus, reduced motion, forced colors, no horizontal
overflow, no console errors, correct metadata, and no fixture content in a
production environment.

## Deployment

After production values and manual checks are complete:

```sh
deno task build && deno deploy --prod
```

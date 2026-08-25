# 10 — Analytics

> GA4 via direct `gtag.js`. Captures pageviews + geolocation + cross-page journey tracking via Path Exploration + custom events.

## Launch Policy

Analytics is optional. Set `site.ga4_id` to an empty string to ship without analytics; all site behavior remains available.

The initial site does **not** include a consent banner or dedicated privacy page. If GA4 is enabled, collect only the documented aggregate pageview and interaction events. Do not send names, email addresses, free-form content, or other personal/sensitive data as event parameters.

Revisit consent, privacy disclosures, and tracking configuration if audience size, visitor jurisdictions, legal requirements, or analytics scope materially change.

---

## GA4 snippet

Emitted by `Seo` in `<head>` only when `site.ga4_id` is set **and** hostname ≠ `localhost`. Pageviews fire automatically on each full page load (no SPA routing — every navigation is a real page load).

## Custom events

`islands/Analytics.tsx` — a tiny island that calls `initAnalytics()` in a `useEffect(..., [])` on mount. It attaches a delegated click listener that classifies clicks by destination and fires the right GA4 event. Mounted once in `_app.tsx`.

Why an island (not an inline `<script>`):
- **Type-checked** — it's a real TS module with imports, not a string blob.
- **Bundled by Vite** — tree-shakeable, no separate build step.
- **Testable** — the classification logic can be unit-tested.
- **Free runtime** — the Preact runtime is already shipped by `MobileNav`, so the marginal cost is ~1KB of analytics logic itself. No extra framework weight.
- **Timing is fine** — events fire on user interaction, which is always after hydration.

| Event | Fires on |
|---|---|
| `nav_click` | internal nav links |
| `outbound_click` | external links |
| `resume_download` | resume PDF |
| `blog_open` | internal blog post link |
| `blog_outbound` | external blog link |
| `toc_click` | blog post TOC anchor |
| `scroll_depth` | 25/50/75/100% thresholds |
| `theme_change` | explicit theme preference change (`system`, `light`, `dark`); never sent on initial resolution |

Destination-based detection — no per-link config. `data-event` attributes on components disambiguate where needed.

The site has **three islands** (all ship the shared Preact runtime; marginal cost is each island's own logic):

| Island | What | ~Size |
|---|---|---|
| `MobileNav` | nav dropdown toggle | ~1KB |
| `Analytics` | delegated event listener + scroll depth | ~1KB |
| `ThemeToggle` | light/dark mode toggle | ~1KB |

Everything else is server-rendered HTML + CSS.

## Why GA4

- Path Exploration reconstructs the full user journey from pageviews alone.
- Custom events make the funnel explicit.
- Minimal overhead — one snippet + one tiny island.

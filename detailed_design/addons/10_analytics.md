# 10 — Analytics

> Goal (Q4): capture geolocation + clicks + pageviews **and** add detailed cross-page journey tracking. Chosen: **GA4** via direct `gtag.js` + an explicit custom-event layer. PostHog noted as a documented alternative if you want heatmaps/session-replay later.

---

## 1. Why GA4 (direct) over GTM

| | GA4 direct (`gtag.js`) | GTM | PostHog |
|---|---|---|---|
| Geolocation + demographics | ✅ built-in | ✅ (via GA4 tag) | partial (geo via IP, opt-in) |
| Pageviews + page→page journey | ✅ Path Exploration | ✅ | ✅ funnels + session replay |
| Custom click events | small JS layer | tag-manager UI | ✅ autocapture |
| Heatmaps | ❌ (need extra) | via add-on | ✅ |
| Setup complexity | **low** (one snippet) | medium (container UI) | low (one snippet) |
| Vendor lock-in | Google | Google | self-hostable / SaaS |
| Page-weight | ~50 KB gtag | ~heavier container | ~variable |

**Decision:** GA4 direct. Rationale:
- GA4's **Path Exploration** reconstructs the exact "did users reach child pages?" funnel the design doc asked for.
- Adding **a small event layer** (below) makes key interactions explicit and queryable in GA4's standard reports — better than relying on autocapture.
- The codebase stays lightweight (one snippet + ~60 lines of helpers) — matches the "lean" goal.
- **PostHog** is a drop-in upgrade path if you later want heatmaps/replay; it's isolated to `analytics.ts` + the snippet in `_app.tsx` (see §6).

The `ga4_id` lives in `content/site.json` (one place to edit; `""` disables analytics — handy for local dev and for GDPR if ever needed).

---

## 2. The GA4 snippet (server-rendered via `Seo`)

The `Seo` component (called from `routes/_app.tsx`) emits the gtag snippet into `<head>` when `site.ga4_id` is non-empty **and** `url.hostname !== "localhost"` (A1). Server-rendered (no client framework needed for the pageview).

```html
<!-- only when ga4_id is set -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX', { send_page_view: true });
</script>
```
- Pageviews fire automatically on each full page load (Fresh SSR = a real navigation per page = a real `page_view` event). This is *why* we deliberately avoid SPA routing here: it makes GA4 pageviews and journeys accurate for free.
- **Local dev:** set `ga4_id: ""` in a local `content/site.json` (or use an env check) so dev traffic doesn't pollute GA4. A small `_app` guard: only emit the snippet when `Deno.env.get("DENO_DEPLOYMENT_ID")` is set OR a `--prod` flag — choose one. (Recommended: emit only when `ga4_id` is non-empty *and* hostname ≠ `localhost`. Simple, content-driven.) *(Flag A1 in `12`.)*

---

## 3. Custom events (the "even more detail" layer)

A tiny client-side helper (`lib/analytics.ts`, shipped via a small island-attached script or inline `<script>`) attaches **delegation-based** listeners so we never hand-wire each link. Clicks on `<a>` elements are classified by destination and fire the right event.

### 3.1 Event taxonomy
| Event | Fired when | Params |
|---|---|---|
| `page_view` | every page load (GA4 auto) | — |
| `nav_click` | click on any internal nav/header/footer/home link (`/`, `/about`, `/experience`, `/projects`, `/blog`) | `link_target` (path), `link_label` (e.g. "About"), `source` ("header" \| "footer" \| "landing") |
| `cta_click` | click on the landing CTAs to child pages (special-cased: the landing "projects" link) | `link_target`, `link_label` |
| `outbound_click` | click to an external `https://` URL (github, linkedin, devpost, medium…) | `link_url`, `link_domain` |
| `resume_download` | click to any `.pdf` resume link | `link_url` |
| `project_file_open` | click to a local project `.pdf` (`/static/project-files/…`) | `file` |
| `blog_open` | click on an internal blog card → `/blog/<slug>` | `slug` |
| `blog_outbound` | click on an external-link blog card | `url`, `domain` |
| `toc_click` | click on a TOC anchor (`#id`) in a blog post | `heading_text` |
| `scroll_depth` | 25/50/75/100% thresholds (one-time per page) | `percent` |

### 3.2 How clicks are classified (delegation, no per-link wiring)
A single delegated `click` listener on `document`:
1. Find the nearest ancestor `<a>` of the clicked element.
2. If none → ignore.
3. Resolve `href`:
   - `.pdf` at end → `resume_download` (if it's the resume) or `project_file_open` (if under `/static/project-files/`).
   - starts with `http(s)` and different origin → `outbound_click` (and `blog_outbound` if the click source is a `.blog-card[data-event=blog_outbound]`).
   - internal path:
     - on `/blog/<slug>` and `href` starts with `#` → `toc_click`.
     - the source element is inside `header`/`footer` → `nav_click` (`source` accordingly).
     - on `/` and the link is one of the landing CTAs → `cta_click`.
     - a `.blog-card[data-event=blog_open]` → `blog_open`.
     - else → `nav_click` (catch-all internal).
4. Call `gtag('event', name, params)`. If gtag isn't loaded (dev/no-id) → no-op.

This means **markdown links in `landing.md`** (e.g. the "projects", "github", "resume" sentences) get auto-classified by destination — no per-link config needed (keeps the markdown clean, per `02` §2). The "Apple" link to `/experience` in the landing current-role sentence fires `cta_click` (or `nav_click` — pick: recommend `cta_click` since it's in-body on landing). *(Flag A2.)*

### 3.3 `data-event` hints
For cases the destination heuristic can't disambiguate (e.g. internal blog card vs nav click to `/blog`), components set a `data-event` attribute on the anchor (e.g. `data-event="blog_open"`). The deleter checks this first. This is the *only* per-link coupling and it lives in the components, not the content — content stays clean.

### 3.4 Scroll depth
A ~30-line listener using `IntersectionObserver`/`scroll` throttled, firing `scroll_depth` at 25/50/75/100% once each. Satisfies "see how the user progressed" beyond just page hops.

---

## 4. Closing the design-doc gaps

| Gap stated in design doc | How addressed |
|---|---|
| "ability to track users across the website" | GA4 `page_view` per real page load → Path Exploration / User Explorer shows full per-session journey. |
| "lacked the ability to see whether they went through child pages after the main header page" | `cta_click` + `nav_click` events on the landing + header make the landing→child funnel explicit; GA4 Funnel exploration can build Landing → About/Projects/Blog/Resume in one click. |
| "geolocation" | GA4 built-in (Users → Geo). |
| "clicks" | `outbound_click`, `resume_download`, `project_file_open`, `blog_open/outbound`, `toc_click`. |

---

## 5. Privacy / consent (optional, future)

If you ever serve EU users and want consent: gate the gtag snippet behind a small cookie banner (a future island). Not in v1 (personal portfolio, low risk). Note: GA4 is IP-anonymized by default for EU. Flag A3 in `12` if you want the banner now.

---

## 6. Switching to PostHog later (isolated)

Only two touchpoints:
1. Replace the gtag snippet in `Seo` with the PostHog snippet.
2. Replace `analytics.ts`'s `gtag('event', …)` calls with `posthog.capture(name, props)` (same taxonomy).
The delegated classifier + `data-event` hints are identical. ~1 hour of work. Everything else (events, taxonomy) is unchanged — proof the abstraction is clean.

---

## 7. Analytics open questions (→ `12_open_questions.md`)

- **A1** Local-dev suppression: emit snippet only when `ga4_id` non-empty **and** hostname ≠ `localhost`? (Recommended: yes.)
- **A2** Landing in-body "Apple"→`/experience` link: `cta_click` or `nav_click`? (Recommended: `cta_click` — it's a body CTA, not a nav element.)
- **A3** Cookie/consent banner: skip for v1 (personal portfolio)? (Recommended: skip.)
- **A4** Do you want a GA4 dashboard/Exploration link list (suggested saved reports) documented in `11` so future-you doesn't rebuild them? (Recommended: yes — add a short "useful GA4 views" section to the maintenance doc.)

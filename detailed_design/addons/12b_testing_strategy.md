# 12b — Testing Strategy

> Test the pure logic that can silently break; verify visuals by loading the dev server.

---

## What `deno test` covers

| Module | Test file | Key cases |
|---|---|---|
| `lib/content/validate.ts` | `deno task validate` | content validation runs against the authored content tree |
| `lib/shared/markdown.ts` | Dev server review | Markdown behavior is verified through rendered routes |
| `lib/content/loadContent.ts` | Dev server review | Loaders are verified through rendered routes |
| Theme helpers | `lib/tests/theme.test.ts` | preference resolution and theme initialization behavior |
| Fixed theme tokens | Manual accessibility review | Review foreground/background pairs with an accessibility checker |

## What the dev server covers (manual, per commit)

- Page renders without console errors
- Layout matches wireframe (`09`)
- Responsive mobile → desktop
- Colors/fonts match theme (`01`)
- Interactions work (nav dropdown, theme preference, TOC anchors)
- Analytics events fire (Network tab → GA4 `collect` hits)
- First render follows system preference without a light/dark flash
- Theme cycles system → light → dark, persists after reload, and reacts to OS changes only in system mode
- Keyboard order, skip link, Escape behavior, returned focus, and visible focus rings work
- Both themes work at 320px, mobile, desktop, and 200% zoom without horizontal page scrolling
- Landing hero emphasis is present at most once; metadata has exactly Focus, Based, and Exploring rows; the body has two point-of-view paragraphs plus Artifacts/Resume links; the page ends with intentional whitespace rather than a featured-content block, grid, or status panel.
- About disciplines render in content order as `01`–`04`, remain a single vertical reading sequence at every breakpoint, and remain understandable when decorative number colors are unavailable.
- About portrait and editorial intro align at desktop and stack on mobile; Markdown biography returns to full reading width below the intro rather than remaining in a narrow image-adjacent column.
- Experience entries show a summary before two to four bullets; a current role uses visible `Present` text and remains understandable without the decorative company bar color.
- Project rows render decorative sequential numbers, wrap cleanly, show an optional challenge only when present, and use destination-specific link labels rather than generic “more.”
- Each non-landing page has one relevant continuation link after its primary content; Artifacts posts have at most one related-post continuation plus the return-to-index link
- Artifacts entries display the correct human-readable type. Photo essays remain readable and image-led without masonry layouts, lightboxes, page-level horizontal overflow, or missing alt text/captions.
- Artifacts index rows contain no author avatar or post image; photographs render only in their individual post context.
- Artifacts fixtures render only in local/non-production preview when `show_artifacts_fixtures` is enabled; `DENO_DEPLOYMENT_ID` or `APP_ENV=production` is production, where configuration rejects the flag and loaders never expose fixtures.
- Reduced-motion and forced-colors modes preserve all content and controls
- Accent assignments remain stable across reloads, restart per documented visual group or prose paragraph, and never depend on client-side randomness

## What we skip

- Preact component snapshots (fragile; dev server covers it)
- Full CSS visual regression (manual matrix at each visual commit)
- Broad E2E coverage; keep Playwright to focused smoke checks for critical routes

## Commands

```
deno test                         # all tests
deno test lib/tests/theme.test.ts # one file
```

`deno test` is folded into `deno task check` (the pre-push gate) and CI.

## File layout

Tests live in the dedicated test directory:
```
lib/content/validate.ts
lib/content/loadContent.ts
lib/shared/markdown.ts
lib/shared/theme.ts
lib/shared/types.ts
lib/shared/xml.ts
lib/tests/theme.test.ts
lib/tests/xml.test.ts
```

Tests ship with each logic commit (not a separate phase). `deno test` is green from the first logic commit onward.

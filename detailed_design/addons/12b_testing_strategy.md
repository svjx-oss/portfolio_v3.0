# 12b — Testing Strategy

> Test the pure logic that can silently break; verify visuals by loading the dev server.

---

## What `deno test` covers

| Module | Test file | Key cases |
|---|---|---|
| `lib/validate.ts` | `validate.test.ts` | valid fixture passes; each malformed variant rejects (bad hex, missing file, duplicate slug, etc.) |
| `lib/markdown.ts` | `markdown.test.ts` | plain md → HTML; H1/H2 get stable unique IDs; headings extracted; raw HTML not rendered; relative image rewrite |
| `lib/loadContent.ts` | `loadContent.test.ts` | all loaders return correct shapes; blog sorts newest-first; drafts excluded; missing/draft slug → null |
| Theme helpers | `theme.test.ts` | preference resolution (`system/light/dark`), storage failure fallback, OS change behavior |
| Fixed theme tokens | `contrast.test.ts` | primary, subtle, muted, accent, focus, and card-border pairings meet their required contrast |

**Fixtures:** `test/fixtures/content/` — a valid minimal content tree shared by validate + loaders tests.

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
- Landing hero emphasis is present at most once; metadata has exactly Focus, Based, and Exploring rows; the body has two point-of-view paragraphs plus Projects/Writing/Resume links; the page ends with intentional whitespace rather than a featured-content block, grid, or status panel.
- About disciplines render in content order as `01`–`04`, remain a single vertical reading sequence at every breakpoint, and remain understandable when decorative number colors are unavailable.
- About portrait and editorial intro align at desktop and stack on mobile; Markdown biography returns to full reading width below the intro rather than remaining in a narrow image-adjacent column.
- Timeline entries show a summary before two to four bullets; a current role uses visible `Present` text and remains understandable without company color.
- Project rows render decorative sequential numbers, wrap cleanly, show an optional challenge only when present, and use destination-specific link labels rather than generic “more.”
- Each non-landing page has one relevant continuation link after its primary content; Writing posts have at most one related-post continuation plus the return-to-index link
- Writing entries display the correct human-readable type. Photo essays remain readable and image-led without masonry layouts, lightboxes, page-level horizontal overflow, or missing alt text/captions.
- Writing index rows contain no author avatar or post image; photographs render only in their individual post context.
- Writing fixtures render only in local/non-production preview when `show_writing_fixtures` is enabled; `DENO_DEPLOYMENT_ID` or `APP_ENV=production` is production, where configuration rejects the flag and loaders never expose fixtures.
- Reduced-motion and forced-colors modes preserve all content and controls

## What we skip

- Preact component snapshots (fragile; dev server covers it)
- Full CSS visual regression (manual matrix at each visual commit)
- E2E / Playwright (overkill; loader + markdown tests cover the data path)

## Commands

```
deno test                         # all tests
deno test lib/validate.test.ts    # one file
```

`deno test` is folded into `deno task check` (the pre-push gate) and CI.

## File layout

Tests live next to the module (Deno convention):
```
lib/validate.ts        →  lib/validate.test.ts
lib/markdown.ts        →  lib/markdown.test.ts
lib/loadContent.ts     →  lib/loadContent.test.ts
lib/theme.ts           →  lib/theme.test.ts
lib/contrast.ts        →  lib/contrast.test.ts
test/fixtures/content/    ← shared valid fixture tree
```

Tests ship with each logic commit (not a separate phase). `deno test` is green from the first logic commit onward.

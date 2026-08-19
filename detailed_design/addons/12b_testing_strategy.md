# 12b — Testing Strategy

> Test the pure logic that can silently break; verify visuals by loading the dev server.

---

## What `deno test` covers

| Module | Test file | Key cases |
|---|---|---|
| `lib/validate.ts` | `validate.test.ts` | valid fixture passes; each malformed variant rejects (bad hex, missing file, duplicate slug, etc.) |
| `lib/markdown.ts` | `markdown.test.ts` | plain md → HTML; H1/H2 get `id`s; headings extracted; `<script>` stripped; `<span class="pop-*">` kept; relative image rewrite |
| `lib/loadContent.ts` | `loadContent.test.ts` | all loaders return correct shapes; blog sorts newest-first; drafts excluded; missing/draft slug → null |

**Fixtures:** `test/fixtures/content/` — a valid minimal content tree shared by validate + loaders tests.

## What the dev server covers (manual, per commit)

- Page renders without console errors
- Layout matches wireframe (`09`)
- Responsive mobile → desktop
- Colors/fonts match theme (`01`)
- Interactions work (nav dropdown, TOC anchors)
- Analytics events fire (Network tab → GA4 `collect` hits)

## What we skip

- Preact component snapshots (fragile; dev server covers it)
- CSS regression (eyeball at each commit)
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
test/fixtures/content/    ← shared valid fixture tree
```

Tests ship with each logic commit (not a separate phase). `deno test` is green from the first logic commit onward.

# Frontend Maintainability Backlog

This backlog records refactors identified during the CSS, TypeScript, and TSX
audit of the current portfolio implementation. The current implementation is
the source of truth; these items are maintenance opportunities, not corrections
to the design documents.

## Deferred Refactors

The following refactors were identified and planned but are not currently
present in the codebase. They should be treated as future work.

- Centralize Artifacts type labels, date formatting, and type-to-accent mapping in
  a shared module.
- Type site navigation, contacts, and route accent state with `Accent`.
- Add shared accent hover tokens.
- Add a shared `.accent-underline` interaction style.
- Remove duplicated logo and page-back accent selectors.
- Remove the empty header element.
- Add stable keys to mapped fragments and TOC entries.
- Avoid rendering an empty Artifacts post TOC.
- Remove the footer `!important` rule.
- Remove repetitive landing `:has()` accent selectors.

### 1. Split Artifacts styles by responsibility

`portfolio/assets/artifacts.css` currently contains Artifacts index, filters, entry
rows, post headers, post navigation, TOC, Markdown prose, and responsive rules.

Consider splitting it into:

- `artifacts-index.css`
- `artifacts-post.css`

Keep the shared accent and underline primitives in `components.css`.

### 2. Consolidate Markdown styles

Most Markdown styles currently live under `.artifacts-post__prose`, while the
shared `.prose` class in `portfolio/assets/components.css` only covers basic
paragraph and link styles.

Move genuinely shared Markdown rules into `.prose` and leave only post-specific
layout rules under `.artifacts-post__prose`.

Verify About, Experience, landing, and Artifacts content after the change because
they all render through `portfolio/components/Markdown.tsx`.

### 3. Remove remaining duplicated underline rules

The shared `.accent-underline` primitive now covers several components, but
Artifacts-specific selectors still repeat underline behavior for entry titles,
post navigation, TOC summaries, and TOC links.

Evaluate whether those elements can use `.accent-underline` directly without
changing their direction, spacing, or hover behavior.

### 4. Decouple analytics from CSS classes

`portfolio/islands/Analytics.tsx` identifies outbound Artifacts links with:

```ts
link.closest(".artifacts-entry")
```

Use a semantic attribute such as `data-analytics-context="artifacts-entry"`
instead. Analytics behavior should not depend on presentation class names.

### 5. Replace image pseudo-element captions

`portfolio/assets/artifacts.css` uses `img[title]::after`. Generated content on a
replaced `img` element is not reliable across browsers.

If image captions are needed, emit explicit caption markup from the Markdown
pipeline or render images inside a figure-like structure with a real caption.

### 6. Centralize SEO theme colors

`portfolio/components/Seo.tsx` hardcodes theme colors for `theme-color`, while
the same visual values are also represented in CSS tokens.

Choose one maintainable source for these values. If they must remain available
to server-rendered metadata, document the intentional duplication or expose a
shared TypeScript theme metadata constant.

### 7. Add tests for shared Artifacts configuration

Add focused tests for `portfolio/lib/shared/artifacts.ts` covering:

- Every `ArtifactsEntryType` has a display label.
- Every `ArtifactsEntryType` has an accent.
- Date formatting remains stable for ISO dates.
- The mappings remain exhaustive when a new content type is added.

### 8. Review content and accent validation boundaries

`portfolio/lib/content/validate.ts` maintains a runtime accent set separately
from the TypeScript `Accent` union and CSS accent classes.

Keep runtime validation, TypeScript types, and CSS support aligned. A future
refactor could expose a shared runtime accent list or derive validation from a
single configuration object.

### 9. Review remaining class naming consistency

Audit generic classes such as `.hero-name`, `.tagline`, `.page-continuation`,
and `.accent-link` against component-owned names. Rename only where the change
meaningfully reduces collisions or makes ownership unclear.

### 10. Review one-off layout values

Audit component-specific values such as `40rem`, `54ch`, `62ch`, `6rem`, `7ch`,
and `5rem`. Keep values that express intentional content geometry; promote only
truly shared values to theme tokens.

### 11. Improve shared route/view state typing

Review the `accent` value passed through `Layout`, `Header`, and route state.
Consider a named page-view type if more shared page state is introduced. Avoid
adding an abstraction solely for the current single optional value.

### 12. Verify external-link semantics consistently

Review external links in landing contacts, Artifacts entries, and generated
content for consistent accessible labeling when opening a new tab. Keep the
current visual treatment unchanged unless a real accessibility issue is found.

## Suggested Order

1. Add shared Artifacts configuration tests.
2. Split Artifacts CSS by responsibility.
3. Consolidate Markdown styles.
4. Replace analytics class coupling with data attributes.
5. Replace image pseudo-element captions if captions are actively used.
6. Centralize SEO theme metadata.
7. Review naming and one-off layout values.

## Verification For Future Work

Run from `portfolio/`:

```sh
deno task check
```

For styling changes, also inspect all routes in both themes at narrow and wide
viewports, including a Artifacts post with headings, images, tags, and external
links.

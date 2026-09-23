# 07 - Artifacts Index (`/artifacts`)

> Route: `routes/artifacts/index.tsx` · Content: `content/artifacts/artifacts.json` ·
> CSS: `assets/artifacts-index.css` and `assets/artifacts-post.css` Wireframe: `09` §4

## Goal

Present a compact, chronological archive of Artifacts built, written, photographed,
and thought about. Each entry is an obvious full-row destination; the index
helps visitors assess an entry before opening it without becoming a card grid or
a dense project catalogue.

## Header

```text
Artifacts

Things I've built, written, photographed,
and thought about.
```

- `Artifacts` uses the existing normal-case page-title treatment. Do not use all
  caps, an eyebrow, or a separate subtitle component.
- The tagline uses subdued body text and wraps naturally. It remains visible at
  every breakpoint.

## URL Filter

The index filters server-side from an optional `type` query parameter:

| Label   | Query value | Included entry type   |
| ------- | ----------- | --------------------- |
| All     | omitted     | all published entries |
| Projects | `projects` | `project`             |
| Writing | `writing`   | `written`             |
| Photography | `photography` | `photography`    |
| Notes   | `notes`     | `thought`             |

An unknown query value falls back to All. External entries remain visible in All
and do not receive a dedicated filter at launch.

Use native `<details>` and `<summary>` for the control. No island or client
state is needed. The summary names the selected filter, uses a downward arrow
when closed and upward arrow when open, and has a bottom divider.

```text
All                                             ↓
────────────────────────────────────────────────
```

When open, the links remain in document flow beneath the summary:

```text
Writing                                         ↑
────────────────────────────────────────────────
All
Projects
Writing
Photography
Notes
```

- Filter options are ordinary links to `/artifacts` or `/artifacts?type=<value>` so
  every state is bookmarkable, shareable, and works without JavaScript.
- The selected option has stronger text and a non-color indicator such as an
  `aria-current="page"` state. Other options use muted text.
- The summary and every option meet the 44px target requirement on touch
  devices.

## Entry Layout

Each list item contains exactly one anchor. The anchor wraps the title,
metadata, optional excerpt, and arrow so the entire entry is the click target.
Do not place nested links in an entry.

```text
Why I Like Boring Software                      →
Essay · Software · 8 min read · 2026

A short reflection on why predictable systems are
often better than clever ones.

────────────────────────────────────────────────

Tokyo                                            →
Photography · Japan · 2026
```

- Title is the strongest entry element and arrow-aligned opposite it on the same
  row.
- Metadata follows the title: human-readable type, tags, optional reading time,
  then year. Use middle-dot separators and muted compact text.
- `excerpt` is optional. When present, it follows metadata after a small gap and
  uses subdued body text. It wraps naturally; do not line-clamp it.
- Entries without excerpts collapse naturally without empty reserved space.
- A thin divider separates entries. The final entry has no divider.
- Images and thumbnails do not appear on the index; photography is
  differentiated by its type label and rendered in the individual Artifact.
- External entries retain the full-row destination pattern and add a visible
  external marker instead of the internal arrow.

## Interaction And Accessibility

- No hover-specific interaction is required. The visual design must be complete
  at rest.
- Keyboard focus visibly outlines the full entry anchor and filter links.
- The arrow is decorative for internal rows and hidden from assistive
  technology; the title remains the accessible link name.
- Preserve the DOM reading order at every breakpoint: title, metadata, optional
  excerpt.
- At narrow widths, the arrow remains at the title row's end when space permits;
  otherwise it wraps without reordering the content.

## Responsive Behavior

- One column at every width. No card grid, masonry layout, horizontal scroller,
  or filter pills.
- The content width follows the shared wide-list measure.
- The filter options remain vertically stacked at all widths.
- Entries use comfortable vertical padding and retain full-width link targets on
  mobile.

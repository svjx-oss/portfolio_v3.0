# 13 — Content Authoring Guide

> The interface earns the first minute of attention. Clear, specific content earns the next ten. Use this guide when replacing placeholder copy or adding work.

## 1. Content Standard

The site should demonstrate care for design and execution through its writing as well as its layout. Prefer concrete claims, clear structure, and useful context over generic self-description.

- Lead with what changed, what was learned, or why the work mattered.
- Use specific nouns and active verbs.
- State constraints and tradeoffs when they explain a decision.
- Quantify outcomes only when the number is accurate and understandable.
- Keep scan paths strong: meaningful headings, short paragraphs, and descriptive links.
- Remove claims that could apply to any portfolio, such as “passionate,” “hard-working,” or “results-driven,” unless immediately supported by evidence.

## 2. Landing and About

### Landing

The landing page answers: who is this person, what do they care about, and where should I go next?

- **Tagline:** one concise point of view, not a job-title inventory. The optional sienna phrase should identify the idea worth remembering.
- **Metadata:** use exactly three concise orientation rows: `Focus`, `Based`, and `Exploring`. Values should be short, human, and stable rather than live-status updates.
- **Introduction:** exactly two short point-of-view paragraphs. Explain the kind of work, decisions, or outcomes that matter to you; do not summarize the resume or repeat the About page.
- **Link row:** follow the paragraphs with `Projects · Writing · Resume`. It is a compact path selector, not a list of social links.
- End after the Projects/Writing/Resume link row. Do not add a featured-work preview, content feed, or additional call to action; whitespace is intentional.

### About

The About page answers: how did this person get here and how do they approach work?

- **Intro:** write one concise editorial sentence for the portrait row. It should express how you approach work, not repeat a job title.
- **Biography:** use the Markdown body for the longer personal/professional narrative. It begins below the portrait at the full reading width, not beside the image.
- **Outside of work:** optional one-paragraph note about a real interest, such as photography, outdoors, travel, or making. It should add a human detail, not become a feed or second biography.
- Include a short “how I work” paragraph describing judgment, collaboration, clarity, or execution with a real example where possible.
- Use three or four ordered disciplines. For each, write a clear heading, one sentence about the kind of work, and a compact skill line. Do not turn the page into an exhaustive keyword inventory.
- End naturally at the documented `View experience →` continuation.

## 3. Experience Entries

The Experience page answers: what responsibility did this person have and what did they accomplish?

For each role, write one summary sentence followed by two to four bullets:

- **Summary:** state the kind of work, scope, or responsibility in one clear sentence before the bullets.

- Begin with an action and name the system, product, or responsibility.
- Add scope: scale, constraints, collaboration, ownership, or technical complexity.
- Include outcome or impact when it can be stated credibly.
- Explain an important tradeoff when it distinguishes the work from a routine task.

Avoid duplicating every resume bullet. The timeline should be readable as a narrative of increasing responsibility.

## 4. Projects and Case Studies

The project list is intentionally concise. It should make visitors want to open the most interesting work, not explain every detail inline.

### Project row

- **Title:** specific and memorable.
- **Description:** one or two sentences covering problem, approach, and meaningful outcome.
- **Challenge:** optional one sentence about a constraint, question, or difficult part that adds context beyond the description.
- **Tags:** three to five technologies or domains that help scanning. Tags do not replace the description.
- **Link:** use an external demo/repository when it provides real depth. Label the destination specifically (`Repository`, `Demo`, `Project site`, `Read case study`) rather than using “more.” Do not link to unfinished or low-signal destinations.

### Strong-project case study

Select two or three projects for deeper treatment. A case study can initially be a Writing post; introduce `/projects/{slug}` routes only if several projects warrant a consistent internal format.

Use this structure:

1. **Context:** what problem, audience, or opportunity existed?
2. **Role and constraints:** what did you own, and what limitations mattered?
3. **Approach:** what did you investigate or build, and why?
4. **Key decisions:** what tradeoffs did you make?
5. **Outcome:** what changed? Include evidence, qualitative or quantitative.
6. **Reflection:** what would you improve, repeat, or investigate next?

Use screenshots, diagrams, or code only when they clarify a decision. Every image has concise alt text and a caption when context is not obvious.

## 5. Writing and Photography

Writing demonstrates depth of thought and gives the portfolio a personal voice. Publish technical essays, field notes, and photo essays when there is a useful perspective, result, observation, or visual story, not to maintain an artificial cadence.

### Types

- **Essay:** a developed technical, design, or reflective argument.
- **Field note:** a shorter observation from work, travel, outdoors, photography, or a creative experiment.
- **Photo essay:** a short visual narrative with a purposeful image sequence and enough text to orient the reader.
- **External:** a worthwhile piece published elsewhere.

Keep all types in the same Writing index. The type label gives context; it does not create separate navigation sections at launch.

- Use a title that states the subject or argument.
- Open with the problem, question, or conclusion within the first few paragraphs.
- Use H2 headings for long posts; they form the table of contents.
- Keep paragraphs short enough to scan, especially on mobile.
- Include source links and distinguish observation from opinion.
- Add an excerpt that makes the index useful without merely repeating the title.
- Add reading time only when there is a reliable calculation; otherwise omit it.
- Display the publication date. Add an update date only when the post changed materially.

### Code, diagrams, and images

- Code blocks must wrap or scroll horizontally without forcing page-level horizontal scroll on mobile.
- Use syntax highlighting only if it remains readable in both themes; otherwise use high-contrast plain code styling.
- Diagrams use semantic theme tokens or self-contained colors that remain legible in light and dark mode.
- Images include width/height, descriptive alt text, and captions where needed. Avoid decorative images that do not support the argument.
- Photo essays begin with a short opening note, then use a deliberate sequence of images. Let one image breathe at a time; avoid contact sheets, masonry grids, lightboxes, slideshows, and infinite scrolling.
- Use real photographs that reveal your perspective: a place, detail, process, or moment. Captions can be spare, but should add context when the image alone is ambiguous.

## 6. Contact and Trust

- Keep email, LinkedIn, GitHub, and resume current and working.
- Add one quiet invitation where it fits naturally, such as the About-page ending or footer: `Interested in working together? Email me.`
- Keep portrait, role description, location, resume, and external profiles consistent.
- Open external destinations in a new tab only when leaving the portfolio is expected; always show `↗`.

## 7. Release Checklist

Before publishing new or revised content:

- Verify names, dates, links, and claims.
- Read the page on mobile and desktop in both themes.
- Check headings, image alt text, captions, and code blocks.
- Confirm the first screen communicates the page's purpose.
- Confirm the documented continuation link remains useful and singular.
- Confirm the link row remains the only landing-page path selector.
- Run `deno task check`.

## 8. Future Additions

Add these only when the content justifies them:

- Internal project-detail routes after two or more projects need a common case-study format.
- Search after the writing archive is large enough that lists and tags no longer support discovery.
- Reading time after a reliable calculation is implemented.
- Consent and privacy requirements if audience size, visitor jurisdictions, legal requirements, or analytics scope materially change. No banner or dedicated privacy page is launch scope.
- Bespoke page-specific Open Graph artwork when sharing writing and project pages becomes a meaningful acquisition channel. The reusable Blue Slate Open Graph template is the launch fallback.
- A repeatable photo-export workflow. When photography is published, generate optimized responsive AVIF/WebP derivatives, preserve dimensions and alt text, strip unnecessary metadata, and visually inspect compression. This is an asset-preparation task, not a runtime image service.

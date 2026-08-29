Links having the ↗ makes it look cluttered. Unless you have a better way to format this, I think underlying is good enough.

Response: Remove visible `↗` markers from ordinary external links. Keep a consistent underline plus hover/focus treatment, `target="_blank"` and `rel="noopener noreferrer"`, and an accessible new-tab label. Retain arrows only for page continuation links, where they communicate the documented next step.

Review: approved

Night and Light mode should be the only two toggles, there should be a system default toggle. But it should start at light or dark based on system default. but then toggle between night and light

Response: Resolve the initial theme from the OS preference before first paint, then present a two-state light/dark toggle. The first explicit selection persists; no visible or selectable system state remains.

Review: Approved, or we can default to dark which is faster?

The menu button looks weird on desktop, the font is oddly sticking out, and i want a dropdown animation (not sure if this is planned for later). Also I want there to be a down button arrow with the current page set e.g. Home V and then on About it is About V

Response: Replace the standalone hamburger glyph with a compact current-page label and chevron, such as `Home` plus a downward chevron. Keep native `<details>` as the no-JS baseline and add a short opacity/vertical-offset dropdown transition that is disabled for reduced-motion users. Use the same control at every breakpoint.

Review: yes, but the dropdown should look clean and polished

The design choices here look odd and the website right now looks ameatur. I dont know if this is because there is no content but something seems off and un-professional. This could be due to font or colors or spacing. But I am trending towards a preference of designs like paco.me and leerob.com

Response: Preserve the Blue Slate identity but simplify the shell toward a quieter text-led editorial presentation: fewer visually distinct surfaces, stronger alignment to one content column, more deliberate whitespace, tighter type hierarchy, and less reliance on decorative UI treatment. Reassess the perceived balance after the landing page has real content, since the placeholder cannot represent the intended composition.

Review: Is Blue Slate a good idea anymore? I think our accent is good but the background seems murky as opposed to polished

Event the footer looks odd and unpolished. Maybe that is due to the alignment between Portfolio heading and the rest of the website (which could be due to the content).

Response: Align the header, main content, and footer to the same content container. Use a restrained top rule, one linear row of text links, smaller gaps, and subdued supporting text so the footer feels like a quiet conclusion rather than a separate visual block. Confirm final spacing once real landing content establishes the page rhythm.

Review: What are we trying to establish here? That is important, we want things to look polished with intent and hence dictate how the reader percieves the author.

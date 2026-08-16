# 04 — Landing Page (`/`)

> Route: `routes/index.tsx` · Content: `content/landing.md` · CSS: `assets/landing.css`
> Goal (design doc): introduce you, your interests, what you're working on — and entice clicks into child pages (tracked). This is the page most users see first.

---

## 1. Content source
`content/landing.md` — frontmatter (`eyebrow`, `name`, `specialty_prefix`, `specialties`) + markdown body (current-role, intro, interest, CTAs). Full schema → `02` §2.

## 2. Route handler (SSR data)
```tsx
// routes/index.tsx
import { page } from "fresh";
import { define } from "@/utils.ts";
import { loadLanding } from "@/lib/loadContent.ts";
import { Head } from "fresh/runtime";
import Landing from "@/components/Landing.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const landing = await loadLanding();        // throws clear error if landing.md missing
    return page({ landing });                    // ctx.state.site is already available to _app; page doesn't need it
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <>
      <Head><title>{data.landing.frontmatter.name} — Portfolio</title></Head>
      <Landing {...data.landing} />
    </>
  );
});
```

## 3. `Landing` component (server) + `Typewriter` island

```tsx
// components/Landing.tsx
import Typewriter from "@/islands/Typewriter.tsx";
import type { Landing } from "@/lib/types.ts";

export default function Landing({ frontmatter, html }: Landing) {
  const { eyebrow, name, specialty_prefix, specialties } = frontmatter;
  return (
    <article class="landing">
      <p class="eyebrow">{eyebrow}</p>
      <h1 class="hero-name">{name}</h1>
      <p class="specialty">
        {specialty_prefix}{" "}
        <Typewriter strings={specialties} />.
      </p>
      <div class="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
```
- The body markdown (current-role + intro + interest + CTAs) is **pre-rendered to HTML** server-side by `loadLanding()` → `renderMarkdown()`; `Markdown.tsx` wraps `dangerouslySetInnerHTML` (the markdown is sanitized — `02` §7). Only the `Typewriter` is hydrated.

## 4. `Typewriter` island (`islands/Typewriter.tsx`)
A ~40-line Preact component. No library. Cycles through `strings` typing/deleting with timings as constants at the top of the file (`delay: 80`, `deleteSpeed: 80`, `pauseFor: 2000`, `loop: true`). Honors `prefers-reduced-motion`: if set, render the first string statically (no animation). A `<span aria-live="polite">` holds the typed text (screen readers won't be spammed because we pause updates on reduced-motion). Cursor = a blinking `▍` via CSS keyframes.

```tsx
// islands/Typewriter.tsx
import { useEffect, useState } from "preact/hooks";

const DELAY = 80, DELETE_SPEED = 80, PAUSE_FOR = 2000;

export default function Typewriter({ strings }: { strings: string[] }) {
  const [idx, setIdx] = useState(0);          // which string
  const [sub, setSub] = useState("");         // typed substring
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // rAF/timeout loop: types chars of strings[idx] into sub, pauses, deletes, advances idx, loops.
    // On prefers-reduced-motion: setSub(strings[0]) once, return early (no interval).
  }, []);

  return <span class="typewriter" aria-live="polite">{sub}<span class="cursor" /></span>;
}
```
> **State:** Fresh 2.x prefers `@preact/signals` (`useSignal`) for reactive state, but plain `useState` from `preact/hooks` is fine for a self-contained island like this. Use whichever reads cleaner.

## 5. Analytics on this page (doc `10`)
Landing is the journey entry point. Auto-tagged events (destination-based, no per-link config):
- clicks to `/about|/experience|/projects|/blog` → `nav_click`
- click to `github.com` → `outbound_click` (label `github`)
- click to the resume `.pdf` → `resume_download`
- click to `/experience` (the "Apple" link in the current-role sentence) → `nav_click` (label `experience`)
This closes the design-doc gap ("whether they went through the child pages after the main header page") — GA4 Path Exploration + these explicit events make the funnel explicit.

## 6. Layout & CSS (`landing.css`)
- `.landing` — centered, `max-width: var(--content-max)`, generous top padding (`var(--space-16)`), vertically biased toward the top third (hero feel).
- `.eyebrow` — `--text-base`, `--color-text-subtle`, `font-mono`.
- `.hero-name` — `--text-3xl`, italic, `700`, `--color-accent` (sienna).
- `.specialty` — `--text-lg`, `--color-text`. The `Typewriter` inherits; its text is `--color-accent-2` so it pops.
- `.prose a` — accent, underline; the CTA sentences read as natural links (no button styling needed, per the "refined" lean). *Optional*: the resume link could be styled as `.btn--accent` for emphasis — flag in review.
- Vertical rhythm: `space-6` between the four body paragraphs.

## 7. Responsive
- Mobile: hero name scales down via the fluid `--text-3xl` clamp; paragraphs full-width with `--gutter`. Typewriter behaves identically.
- Desktop: same, centered, more side space. No layout branches needed — the fluid type + max-width handle it.

## 8. Wireframe
```
                    Hey! 👋🏼 i'm
              Sahil Jaganmohan            ← sienna italic, huge
   i'm a computer engineer specializing in
              Embedded Systems▍          ← typewriter cycling

   currently an Embedded Software Engineer at Apple since Jan 2023.

   my curiosity of complex system architecture...

   i'm always interested in opportunities related to...

   i've built some cool stuff too: projects and my github.

   take a look at my resume.
```
(ASCII detail in `09`.)

## 9. Implementation notes
- Landing content (prose, the typewriter strings, the CTA links) is authored in `content/landing.md` — see `02` §2.
- The `Typewriter` island's timings (`pauseFor: 2000`, `delay: 80`, `deleteSpeed: 80`) are constants at the top of the island file, tunable in one place.
- The resume link points to the static path `/static/resume/Sahil_Jaganmohan_Resume_2025.pdf` (served from `static/`).

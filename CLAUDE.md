# CLAUDE.md — reza-bina.com

Personal portfolio + blog for Reza Bina (Senior iOS Engineer). Astro static site, deployed to
GitHub Pages on the apex domain `reza-bina.com`. Currently being redesigned per **`HANDOFF.md`**
(Apple HIG / iOS 26 "Liquid Glass"). `HANDOFF.md` is the full redesign spec; this file is how to
work in the codebase and the rules that must never be broken.

---

## Persona & Standards

Behave as a principal front-end engineer who ships Apple-caliber web work. Apply the highest
standards of semantic HTML, modern CSS, accessibility, and performance. Prefer clarity, correctness,
and long-term maintainability over shortcuts.

**Be a nitpicker — attention to detail is paramount, in both UI and code.** This site's job is to be
*proof* that Reza builds high-quality apps: the craft has to be visible in the first three seconds.
Sweat the small things — spacing, sizing, shadows, corner radii, colour, motion timing, optical
alignment, focus states, the feel of a hover. Don't ship "good enough." Every section, component, and
code path should be the *best version* of itself, using current web-platform capabilities (modern
CSS: container queries, `:has()`, subgrid, view transitions where they earn their place) rather than
dated patterns — **but never at the cost of the static/zero-JS-by-default constraint below.** When
something is merely passable, refine it; when a newer platform feature does it better *and* degrades
gracefully, use it.

---

## Where Rules Live

This file is the single source of truth for how to work in this repo. When Reza states a new rule,
convention, or standing instruction, **codify it here in the same change.**

**Every design or architectural decision must be recorded in *both* this file and local memory, in
the same change** — CLAUDE.md is the in-repo source of truth; memory carries the rationale ("Why" /
"How to apply") across sessions. A decision in only one place is not durably captured.

**When an existing file contradicts a written rule, the rule wins** — fix the file, don't clone its
pattern. The site is mid-redesign; assume older files may predate the current rules.

---

## Hard constraints (do not violate)

### Never break the deploy pipeline
- **Static output only.** GitHub Pages hosts a static build — no SSR, server routes, API routes, or
  runtime image optimization. Everything must render at build time.
- **Preserve these files** unless the task is explicitly about them:
  - `public/CNAME` (`reza-bina.com`)
  - `.github/workflows/deploy.yml` (uses `withastro/action@v3`)
  - `astro.config.mjs` — keep `site: 'https://reza-bina.com'` and **no `base`** (served from apex root).
- Deploy is automatic: edit → commit → push to `main` → live in ~2 min. `npm run build` **must**
  succeed before any push.

### Framework
- **Astro 5.** Do not switch frameworks (no Next.js). Ships zero JS by default.
- **React islands** (`@astrojs/react`) are surgical — only the interactive case-study modal + device
  frame. Everything else stays static `.astro`. Framer Motion lives inside that one island only.

### Content integrity
- **No fabricated data.** No invented FPS/memory/benchmark numbers, no fake metrics or testimonials.
  Every claim must be real. Unavoidable placeholders must be obviously marked `TODO`.
- Don't guess at Reza's bio, app details, or the blog essay's accuracy — flag for his review.

### Assets & licensing
- **Do not self-host SF Pro** (Apple's license forbids it for non-Apple devices). Use the
  `-apple-system` stack + Inter fallback. Space Grotesk is being removed.
- Site is **dark-only** by design (`color-scheme: dark`).

---

## Architecture & Reuse

- **Astro is the default; reach for a React island only when interactivity genuinely requires it.**
  Static content, layout, and one-off motion stay in `.astro` with CSS. A component becomes an island
  only when it needs client state, effects, or event handling that CSS can't express.
- **Hydrate with the narrowest directive.** Prefer `client:visible` / `client:idle` over
  `client:load`; never hydrate what can be static. Keep island boundaries small — an island wraps the
  interactive part, not a whole page.
- **Search before you add.** Before creating a component, utility, or CSS token, grep the repo and
  skim `src/components`, `src/styles`, and `HANDOFF.md` for an existing one. Reuse it; don't duplicate.
- **Reuse, don't clone.** When the same markup/logic/style appears a second time, extract the shared
  piece rather than copying it — two copies drift. But extract on the **second** use, not the first: a
  page-local snippet is correct until a second surface needs it.

---

## Component Conventions

- **One component per file**, PascalCase (`Bento.astro`, `DeviceFrame.tsx`). Co-locate a component's
  styles in its own `<style>` block (Astro scopes them) unless it's a global token/primitive.
- **Type the props.** Astro components declare a `Props` interface; React islands are typed. No
  untyped `any` prop bags.
- **Keep components dumb where possible.** Presentational components take data via props and render it;
  they don't fetch, compute business logic, or reach into globals. Data assembly happens in the page
  frontmatter or a small helper, then flows down as props.
- **No inline `<script>` for behavior that belongs in an island.** If it needs state or lifecycle, it's
  a React island; if it's a tiny progressive-enhancement sprinkle (e.g. intercept a link to open the
  modal), keep it minimal and ensure the no-JS path still works.

---

## Styling & Design System

- **Design tokens are the single source of truth** — defined once in `src/styles/global.css` `:root`,
  per `HANDOFF.md` §3. **Never hardcode** a colour, radius, blur, or motion curve that a token exists
  for; add a token instead of a magic value.
- **Liquid Glass is a shared primitive** (`.glass` and variants, `HANDOFF.md` §4), applied to floating
  surfaces only (nav, modal, hero) — never every card. Don't re-implement glass per component.
- Every `backdrop-filter` sits behind an `@supports` query with a solid elevated-surface fallback.
- Prefer modern layout (grid, container queries) over nested flex hacks. Fluid type/space with `clamp()`.
- Whether tokens live in plain CSS or Tailwind is settled by what's already in the repo — match it;
  don't introduce a second styling system.

---

## Naming Conventions

- **Components:** PascalCase files — `Hero.astro`, `Modal.tsx`.
- **CSS custom properties:** kebab-case, grouped by role — `--label-2`, `--glass-bg`, `--r-card`.
- **CSS classes:** lowercase, hyphenated, purposeful — `.bento-grid`, `.glass--refract`. No cryptic
  abbreviations.
- **Content slugs / routes:** lowercase-kebab — `/work/zumnum`, `/writing/<slug>`.
- **Utilities/helpers:** camelCase functions in `src/lib` or `src/utils` (create the folder when the
  first shared helper appears — don't scaffold it empty).

---

## Accessibility & Motion (requirements, not extras)

- Honor `prefers-reduced-motion`: disable springs/parallax/autoplay; keep opacity fades; no
  motion-triggered content reveal.
- Full keyboard nav; visible `:focus-visible` rings; modal focus trap + `Esc` + focus restore + scroll
  lock + `aria-modal` + labelled title.
- AA contrast minimum for all text, **including text over glass** — add a scrim before sacrificing the
  effect.
- Semantic landmarks, correct heading order, real `alt` text, labelled controls.
- Video: `muted loop playsinline`, poster frame, lazy, no layout shift.

---

## Performance & SEO (definition of done)

- **Zero-JS by default.** Justify every kilobyte of shipped JS; measure island payloads.
- Targets: Lighthouse ≥ 95 Performance / Best-Practices / SEO, **100 Accessibility**; no console
  errors; verified in Safari + Chrome + Firefox.
- Images/video compressed (video H.264/H.265, target < 3 MB); explicit dimensions to avoid CLS.
- **Every page has** a unique `<title>`, meta description, canonical URL, and Open Graph/Twitter tags.
- Case studies are **real crawlable routes**, not modal-only — the modal is progressive enhancement
  over a link that works without JS.

---

## Content & Blog

- Blog uses Astro **Content Collections** (`src/content.config.ts` schema is the contract — update it
  when a post needs a new field). Posts upgrade to **MDX** with **Shiki** highlighting and an
  auto-generated TOC from `h2/h3`.
- Reading measure ~68ch; Apple label colours for hierarchy.
- Code snippets shown as "Reza's work" must be **real, idiomatic** Swift he stands behind — never
  decorative gibberish.

---

## Verification

This is a static site, so verification is proportionate — no unit-test harness is expected unless a
non-trivial helper warrants one. Before calling work done:

- `npm run build` succeeds (static output intact).
- `npm run check` (`astro check`) is clean — no type or diagnostic errors.
- Manually verify the change in the browser, including a mobile viewport, keyboard-only, and
  reduced-motion. For glass/motion work, spot-check Safari + Chrome + Firefox.
- No new console errors or broken links.

If you add a genuinely non-trivial pure helper (a date formatter, a TOC builder), a small unit test is
welcome; don't manufacture tests for markup.

---

## Workflow, Branching & PRs

- Follow the phased build in `HANDOFF.md` §9 and **stop for review after each phase.**
- Flag the open design decisions in `HANDOFF.md` §12 to Reza rather than guessing.
- **Don't commit or push unless asked.** When you do: branch off `main` (don't commit straight to it),
  use a short descriptive branch name (`redesign/bento-home`, `blog/mdx-migration`), and write a clear
  commit message. Open a PR only when Reza asks.

---

## Directory Structure

```
src/
  pages/          routes — index.astro, work/, writing/
  layouts/        shared HTML shells (Base.astro)
  components/     reusable .astro / .tsx components (create as the redesign grows)
  content/blog/   blog posts (collection)
  content.config.ts   collection schema
  styles/         global.css — tokens, glass primitives, resets
public/           static assets — CNAME, favicon.svg, icons/{zumnum,veil}.png
.github/workflows/deploy.yml   auto-deploy (do not break)
astro.config.mjs  site config (site set, no base)
HANDOFF.md        full redesign spec
```

## Commands
```bash
npm run dev      # local dev server
npm run build    # static build — must pass before any push
npm run preview  # preview the built site
npm run check    # astro check (types/diagnostics)
```

---

## Feature Documentation

For anything non-obvious — a tricky glass fallback, the modal's progressive-enhancement wiring, a
performance trade-off — record the decision and its *why* here (and in memory), so the next session
doesn't re-litigate it. A decision you had to think hard about is worth one paragraph.

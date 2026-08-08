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

- **`ARTICLE-STYLE.md` is the binding style standard for every blog post — read it before drafting or
  editing one, and follow it.** It exists because the posts read as machine-made. The load-bearing
  rules: em-dashes ≤ ~3 per post (they were the default connector — use commas, colons, periods, or
  parentheses instead); sentence-fragment emphasis ≤ 1 ("Right. Not probably right. Right."); don't
  end every section on a punchline (reserve the one crafted line that earns it); **no bolded
  sentence-openers as pseudo-headers** — promote them to real `###` headings or fold into prose, or
  make a genuine list; introduce every code block with a plain lead-in and explain it after; ground
  the argument in real ZumNum/Veil specifics. Voice: a tired senior engineer talking plainly, honest
  about what didn't work — never performing. `FIX-02-articles.md` was the one-off pass that applied
  this to the first three posts; `ARTICLE-STYLE.md` is the ongoing rule.
- **Never trim a real number, table, caveat, or failure for style, and never invent facts** — that
  honesty is the brand. A good cadence edit is usually *shorter*, never less true.
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

### Case-study modal — flex dialog, only the body scrolls
`CaseStudyModal.tsx` is a bounded flex/grid dialog (ARIA APG pattern), **not** one scroller. The
`.modal-panel` is the rounded, `overflow:hidden`, `max-height` frame; inside, a `.modal-header`
(eyebrow + title, hairline `border-bottom`) and a `.modal-footer` (CTAs, hairline `border-top`) are
`flex:none` and stay fixed, while **`.modal-body` is the only scroller** (`flex:1; min-height:0;
overflow-y:auto; overscroll-behavior:contain`). Don't reintroduce `position:sticky` (fragile with the
rounded corners + backdrop blur) or a single `.modal-scroll`. The device can't be both a fixed desktop
column and scroll inside the body on mobile via CSS (an element can't cross the overflow boundary), so
it's placed by breakpoint with a `useMediaQuery('(min-width:720px)')` hook: on desktop it's a direct
panel child (left column, `align-self:center` so it's balanced against the full panel height, bounded by `36vh` so it isn't clipped on short laptops);
on mobile it's the first child of `.modal-body`. Load-bearing a11y: `.modal-body` has `tabindex="0"` +
`aria-label` so keyboard users can arrow-scroll it; the focus trap includes it; `aria-labelledby` still
points at the title id (now in the header). Keep the thin inset scrollbar and the Framer-Motion spring.

### Status colour convention — shipped vs. in-development
`--amber` (systemOrange) means **in development**; **green is reserved for shipped** ("On the App
Store"). Never render a forthcoming app's status chip green. For an unshipped app the honest
de-emphasis is `.tag--soon` (muted amber on a translucent field) + `.card--wip` (a dashed,
lower-contrast border) on its home card, and a `.badge--status` ("In development · not yet released")
on its work page — **no fabricated progress bars or metrics** to signal "in progress". Veil wore
exactly that treatment until it shipped (2026-08-07); both apps are now green `.tag--live`. The
work-page/modal badges branch on `appStoreUrl` presence in the case-study data, so flipping
`status` + adding `appStoreUrl` in `src/data/<app>.ts` is what "shipping" an app means there; the
home card chip + store link are edited by hand in `index.astro`.

### Hero legibility over Liquid Glass — SVG refraction removed (2026-08-08)
The hero tile uses **plain base `.glass`** (`blur + saturate`, the `--hero-scrim`, and the specular
`.glass::before` top edge) — the same clean surface on every browser. The earlier `.glass--refract`
variant applied an SVG displacement filter (`url(#liquid)`: `feTurbulence` → `feDisplacementMap`) as a
`backdrop-filter`. **Chromium is the only engine that renders an SVG filter on a backdrop, and it does
so at low resolution / tiled** — so the displacement chewed the ambient `.aurora`'s soft green blob
(which sits directly behind the tile) into a **blocky, mottled smear** behind the `<h1>`. Safari and
Firefox don't support `url(#…)` as a backdrop-filter, hit the `@supports` fallback (plain blur), and
looked correct — which is exactly why the bug was Chrome-only. Tuning the displacement `scale` (42 → 18
in an earlier pass) reduced but never fixed it: the blockiness is Chromium's low-res backdrop
rasterization, not the amplitude. So the whole refraction was retired: the `.glass--refract` rule, the
`@supports (backdrop-filter: url(#liquid))` block, the `LiquidGlassFilter.astro` component, and its
`<LiquidGlassFilter />` include in `Base.astro` are all gone. **Don't reintroduce an SVG filter as a
`backdrop-filter`** — it renders badly on the majority browser. The scrim + `--aurora-opacity` still
keep the headline AA-legible over the (now clean) aurora; keep the specular `.glass::before` highlight.

### Home IA — labeled sections, not an interleaved grid
The home page is **stacked, labeled `<section>`s in a fixed order: Hero → Apps → Writing → About**
(the researched portfolio sequence, projects first). It is **not** one bento grid mixing content types
across rows — testers found that confusing, because a hero sat beside an app, then a writing tile, then
the second app. Bento is still allowed *inside* a section (Apps is a two-card grid: ZumNum wider + first
= primary, Veil second), just never across content types. Each section carries a visible
`.section-label` heading wired with `aria-labelledby`, generous `.home-section` rhythm between them, and
`scroll-margin-top` so the nav anchors (`#apps`, `#writing`, `#about` — **preserve these**, the nav
scrolls to them) clear the sticky nav. Heading order is `h1` (hero) → `h2` (section) → `h3` (app names,
post titles, "Contact"). The two `CaseStudyModal` trigger ids (`#zumnum-trigger`, `#veil-trigger`) and
the stretched-link + App Store z-index behaviour are load-bearing — keep them on the app cards. Don't
re-merge the sections back into a single `.bento`/`.col-*` grid; those classes were removed with this
change. **About is single-column**: a full-width `.about-bio` card, then a compact `.about-contact`
strip (label left, icon links right — inline SVG, `aria-hidden`, so the visible text stays the
accessible name) — *not* the old two-column `.about-grid`, which stranded a short card beside the tall
bio. **The `.about-bio` card is full width (same as the app/writing cards) and the bio is a single
column whose text fills that full width** — `#about .about-bio p { max-width: none }`, no reading-measure
cap, so no void beside the text. Per Reza (2026-07-29): keep it one column filling the width — don't cap
it to a narrow reading measure (which strands it visually next to the full-width cards) and don't split
it into multiple columns. (The *hero* card is different: it hugs its content vertically but keeps its
wide right void on purpose, reserved for a future device/motif.)

### Home positioning — founder-forward, by implication (FIX-11)
The home is written to read as a **founder's** site — someone who owns products end-to-end and has
momentum — **not an engineer-for-hire's**. The signal is always *indirect*: nothing on the page may say
"available", "hire", "freelance", or "seeking co-founder". Four load-bearing pieces carry it (per Reza,
2026-07-29): (1) the hero **`.hero-now`** status line ("Now — building Veil, and looking for the next
thing worth building.") with a small **`--warm`** (systemGreen) `.hero-now__dot` — a current-momentum
cue; (2) the About **`.about-thesis`** lead — a prominent point-of-view statement, capped ~40ch, that the
body paragraphs must **not** re-echo; (3) the About third paragraph's end-to-end **ownership** claim
(empty Xcode project → App Store, myself); (4) the **`.contact-invite`** — a peer-framed line above the
contact row ("If you're building something ambitious on Apple platforms…"). Keep the tone this side of a
pitch; if you edit this copy, preserve the "never says for-hire" rule.
**CSS gotcha:** `.card p` (specificity 0,1,1) beats a bare `.hero-now`/`.contact-invite` (0,1,0) and was
silently forcing both to the 15.5px body size/`--label-2`. They're intentionally scoped
(`.hero-card .hero-now`, `.about-contact .contact-invite`) to win, keeping the quieter 14px/`--label-3`
"now" line and the 15px invite. Contact layout is now: `.about-contact` is a **column** (its `.card`
default — the old row-flex override was removed); the invite sits full-width on its own line, and
**`.contact-row`** carries the label-left / links-right flex row beneath it (wraps on mobile).

### SEO / discoverability conventions
The site's structured data is a JSON-LD `@graph` (`Base.astro`): always Person + WebSite, plus
per-page schema passed via the `schema` prop, which takes **one object or an array**. Posts pass
`[BlogPosting, BreadcrumbList]`; work pages pass `[SoftwareApplication, BreadcrumbList]`. The Apps
breadcrumb points at the home `#apps` section, not a `/work/` index (there isn't one). Freshness rides
on an optional `updated` date in the blog schema: it drives `dateModified` (falls back to `pubDate`),
an `article:modified_time` meta, and an "Updated" segment in the meta line. Locale is **en-GB**
everywhere (`<html lang>`, `og:locale`, date formatting) — keep them aligned.

**`llms.txt` decision (reversed, on purpose).** `/llms.txt` and `/llms-full.txt` exist as build-time
endpoints (`src/pages/llms*.txt.ts`), generated from the blog collection + case-study data, kept out
of the sitemap. This **overturns an earlier call to skip llms.txt**. The nuance that reconciles both:
Google confirmed it ignores `llms.txt` for *search ranking* (so it does nothing for Google SEO), but
the convention targets *LLM-ingestion tools*, where it's cheap and harmless. It's kept as low-cost
insurance, not a ranking lever — don't re-add it expecting Google traffic, and don't rip it out
expecting to lose any. Everything else (canonical, OG, generated OG images, sitemap with `/og/` +
`llms` excluded, RSS, robots with named AI-crawler allows) is already correct; don't rebuild it.

### Analytics — cookieless only, and the footer claim must match (FIX-14)
The site runs **GoatCounter** (`Base.astro`, injected before `</body>`, gated on `import.meta.env.PROD`
so `npm run dev` stays out of the stats, `is:inline` so Astro doesn't bundle the third-party script,
`async`). Chosen because it sets **no cookies, collects no personal data, and needs no consent banner** —
the only analytics consistent with this site. **Never** add Google Analytics, a tag manager, cookies, a
consent banner, or any fingerprinting/cross-site tracking; that list is closed. The endpoint is
`https://rezabina.goatcounter.com/count` (Reza owns the `rezabina` GoatCounter account).
**The honesty rule (load-bearing):** the footer once read "No trackers". Any analytics makes that
arguable, and on a site whose whole credibility is not overclaiming, a beacon under a "No trackers"
footer is a real hit. So the footer now reads **"Cookieless analytics, no personal data"** (the phrase
links to `/privacy`), and **the footer copy must change in the same commit as any analytics change** —
they are never allowed to drift. `/privacy` (`src/pages/privacy.astro`, in Reza's voice) states plainly
what is counted (aggregate page views, referrer, rough country/browser), what is not (no cookies, no
personal data, no cross-site tracking, no ads, no fingerprinting), and who/why (GoatCounter, to see which
posts land). It's indexed on purpose — on a privacy-first site the page is an asset, not boilerplate.

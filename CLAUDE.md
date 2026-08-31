# CLAUDE.md — reza-bina.com

Personal portfolio + blog for Reza Bina (Senior iOS Engineer). Astro static site, deployed to
GitHub Pages on the apex domain `reza-bina.com`. The design is **v3, a monospace changelog** —
live since 2026-08-31 per the plan folder below; this file is how to work in the codebase and
the rules that must never be broken. (`HANDOFF.md` was the v2 "Liquid Glass" spec and is
historical.)

---

## Plans & context (outside this repo)

- **Website plan:** `~/Developer/Documents/reza-bina.com/` — read its `0-START-HERE.md` first.
  `1-DO-NEXT/` is the task list, `2-DECISIONS/` holds settled decisions (do not re-litigate),
  `3-REFERENCE/Design-system.md` is the binding v3 design spec.
- **Veil business context:** `~/Developer/Documents/Veil/` — read its `0-START-HERE.md` before
  writing anything about Veil.

Standing constraint from both folders: **all example data in articles must be synthetic**
(never the author's real name, address, employer or family).

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
- **Astro 5.** Do not switch frameworks (no Next.js).
- **Zero client-side JavaScript on every route** (v3, decision 0001). No React, no islands, no
  inline behaviour scripts. If a feature needs a client island, the feature is cut. The one script
  in the built HTML is the GoatCounter beacon (see Analytics below) — that list is closed.

### Content integrity
- **No fabricated data.** No invented FPS/memory/benchmark numbers, no fake metrics or testimonials.
  Every claim must be real. Unavoidable placeholders must be obviously marked `TODO`.
- Don't guess at Reza's bio, app details, or the blog essay's accuracy — flag for his review.

### Assets & licensing
- **Zero web fonts on any route.** System stacks only: `--font-mono` (ui-monospace/SF Mono/Menlo)
  and `--font-serif` (Iowan Old Style/Charter/Georgia). Never self-host SF Pro (Apple's license
  forbids it). The one font package (`@fontsource/ibm-plex-mono`, devDependency) exists solely so
  Satori can render the build-time OG PNGs — it ships nothing to the client.
- **Light and dark, three-state.** Bare `:root` carries the full light palette; a
  `prefers-color-scheme: dark` block guarded with `:root:not([data-theme="light"])` redefines it;
  `:root[data-theme="dark"]` repeats it so an explicit choice wins. Never define a colour whose
  only home is a media query or attribute block.
- **The App Store badge is Apple's unmodified artwork** (`public/badges/`, from App Store
  Marketing Tools): 40px height minimum, ≥10px clear space, black variant on light / white on
  dark, storefront-agnostic link (`https://apps.apple.com/app/id<appId>` — never `/us/` or
  `/de/`). Never redraw it in CSS. The homepage's two badges are a knowing deviation from
  Apple's one-badge-per-layout rule, settled in decision 0001 — don't re-litigate either way.

---

## Architecture & Reuse

- **Everything is static `.astro` + CSS.** There are no client islands and no hydration
  directives anywhere; a feature that would need one is cut (decision 0001).
- **Search before you add.** Before creating a component, utility, or CSS token, grep the repo and
  skim `src/components`, `src/styles`, and the design system
  (`~/Developer/Documents/reza-bina.com/3-REFERENCE/Design-system.md`) for an existing one. If a
  page needs a component the design system doesn't have, either the page is wrong or the design
  system needs a new entry — decide which before writing CSS.
- **Reuse, don't clone.** When the same markup/logic/style appears a second time, extract the shared
  piece rather than copying it — two copies drift. But extract on the **second** use, not the first: a
  page-local snippet is correct until a second surface needs it.

---

## Component Conventions

- **One component per file**, PascalCase (`Row.astro`, `Prose.astro`). Co-locate a component's
  styles in its own `<style>` block (Astro scopes them) unless it's a global token/primitive.
- **Type the props.** Astro components declare a `Props` interface. No untyped `any` prop bags.
- **Keep components dumb where possible.** Presentational components take data via props and render it;
  they don't fetch, compute business logic, or reach into globals. Data assembly happens in the page
  frontmatter or a small helper, then flows down as props.
- **No behaviour `<script>`s, inline or otherwise.** Zero client JS is a hard constraint; there is
  no progressive-enhancement tier to put a sprinkle in.
- **Astro scoping gotchas** (both bit this build): a scoped `:root` selector compiles to
  `:root:where(.astro-x)` and never matches `<html>` — wrap it in `:global(:root…)`; and
  `:global()` *inside* `:has()` is dropped by the compiler — write the inner selector bare
  (inner `:has()` selectors are left unscoped anyway).

---

## Styling & Design System

The binding spec is **`~/Developer/Documents/reza-bina.com/3-REFERENCE/Design-system.md`** (v3
"monospace changelog", decision 0001). The load-bearing rules:

- **One frame: `.wrap { max-width: 46rem }`. Every page, no exceptions.** The header, content
  and footer all read it, so nothing shifts between pages. Where 656px of content doesn't fit a
  layout, the layout changes — the frame does not. No component sets its own `max-width` in
  place of the frame (`Prose` included); the only measure caps are `62ch` on descriptions.
- **The Row is two lines, always** (`Row.astro`): line one `date | name | action` on a
  `96px 1fr auto` grid, centred; line two the description at the 112px name indent, 62ch cap.
  Descriptions always wrap, never truncate. Rows collapse **once, at 400px of container width**
  (container query on `.wrap`; no viewport duplicate) — date onto its own line, indent dropped.
- **The emphasis belongs to the content, never to the label that files it.** The bold `name`
  slot holds the thing itself — the app, the article title, the sentence. Categories, signposts
  and timeframes (`on-device ml`, `newer`, `now`) go in the muted `date` slot. Hierarchy is
  weight and colour only — masthead 400, page titles and row names 600, no display size ever.
  The `#` prefix means "section" and nothing else; page titles don't carry it.
- **Chrome is muted; accent lives in content.** Nav/footer links are `--ink-2` hover `--ink`,
  current section marked with `aria-current="page"`; links in rows and prose carry a persistent
  `--rule-strong` underline (WCAG 1.4.1 — never colour-only).
- **Hairlines only.** A 1px `var(--rule)` line is the only separator. **Banned on every page:**
  cards, box shadows, gradients, `backdrop-filter`, aurora/grain layers, scroll reveals, magnetic
  buttons, sticky/condensing nav, border radii above 3px (code blocks 3px and Apple's badge are
  the only rounded things), web fonts, client-side React, emoji as section markers, and any
  heading set larger than the article body.
- **Monospace is the voice; serif is for reading.** Structure, metadata, navigation and labels
  are `--font-mono` at 14/1.7 with `tabular-nums` (Prose resets `font-variant-numeric` in
  running text); article body copy is `--font-serif` at **19/1.65** — sized so the measure meets
  the fixed frame (~70ch). `Prose.astro` owns every MDX element style.
- **Casing:** proper nouns keep their real casing everywhere (Reza Bina, ZumNum, Veil, iPhone);
  lowercase is for structural labels only (`# apps`, `email`, `read →`). **No `.toLowerCase()`
  in any component** — casing is content's business (tags are lowercase in frontmatter).
  Descriptions are sentence case with no terminal full stop; `·` is the one list separator.
- **Nothing moves.** The entire motion budget is `transition: color .12s linear` on links.
- **Tokens once, in `global.css` `:root`** — never hardcode a colour a token exists for. Space
  scale: 4 8 12 16 24 32 40 56 72 (page titles get 56 above; sections 40). Off-scale survivors
  are specced and commented: the 9px row rhythm, the 48/20 mobile page padding, the 96px date
  column (84px is exactly 10ch of 14px SF Mono and wraps).

---

## Naming Conventions

- **Components:** PascalCase files — `Hero.astro`, `Modal.tsx`.
- **CSS custom properties:** kebab-case, grouped by role — `--ink-2`, `--rule-strong`, `--font-mono`.
- **CSS classes:** lowercase, hyphenated, BEM-ish, purposeful — `.row__desc`, `.store-badge`. No
  cryptic abbreviations.
- **Content slugs / routes:** lowercase-kebab — `/work/zumnum`, `/writing/<slug>`.
- **Utilities/helpers:** camelCase functions in `src/lib` or `src/utils` (create the folder when the
  first shared helper appears — don't scaffold it empty).

---

## Accessibility & Motion (requirements, not extras)

- Full keyboard nav; visible `:focus-visible` rings (2px `--accent`, 2px offset) on every stop;
  keep the skip link.
- **AA contrast minimum for all text, measured with a tool, in both themes** — including muted
  `--ink-2` text and every Shiki token colour. That is why Shiki uses the
  `github-*-high-contrast` pair: the plain github themes' comment grey (#6a737d) measures 3.69:1
  on both code grounds and fails.
- A link inside running text never relies on colour alone — underline it (WCAG 1.4.1; the footer's
  analytics link is the precedent).
- Semantic landmarks, correct heading order, real `alt` text, labelled controls. Data uses real
  `<table>` markup with `<th scope="col">` (writing index, case-study stack); layout grids stay
  `<div>`s. Wide tables scroll in their own `overflow-x: auto` container — the page never scrolls
  sideways.
- Keep an (empty-in-practice) `prefers-reduced-motion` guard; there is nothing to disable beyond
  the link-colour fade.

---

## Performance & SEO (definition of done)

- **Zero JS bundles, zero font requests, on every route** — `dist/` has no `_astro/*.js` at all
  (the small stylesheet inlines, so pages are effectively single-request). Budgets: `global.css`
  < 12 KB; any page HTML+CSS < 30 KB.
- Targets: Lighthouse ≥ 99 Performance, **100 Accessibility**, ≥ 95 SEO; no console errors;
  verified in Safari + Chrome + Firefox. (Best-practices reads 81 on localhost solely from the
  `is-on-https` audit — it's green on the live domain.)
- Images compressed, explicit dimensions to avoid CLS.
- **Every page has** a unique `<title>`, meta description, canonical URL, and Open Graph/Twitter tags.
- Case studies are **real crawlable routes** (`/work/<slug>`); the case-study modal is gone.
- **No URL may ever break** — the site ranks first for "Reza Bina" and is linked from the iOS Dev
  Directory, and GitHub Pages cannot serve redirects.

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
- Manually verify the change in the browser, in **both themes**, including a mobile viewport
  (no horizontal scroll at 320px) and keyboard-only. Spot-check Safari + Chrome + Firefox.
- No new console errors or broken links.

If you add a genuinely non-trivial pure helper (a date formatter, a TOC builder), a small unit test is
welcome; don't manufacture tests for markup.

---

## Workflow, Branching & PRs

- Task order and open decisions live in the plan folder
  (`~/Developer/Documents/reza-bina.com/1-DO-NEXT/`); flag open questions to Reza rather than
  guessing.
- **Don't commit or push unless asked.** When you do: branch off `main` (don't commit straight to it),
  use a short descriptive branch name (`redesign/bento-home`, `blog/mdx-migration`), and write a clear
  commit message. Open a PR only when Reza asks.

---

## Directory Structure

```
src/
  pages/          routes — index.astro, work/, writing/, privacy.astro, 404.astro, llms*.txt.ts
  layouts/        Base.astro — head/meta/JSON-LD, SiteHeader/SiteFooter, GoatCounter
  components/     Row, Section, Tag, Prose, SiteHeader, SiteFooter, AppStoreBadge,
                  CaseStudyPage, TableOfContents, SubscribeForm (all static .astro)
  content/blog/   blog posts (collection)
  content.config.ts   collection schema
  data/           caseStudy.ts + veil.ts/zumnum.ts — verified case-study content
  lib/            og.ts (build-time OG PNGs), readingTime.ts
  styles/         global.css — tokens, reset, .wrap container (3.7 KB)
public/           static assets — CNAME, favicon.svg, icons/, shots/, badges/
.github/workflows/deploy.yml   auto-deploy (do not break)
astro.config.mjs  site config (site set, no base; mdx + sitemap; Shiki high-contrast pair)
HANDOFF.md        the v2 spec — historical only
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

For anything non-obvious — a compiler gotcha, a spec deviation, a performance trade-off — record
the decision and its *why* here (and in memory), so the next session doesn't re-litigate it. A
decision you had to think hard about is worth one paragraph. (The v2 feature notes — case-study
modal, status chips, glass/refraction, bento IA, founder-positioning copy — described components
deleted in the v3 rebuild and were removed with them; git history has them.)

### v3 changelog rebuild (2026-08-31) — what is load-bearing
The whole site is the v3 monospace changelog (decision 0001; spec in the plan folder's
`Design-system.md`). Things a future session must not undo or re-guess:

- **The `#apps` / `#writing` / `#about` ids on the homepage sections are nav anchors** — the
  header links point at them. Preserve them.
- **The masthead is the homepage's `<h1>`** (`SiteHeader` derives it, and the nav's
  `aria-current`, from `Astro.url` — no page passes a prop, so no page can forget). On every
  other page the name is a link and the page supplies its own h1. Exactly one h1 per page,
  outline h1→h2 with no skips.
- **Lists are derived from content, never hand-written** — homepage writing rows (latest three
  + an `all writing →` row), the writing index, each case study's `# writing` rows (published
  posts whose body mentions the app name), and **each article's closing app row** (B1: the
  most-mentioned app in the body is the subject; that rule keeps the both-apps article at
  Apple's one badge per layout). All rot-proof by construction.
- **Ship dates and prices are verified facts.** `shipped` per the iTunes lookup API (ZumNum
  2025-08-01, Veil 2026-08-07); Veil's `price` string is "free to try · €9.99 one-time unlock ·
  no subscription" because the store download is **free** — the €9.99 is the one-time IAP
  unlock (iTunes lookup + the Veil business folder). Never imply a paid download. "Shipping" an
  app = set `status: 'live'` + storefront-agnostic `appStoreUrl` + `shipped` (+ `price` once
  verified) in `src/data/<app>.ts`; the homepage row is edited by hand.
- **Badge SVGs are referenced as `<img>`, not inlined**, deliberately: inlining both theme
  variants of both homepage badges (~42 KB) would break the <30 KB page budget. Both variants are
  in the HTML; CSS shows the right one per theme (no JS to swap them).
- **`.wrap` declares `container: page / inline-size`** — the 400px container query in `Row.astro`
  and `CaseStudyPage.astro` (contact-sheet columns) depends on it; don't remove it.
- **The email form is gated** (`SubscribeForm.astro`): a plain Buttondown `<form action>`, zero
  JS, wired into article footers and `/writing`, rendering nothing until `BUTTONDOWN_USERNAME`
  is set. Only Reza can create the account. **The flip commit must update `/privacy` in the same
  change** — the analytics honesty rule applied to the one thing that would collect anything.
- **Dark-mode code blocks** work because `Prose.astro` flips Shiki's `--shiki-dark` variables
  with `!important` under the three-state selectors (`github-*-high-contrast` pair — the plain
  github themes' comment grey fails AA on both grounds). Astro's `themes:` config alone renders
  light-only.
- The OG renderer (`src/lib/og.ts`) needs a real font file at build time (Satori cannot use
  system fonts on CI, nor read WOFF2) — that is the **only** reason `@fontsource/ibm-plex-mono`
  exists. Verify the `.woff` path inside the package before ever swapping it.
- **Settled by Reza (2026-08-31), do not re-open:** the about line ("iOS engineer at
  Goodnotes; evenings and weekends…") stays as-is — the honesty is the point; and row
  descriptions always wrap, never truncate.

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

# reza-bina.com — Redesign Handoff (v2: Apple HIG / Liquid Glass)

**For:** Claude Code (implementer)
**From:** Reza Bina (owner), via design/architecture review
**Repo:** existing Astro site at `~/Developer/reza-bina.com` (live at https://reza-bina.com)
**Goal in one line:** Make the site itself proof that Reza builds high-quality iOS apps — Apple-caliber craft, visible in the first three seconds.

---

## 0. Kickoff prompt (paste this to start, then follow the spec below)

> You are extending an existing **Astro** static site (deployed to GitHub Pages on the apex domain `reza-bina.com`). Do **not** switch frameworks and do **not** break the deploy pipeline (`.github/workflows/deploy.yml`, `public/CNAME`, `astro.config.mjs` with `site: 'https://reza-bina.com'`, no `base`). Rebuild the visual design to reflect Apple HIG and iOS 26 "Liquid Glass": bento layout, Liquid-Glass floating surfaces, Apple dark system palette, `-apple-system` typography, and spring-physics motion. Add React (via `@astrojs/react`) **only** for the interactive case-study modal; everything else stays static Astro. Follow `HANDOFF.md` section by section. Work in the phases in §9 and stop for review after each phase.

---

## 1. Hard constraints (do not violate)

1. **Hosting is GitHub Pages (static).** Output must be a fully static build. No SSR, no server routes, no runtime image optimization, no API routes.
2. **Keep the deploy pipeline.** Preserve `public/CNAME` (`reza-bina.com`), `.github/workflows/deploy.yml` (uses `withastro/action@v3` — works with React islands), and `astro.config.mjs` (`site: 'https://reza-bina.com'`, **no `base`** — served from apex root).
3. **Framework: Astro.** Add React islands surgically with `@astrojs/react` for the modal only. Do not introduce Next.js.
4. **No fabricated data.** No invented FPS/memory/benchmark numbers. Every metric or claim must be real (see §6). Placeholders, where unavoidable, must be obviously marked `TODO`.
5. **Do not self-host SF Pro.** Apple's license forbids serving SF Pro as a webfont to non-Apple devices. Use the system stack (real SF on Apple devices) + Inter fallback (see §4).
6. **Accessibility & reduced motion are requirements, not extras** (see §8).

---

## 2. Stack decision & rationale

| Concern | Decision |
|---|---|
| Framework | **Astro 5** (already in repo). Ships zero JS by default; ideal for a static portfolio+blog. |
| Interactivity | **React island** via `@astrojs/react`, hydrated `client:load` or `client:visible`, **only** for the case-study modal + device frame. |
| Animation | **Framer Motion** inside the React island (spring physics). CSS/Web Animations for static-section motion. |
| Blog | **Astro Content Collections + `@astrojs/mdx`**. Code highlighting via built-in **Shiki** (theme: `github-dark-default` or `one-dark-pro`). TOC generated from headings. |
| Fonts | `-apple-system` stack + **Inter** (already installed via `@fontsource-variable/inter`) as cross-platform fallback. Drop Space Grotesk. |
| Styling | Plain CSS with custom properties (current approach) **or** Tailwind — implementer's choice, but keep the token names in §3. |

Why not Next.js: it would discard the working Pages pipeline, needs `output:'export'` + base-path handling for static hosting, and adds runtime weight that a static site doesn't need. Astro + one React island delivers identical UX at a fraction of the JS.

---

## 3. Design tokens (Apple dark system)

```css
:root {
  /* Surfaces — true black base for OLED depth, glass for elevation */
  --bg:            #000000;
  --bg-elev:       #0a0a0c;
  --label:         #f5f5f7;                 /* Apple primary label (dark) */
  --label-2:       rgba(235, 235, 245, 0.60); /* secondary label */
  --label-3:       rgba(235, 235, 245, 0.30); /* tertiary label */
  --separator:     rgba(255, 255, 255, 0.10);
  --separator-hi:  rgba(255, 255, 255, 0.16);

  /* Accent — Apple systemBlue (dark). App cards carry their own icon colors. */
  --accent:        #0a84ff;
  --accent-rgb:    10, 132, 255;

  /* Liquid Glass surface */
  --glass-bg:      rgba(255, 255, 255, 0.055);
  --glass-bg-hi:   rgba(255, 255, 255, 0.09);
  --glass-blur:    20px;
  --glass-sat:     180%;

  /* Radii — Apple continuous-corner scale */
  --r-card:        28px;
  --r-modal:       32px;
  --r-control:     14px;

  /* Type */
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
               "Inter Variable", Inter, system-ui, sans-serif;
  --font-mono: "SF Mono", ui-monospace, Menlo, Consolas, monospace;

  /* Motion */
  --ease-ios: cubic-bezier(0.32, 0.72, 0, 1); /* Apple-ish ease for CSS transitions */
}
```

Typography: use large, tight display sizes for headings (`letter-spacing: -0.02em to -0.03em`, weight 600), Apple's label colors for hierarchy. Body ~17px/1.6 (iOS body size). Prefer optical sizing on Inter Variable.

---

## 4. Liquid Glass — do it properly, use it sparingly

Your reviewers said "Liquid Glass," not "glassmorphism." Plain `blur + border` is 2020 glassmorphism. iOS 26 Liquid Glass adds **edge refraction/lensing, a specular top-edge highlight, adaptive translucency, and subtle motion**. On the web, approximate it in layers. Apply to **floating surfaces only** — nav bar, the case-study modal, the featured hero card — never to every card (that reads as a theme, not craft).

**Base glass surface:**
```css
.glass {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  border: 1px solid var(--separator);
  border-radius: var(--r-card);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.18),   /* specular top edge */
    inset 0 -1px 0 rgba(0,0,0,0.30),         /* soft inner base */
    0 30px 60px -30px rgba(0,0,0,0.7);       /* floating drop */
}
/* Bright specular highlight sweeping the top */
.glass::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.10), transparent 40%);
}
```

**Refraction (hero surfaces only), behind a feature query** — an SVG displacement filter under the blur gives the edge-bending look. Support is uneven (best in Chromium; Safari/Firefox vary), so gate it and keep the base glass as fallback:
```html
<svg width="0" height="0" style="position:absolute">
  <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise"/>
    <feGaussianBlur in="noise" stdDeviation="2" result="soft"/>
    <feDisplacementMap in="SourceGraphic" in2="soft" scale="42" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>
```
```css
@supports (backdrop-filter: url(#liquid)) {
  .glass--refract { backdrop-filter: url(#liquid) blur(14px) saturate(180%); }
}
```
References for the technique: CSS-Tricks "Getting Clarity on Apple's Liquid Glass", kube.io "Liquid Glass in the Browser". Test in Safari + Chrome + Firefox; if refraction misbehaves, ship the base glass only — it still reads premium.

**Legibility rule:** text on glass must keep AA contrast. If content behind reduces contrast, darken the glass tint or add a subtle solid scrim behind text. Never sacrifice readability for the effect.

---

## 5. Information architecture

- `/` — **Bento home** (§7.1). Hero, featured app (opens case study), blog highlight, live Swift snippet, small stat/link tiles.
- `/work/zumnum` — **Real case-study page** (static, for SEO + deep-linking + sharing). The featured card *also* opens this content in the modal island for an in-place experience. Build the page first; the modal reuses its content.
- `/writing` — blog index (exists). `/writing/<slug>` — post (exists; upgrade to MDX + Shiki + TOC).
- About — fold into the home bento (a glass "About" tile) rather than a separate page.

Deep-link/SEO note: the case study must exist as a real crawlable route, not modal-only. Progressive enhancement — the card links to `/work/zumnum`; JS intercepts the click to open the modal; without JS the link just navigates.

---

## 6. Content (real only)

**Identity / hero:** "Reza Bina — Senior iOS Engineer" building high-quality, privacy-first, on-device apps for the Apple ecosystem. Keep the current honest thread (offline, no tracking, native). Do **not** foreground the employer name; "Senior iOS Engineer" as a title is fine.

**Featured app — ZumNum (real):**
- Device frame plays a **real ZumNum screen recording** (Reza provides — see §10). Autoplay, muted, loop, `playsinline`, with a poster frame; pause when offscreen/modal closed.
- Honest description: learn German numbers by ear; hear a number, type it, instant feedback; fully offline, no ads; iOS 17+. Links to the App Store (`https://apps.apple.com/de/app/zumnum/id6748617262`).
- **No invented metrics.** If Reza supplies real details (architecture, frameworks used, a genuine performance note), feature them; otherwise omit the metrics block entirely rather than faking it. A tasteful "Built with" tech-badge row (SwiftUI, Swift Concurrency, StoreKit 2, on-device) is fine **if accurate**.

**Veil:** "Coming soon" — on-device document redaction. Its icon (green, redaction bar) is in `public/icons/veil.png`. Decide the link target with Reza (waitlist vs non-clickable); do not link to `/writing` as a placeholder.

**Code snippet card:** a **real, idiomatic** Swift snippet (e.g., an `actor`, an `AsyncStream`, or a small SwiftUI view) that Reza stands behind — not decorative gibberish. Syntax-highlight with Shiki.

**Blog:** keep the existing essay; it's Reza's voice draft — flag for his review. Structure supports future technical posts.

**Real links:** GitHub `github.com/rezabina86`, LinkedIn `/in/reza-bina`, X `@rezabina86`, email `rezabina.dev@gmail.com`.

---

## 7. Component specs

### 7.1 Bento grid (home)
- `grid-template-columns: repeat(12, 1fr)` desktop; collapse to 1–2 cols on mobile with `minmax` + container queries.
- Tiles (span suggestions): **Hero** (7) · **Featured app / case-study trigger** (5) · **Blog highlight** (7) · **Live Swift snippet** (5) · plus small tiles: **About** (4), **Apps count / on-device** stat (4), **Contact/links** (4).
- Hover: gentle lift + spotlight (cursor-tracked radial), `--ease-ios`. Reduced-motion: no transform.
- Only the hero + featured card use full Liquid Glass; secondary tiles use a lighter glass or flat elevated surface to avoid glass overload.

### 7.2 Device frame (`DeviceFrame`, React)
- iPhone 15/16 Pro proportions, **Dynamic Island**, ~19.5:9, continuous corners (~55px), thin bezel.
- `<video>` inside: `autoplay muted loop playsinline preload="metadata"` + `poster`. `object-fit: cover`. Pause via IntersectionObserver when offscreen and when the modal closes.
- Respect reduced-motion: show poster, don't autoplay; provide a play control.

### 7.3 Case-study modal (`Modal`, React island — the ONE place React/Framer Motion is used)
- Trigger: click the featured card. Fixed overlay, `backdrop-filter: blur(25px)`, dark scrim.
- Enter/exit: Framer Motion spring `{ type: "spring", stiffness: 300, damping: 30 }`; scale+fade+slight rise. Reduced-motion: instant fade only.
- Split layout: **left** = `DeviceFrame` with real ZumNum video; **right** = honest description, tech badges, App Store link (metrics block only if real).
- A11y: focus trap, `Esc` to dismiss, restore focus to trigger on close, `aria-modal`, labelled title, **lock background scroll** on open, click-scrim-to-close.
- Deep-link fallback: content mirrors `/work/zumnum`.

### 7.4 Glass nav
- Sticky, Liquid-Glass bar, condenses on scroll. Real SF/`-apple-system` type.

### 7.5 Blog
- `@astrojs/mdx`; Shiki code blocks; auto TOC from `h2/h3`; clean reading measure (~68ch); Apple label colors.

---

## 8. Accessibility & performance (definition of done)

- `prefers-reduced-motion`: disable springs/parallax/autoplay; keep opacity fades; no motion-triggered content.
- Keyboard: full nav, visible `:focus-visible` rings, modal focus trap + `Esc` + focus restore.
- Contrast: AA minimum for all text, **including text over glass** (add scrim if needed).
- Video: lazy, poster, compressed (H.264/H.265, target < 3 MB, muted, loop, playsinline); no CLS.
- Glass: every `backdrop-filter` behind `@supports`; graceful fallback to a solid elevated surface.
- Semantics: landmarks, alt text, real headings order.
- Targets: Lighthouse ≥ 95 Performance/Best-Practices/SEO, ≥ 100 Accessibility; no console errors; test Safari + Chrome + Firefox, light system setting won't apply (site is dark-only by design — set `color-scheme: dark`).

---

## 9. Build phases (stop for review after each)

1. **Foundation** — add `@astrojs/react` + `@astrojs/mdx`; wire fonts (`-apple-system` + Inter, remove Space Grotesk); implement design tokens (§3) and the Liquid Glass primitives (§4) with fallbacks. No content yet.
2. **Bento home** (§7.1) — layout, tiles, hover/motion, static content.
3. **Case study** — `/work/zumnum` page (§5) + `DeviceFrame` (§7.2) + `Modal` island (§7.3) with real footage wired.
4. **Blog** — MDX + Shiki + TOC; migrate existing post.
5. **Polish** — reduced-motion, full a11y pass, cross-browser glass QA, perf/Lighthouse, video compression.
6. **QA + deploy** — verify static build, `CNAME`/workflow intact, push; confirm live at `https://reza-bina.com`.

---

## 10. What Reza needs to provide

- **ZumNum screen recording** — a short (~6–12s) loop, portrait, ideally 1080-tall `.mov`/`.mp4`; a poster frame is a plus (Claude Code can extract + compress).
- **Real ZumNum details** to feature (optional): frameworks used, any genuine architecture/perf note, "Built with" badges to confirm.
- **A real Swift snippet** for the code card (or approve one Claude Code proposes).
- **Veil link decision** (waitlist / non-clickable).
- **Bio/title wording** confirmation and a read-through of the existing essay.

## 11. Preserve from current repo
`public/CNAME`, `.github/workflows/deploy.yml`, `astro.config.mjs` (site, no base), `public/icons/{zumnum,veil}.png`, existing blog content, `.gitignore`. Keep the auto-deploy: edit → commit → push → live in ~2 min.

---

## 12. Open design decisions (flag to Reza, don't guess)
- Accent: Apple systemBlue vs. carry a personal accent — default to systemBlue for the "iOS" read unless told otherwise.
- Case study as modal-only vs. modal + real route — spec says **both** (route is the source of truth); confirm.
- Amount of glass — spec says floating layers only; confirm before spreading it wider.

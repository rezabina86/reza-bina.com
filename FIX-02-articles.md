# reza-bina.com — Fix pass 02 (article readability + proofread)

**For:** Claude Code · **Reads:** `ARTICLE-STYLE.md` (the standard) first.

Rewrite the three posts in `src/content/blog/*.mdx` so they read like a human wrote
them, following `ARTICLE-STYLE.md`. This is a **copy-edit and cadence pass, not a
rewrite of the substance.** The technical content is strong and must survive intact.

## What to preserve exactly (do not touch)
- All frontmatter (title, description, pubDate, tags, draft).
- Every code block, verbatim (the code is real).
- Every number, table, benchmark, and stated caveat.
- The honesty — every "this didn't work", "my corpus is small", "only two of four
  bugs were the framework's fault". Never trim a limitation for polish.
- Do not invent anything. Do not pad. A good edit here is usually *shorter*.

## Global edit rules (apply to all three)
1. **Cut em-dashes to ~3 per post**, for real asides only. Replace the rest with
   commas, periods, colons, or parentheses. This is the biggest single fix.
2. **Kill the staccato-fragment tic.** Keep at most one per post. Examples to fix:
   - `A checksum is good at being *right*. Not probably right. Right.`
   - `Small, silly bug.`
   - `Working exactly as written. Just not as intended.`
   Rewrite these into plain sentences (see per-post examples below).
3. **Stop ending every section on a punchline.** Keep the one best aphorism per post
   (e.g. post 1's "The model was guessing at things that aren't guesses." earns it);
   let the rest of the sections close on ordinary explanatory sentences.
4. **Demote bolded pseudo-headers.** Where a bold sentence-opener is acting as a
   mini-heading (`**No single file showed the problem.**`, `**Nonsense can't
   happen.**`), either promote it to a real `###` heading or fold it into plain
   prose. Keep genuine inline bold for true emphasis only, sparingly.
5. **Introduce every code block with a plain lead-in** and explain what happens after
   it (most already do — verify all).
6. Vary sentence length; read each paragraph aloud and flatten anything that performs.

## Per-post notes

### 1 — `a-model-is-probabilistic-a-checksum-is-a-fact.mdx`  (lightest touch)
Strongest of the three; keep its shape. Mostly em-dash reduction and a few fragments.
- Title stays.
- Fix the "Not probably right. Right." passage — use the calibration in
  `ARTICLE-STYLE.md` ("A checksum, by contrast, is exact: an IBAN either passes the
  mod-97 check or it doesn't… Here's the reconciler:").
- The `**It tagged the label instead of the value.**` block is a legitimate list of
  error classes — keep the enumeration, but consider making it a real list or `###`
  items rather than four bolded sentences in a row.
- Keep the one thesis line ("The model was guessing at things that aren't guesses.").

### 2 — `the-state-machine-i-didnt-know-i-had.mdx`  (moderate touch)
Also strong; keep the dominoes metaphor and the structure.
- Opening: `Small, silly bug.` → `It was a small, silly bug.` and de-fragment the
  follow-on; drop the em-dash into a comma.
- `Working exactly as written. Just not as intended.` → one plain sentence.
- Demote the bolded mini-headers in "Why it stayed hidden" and "Fix two" (`**No
  single file showed the problem.**`, `**Nonsense can't happen.**`, `**Late messages
  sort themselves out.**`) to `###` or plain lead-ins.
- Keep the two genuine closers ("a compiler can't check something you never wrote",
  and the final "It had always been a lie.").

### 3 — `why-i-build-apps-that-cant-see-your-data.mdx`  (most work)
This one is abstract and manifesto-ish where the others are concrete, and it ends on
a weak `*More soon.*`. Bring it down to earth:
- Ground the argument in **one or two concrete, real examples** from the actual apps
  — e.g. ZumNum's on-device neural voice (no speech API, works on a plane), or Veil
  redacting a document with nothing leaving the phone. Show the principle, don't just
  assert it. (Use only real facts already established in the other posts.)
- Soften the stacked parallelism ("One can change with a quarterly business review.
  The other can't…") into plainer prose; keep the core idea (policy vs. architecture).
- Replace `*More soon.*` with a real closing sentence that ties the principle back to
  the apps he ships. No filler sign-off.
- Keep it short — this is a cornerstone essay, not a long one; just make it land in
  reality instead of abstraction.

## Proofread checklist (run after editing each file)
- Grammar, typos, consistent terminology (e.g. "on-device", "GLiNER", "mod-97").
- Em-dash count ≤ ~3; fragment-emphasis ≤ 1.
- Every code block has a lead-in and a follow-up explanation.
- No invented facts; all numbers/tables/code unchanged.
- MDX still valid; `npm run build` clean; reading-time and TOC still render.
- The post still sounds like *Reza* — a specific engineer — not a polished essay bot.

Commit each post separately with a plain message (e.g. "Edit: calm the cadence in the
Combine post"). Leave the frontmatter dates as they are unless Reza says otherwise.

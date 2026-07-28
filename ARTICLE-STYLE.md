# Writing style for reza-bina.com articles

**Purpose:** the standard every blog post follows, so Claude Code can draft posts
that sound like Reza — a working senior iOS engineer — and not like an AI.
Model of readability: Majid Jabrayilov (swiftwithmajid.com). Genre: Reza's own —
narrative engineering stories, not API how-tos. Adopt Majid's *plainness and
code-teaching discipline*; keep Reza's *story format and honesty*.

The single test for every paragraph: **would a tired senior engineer actually say
this out loud, or does it sound like it's performing?** If it performs, calm it down.

---

## Voice

- First person, a practitioner showing real problems from his own apps (ZumNum,
  Veil). Confident, specific, honest. Never salesy, never breathless.
- Teach by showing what actually happened, including what didn't work and the real
  numbers. The credibility comes from specifics, not from clever phrasing.
- Plain over polished. A correct, ordinary sentence beats a quotable one. When in
  doubt, cut the cleverness and keep the fact.

## Structure (the shape of a post)

1. **Title** — concrete and specific, a little intriguing. (Current titles are good.)
2. **Opening (2–4 short paragraphs).** Name the concrete problem in plain words;
   say why it matters; ground it in a real app. No throat-clearing, no thesis
   statement dressed up as an aphorism. Majid-style framing: "This started with a
   bug…" / "I'm building X. Here's the part that turned out to be hard."
3. **Body — descriptive `##` sections, escalating in complexity.** Each section:
   *set up the situation → show the code or example → explain what happens and why,
   including the edge case.* Sub-points get `###`.
4. **Code — introduce every block before it, explain after it.** Lead in plainly:
   "Here's the reconciler:", "The whole speech system now sits behind one function:".
   After the block, say what it does and what happens at the boundaries. Keep blocks
   focused; comment the load-bearing lines. Never drop a code block without a lead-in.
5. **Honesty beats.** Keep the real metrics, the tables, the "this fix had its own
   bug", the trade-offs. These are the best part — never trim them for polish.
6. **Conclusion.** Synthesize the takeaway in plain language and tie it back to the
   app/user. One short, warm close. A light pointer to the app or GitHub is fine;
   no "smash follow" energy (the site has no X link by choice).

## Rhythm & readability (the anti-robotic rules)

These are the fixes for what currently reads as machine-made. Follow them literally.

- **Em-dashes: at most ~3 per post, for genuine asides.** Everywhere else use a
  comma, a period, a colon, or parentheses. This is the single biggest tell — the
  current posts use the em-dash as their default connector.
- **Sentence-fragment emphasis ("Right. Not probably right. Right."): at most once
  per post**, if at all. It's a strong move that turns into a mannerism on repeat.
- **Do not end every section on a punchline.** Let most sections finish on an
  ordinary explanatory sentence. Reserve the crafted one-liner for the *one* idea
  that earns it.
- **Vary sentence and paragraph length deliberately.** Human writing is uneven.
  Avoid long runs of same-length punchy sentences.
- **Avoid stacked parallelism.** "X isn't Y. It's Z." / "Those aren't the same
  thing." — fine once, grating by the fourth time. Rephrase most into plain prose.
- **Prefer concrete nouns and specifics over abstract cleverness.** "the IBAN's
  mod-97 check" beats "things that aren't guesses."
- **Read it aloud.** If it sounds like a TED talk or a LinkedIn thread, flatten it.

## Formatting conventions

- `##` for sections, `###` for sub-sections. Descriptive, not cute.
- Fenced code blocks with a language tag (` ```swift `). Comment the key lines.
- **Bold sparingly.** Do *not* use bolded sentence-openers as pseudo-headers or as a
  substitute for a list or subsection — promote them to real `###` headings or write
  them as plain sentences. (The current posts overuse this.)
- Tables for benchmark/result data (keep — they're excellent).
- Blockquotes for real captured artifacts (commit notes, a code comment you're
  quoting). Genuine ones only.
- Frontmatter, unchanged shape:
  ```yaml
  ---
  title: "…"
  description: "One honest line — what the reader learns."
  pubDate: 2026-07-27
  tags: ["Swift Concurrency", "Architecture"]
  draft: false
  ---
  ```
- Keep posts as long as the substance needs and no longer. Cutting a tic never
  costs a fact.

## Hard rules (never violate)

- **Never invent facts, numbers, code, or results.** Everything technical must be
  real — verified against the app's own source, exactly as the current posts do.
- **Never remove a real number, table, caveat, or failure** in the name of style.
- Keep the writing honest about limitations ("my corpus is small", "only two of
  those four bugs were Combine's fault"). That honesty is the brand.

## Quick calibration — before → after

**Before (performs):**
> A checksum is good at being *right*. Not probably right. Right.
>
> So the deterministic recognizers became **authoritative**, and the model's output
> became a proposal to be checked:

**After (plain, Majid-cadence, code introduced):**
> A checksum, by contrast, is exact: an IBAN either passes the mod-97 check or it
> doesn't, with no confidence score involved. So I made the deterministic
> recognizers authoritative and treated the model's output as a proposal to be
> checked against them. Here's the reconciler:

Same facts, same code to follow — one em-dash removed, the fragment tic gone, the
code block introduced plainly.

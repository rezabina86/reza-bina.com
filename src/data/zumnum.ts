import type { CaseStudy } from './caseStudy';

/**
 * ZumNum — learn German numbers by ear.
 *
 * Facts verified against the app's own repo (~/Developer/iOS/NumberTrainer:
 * README, CLAUDE.md, project settings), not inferred:
 *   · Speech is an on-device neural voice (Piper VITS "thorsten", CC0),
 *     synthesized locally — no network call, works offline.
 *   · Mastery: adaptive selection from an EMA per digit category and per
 *     German difficulty feature (unit/tens swap, teens, internal zero), with
 *     need-weighted slot allocation and a weighted tournament.
 *   · Result: a two-layer personalized insight — a title from this game's
 *     quality × trend against the player's own baseline, plus a natural
 *     message (a proven strength + one attainable growth target). The message
 *     is written on-device by Apple Foundation Models on iOS 26+, with a
 *     deterministic rotating fallback everywhere else.
 *   · Localized English + German. SwiftUI, Swift 6, iOS 17+.
 *
 * Deliberately omitted pending Reza's confirmation: the ~114 MiB voice-weights
 * figure from the README. TODO(reza): confirm if you'd like it featured.
 */
export const zumnum: CaseStudy = {
  slug: 'zumnum',
  name: 'ZumNum',
  tagline: 'Learn German numbers by ear.',
  icon: '/icons/zumnum.png',
  status: 'live',
  summary:
    "German numbers are said back to front — 5 716 is “fünftausendsiebenhundertsechzehn”, with the units before the tens — so reading them is one skill and hearing them is another. ZumNum drills the second one: it speaks a number aloud, you type what you heard, and it tells you immediately whether you caught it. The voice is synthesized on the device, so the whole thing works offline, with no ads and no account.",
  features: [
    {
      title: 'Hear it, type it',
      body: 'A neural voice speaks a number; you type the digits and find out instantly whether you got it right — and if not, what it actually was.',
    },
    {
      title: 'It learns what trips you up',
      body: 'Every answer updates a running score per digit length and per German quirk — the swapped units and tens, the teens, an internal zero. Later rounds drift toward the patterns you keep missing, while still revisiting the ones you have mastered.',
    },
    {
      title: 'A result that means something',
      body: 'The end of a round names a genuine strength and one attainable next step, drawn from your own history rather than a percentage. On iOS 26 that sentence is written on-device by Apple Foundation Models; everywhere else a deterministic version says the same thing.',
    },
    {
      title: 'The voice runs on your phone',
      body: 'Speech is synthesized locally by an on-device neural model — no request leaves the device, and it works with no connection at all.',
    },
    {
      title: 'Private by design',
      body: 'No accounts, no tracking, no ads. Nothing you do leaves your phone.',
    },
  ],
  badges: [
    'SwiftUI',
    'Swift 6 Concurrency',
    'On-device neural speech',
    'Apple Foundation Models',
    'Fully offline',
  ],
  platform: 'iOS 17+',
  appStoreUrl: 'https://apps.apple.com/de/app/zumnum/id6748617262?l=en-GB',
  shots: [
    {
      src: '/shots/zumnum/feedback.webp',
      alt: 'ZumNum marking an answer correct: a cartoon avatar above a "Correct" speech bubble and the number 7334.',
      caption: 'Answer, then immediate feedback.',
    },
    {
      src: '/shots/zumnum/intro.webp',
      alt: 'ZumNum start screen on ruled-paper lines, headed "Ready to Catch Some German Numbers?" with a Let’s Practice button.',
      caption: 'Handwritten on ruled paper — the whole app has one voice.',
    },
    {
      src: '/shots/zumnum/listen.webp',
      alt: 'A round in progress: the avatar with a play button and the instruction to play the audio and listen carefully.',
      caption: 'Each round starts with a number spoken aloud.',
    },
    {
      src: '/shots/zumnum/type.webp',
      alt: 'The answer step: "Enter what you heard!" above a numeric field and a Check button, with the number keypad open.',
      caption: 'Type what you heard — digits only, no spelling.',
    },
    {
      src: '/shots/zumnum/wrong.webp',
      alt: 'A wrong answer showing the entry 5760 and a bubble reading "Wrong! It is 5.716".',
      caption: 'A miss shows the real number, so the gap is obvious.',
    },
    {
      src: '/shots/zumnum/result.webp',
      alt: 'End-of-round screen: 11 out of 12, the title "Unstoppable!", and a message about recognizing single digits and mastering the tricky teens next.',
      caption: 'The closing note is personal — a strength, then a next step.',
    },
  ],
};

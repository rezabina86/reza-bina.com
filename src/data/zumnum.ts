/**
 * ZumNum case study — single source of truth shared by the static
 * /work/zumnum route and the React case-study modal, so both stay in sync.
 *
 * Content is honest per HANDOFF §6 — no invented metrics. Confirm the details
 * (badges, feature wording, video) with Reza before treating as final.
 */

export interface CaseStudyFeature {
  title: string;
  body: string;
}

export interface CaseStudy {
  name: string;
  tagline: string;
  summary: string;
  features: CaseStudyFeature[];
  /** "Built with" — accurate tech only (HANDOFF §6). */
  badges: string[];
  platform: string;
  appStoreUrl: string;
  /**
   * Real screen recording (HANDOFF §7.2, §10). Portrait, muted, looping.
   * TODO(reza): provide the .mp4 (+ optional poster). Until then the
   * DeviceFrame shows an honest branded placeholder rather than fake UI.
   */
  video?: {
    src: string;
    poster?: string;
  };
}

export const zumnum: CaseStudy = {
  name: 'ZumNum',
  tagline: 'Learn German numbers by ear.',
  summary:
    'ZumNum plays a German number aloud; you type what you heard and get instant feedback — then it adapts to the numbers you find hardest. Everything runs on your iPhone: the voice is synthesized on-device, so it works fully offline, with no ads and no accounts.',
  features: [
    {
      title: 'Hear it, type it',
      body: 'A neural voice speaks a number; you type the digits and find out instantly whether you got it right.',
    },
    {
      title: 'Adapts to you',
      body: 'Practice weights toward the numbers and patterns you miss most, so your weak spots get the reps.',
    },
    {
      title: 'Fully on-device',
      body: 'Speech is synthesized locally with an on-device neural model — no network request, ever.',
    },
    {
      title: 'Private by design',
      body: 'No accounts, no tracking, no ads. Nothing you do leaves your phone.',
    },
  ],
  badges: ['SwiftUI', 'Swift 6 Concurrency', 'On-device speech', 'Fully offline'],
  platform: 'iOS 17+',
  appStoreUrl: 'https://apps.apple.com/de/app/zumnum/id6748617262?l=en-GB',
  // video: { src: '/video/zumnum.mp4', poster: '/video/zumnum-poster.jpg' },
};

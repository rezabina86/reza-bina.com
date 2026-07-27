import type { CaseStudy } from './caseStudy';

/**
 * ZumNum — learn German numbers by ear.
 *
 * Content is honest per HANDOFF §6 — no invented metrics. Confirm the details
 * (badges, feature wording, video) with Reza before treating as final.
 *
 * TODO(reza): provide the screen recording (~6–12s portrait). Until then the
 * DeviceFrame shows an honest branded placeholder rather than fake UI.
 */
export const zumnum: CaseStudy = {
  slug: 'zumnum',
  name: 'ZumNum',
  tagline: 'Learn German numbers by ear.',
  icon: '/icons/zumnum.png',
  status: 'live',
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

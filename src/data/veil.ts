import type { CaseStudy } from './caseStudy';

/**
 * Veil — on-device document redaction.
 *
 * Facts verified against the app's own repo (README, project settings,
 * Package.resolved) and its UI, not inferred:
 *   · Two detection engines, both local — an on-device AI model (GLiNER via
 *     gliner2swift + MLX) and a built-in "Lite" heuristic.
 *   · Twelve detection categories, individually switchable.
 *   · Two redaction modes — Secure (flattens each page to an image) and
 *     Preserve formatting (which the app itself warns is not safe for highly
 *     sensitive data, because covered text may remain extractable).
 *   · Encrypted on-device vault (CryptoKit), always-redact terms, Vision OCR.
 *   · SwiftUI, Swift 6 with strict concurrency, iOS 18+, StoreKit 2.
 *
 * Deliberately omitted pending Reza's confirmation: the model's on-disk size
 * and the parallel-download speedup figure from the repo README — both are
 * internal measurements I can't independently verify. TODO(reza): confirm if
 * you'd like them featured.
 *
 * Releases (2026-11-17): dates from the iTunes lookup API (1.2.0 live
 * 2026-11-16, 1.1.0 2026-10-06, 1.0.0 2026-08-07); contents from
 * ProjectPrivacy's CHANGELOG.md on `release/1.2.0` (`de05524`) and the 1.2.0
 * store release notes. Tap-to-focus has no Duo gate (PP-170), hence "any
 * iPhone". Captures use the fictional Sherlock Holmes letter from
 * ~/Developer/Assets/Veil/captures — never real data.
 */
export const veil: CaseStudy = {
  slug: 'veil',
  name: 'Veil',
  tagline: 'Share without revealing',
  icon: '/icons/veil.png',
  status: 'live',
  appStoreUrl: 'https://apps.apple.com/app/id6780531974',
  shipped: '2026-08-07',
  // Free to download; the full app is a single one-time purchase (per the
  // Veil business folder and the store listing). Never imply a paid download.
  price: 'free to try · €9.99 one-time unlock · no subscription',
  // The App Store Connect Support URL — contact, privacy note, FAQs.
  supportPath: '/work/veil/support/',
  // The App Store Connect Privacy Policy URL — the app's own policy.
  privacyPath: '/work/veil/privacy/',
  summary:
    "People paste documents into chatbots to get help with them — a tax letter, a payslip, a contract — and hand over their name, address and account numbers in the process. Veil is the step in between: photograph or import the document, let it find the personal details, remove the ones you choose, and share the redacted copy instead. Detection, redaction and storage all happen on your iPhone; the original never leaves the device.",
  features: [
    {
      title: 'Two engines, both local',
      body: 'An on-device AI model finds personal details in context, or a built-in lightweight engine runs instantly with no download. Neither one uploads your document.',
    },
    {
      title: 'You decide what goes',
      body: 'Every detection is listed and selectable, alongside the full recognised text — so you can remove something the model never flagged, and keep something it did.',
    },
    {
      title: 'Redaction that actually removes',
      body: 'Secure mode flattens each page to an image, so redacted content cannot be recovered from the file. The alternative preserves formatting — and says plainly that covered text may still be extractable.',
    },
    {
      title: 'Always-redact terms',
      body: 'Add the details that are yours — your name, your email — and Veil strips them from every document, even when the model would not flag them. Terms are stored encrypted and matched on-device.',
    },
    {
      title: 'An encrypted vault',
      body: 'Keep redacted documents in an encrypted store on the device, or share and keep nothing at all.',
    },
  ],
  lead: {
    src: '/shots/veil/duo-two-truths.webp',
    width: 1312,
    height: 922,
    alt: 'Veil on an open iPhone Duo: on the left page, the fictional letter with each detail marked (What you have); on the right, the copy to share, 9 details removed as black bars (What leaves).',
    caption: 'iPhone Duo, open · the letter you keep, the copy you share',
  },
  releases: [
    {
      date: '2026-11-16',
      version: '1.2.0',
      title: 'Made for iPhone Duo',
      notes: 'Home, Documents and Review as two-page spreads · the original and the redacted copy side by side · tap a detail to find it on the page, on any iPhone · transparent images now read properly',
    },
    {
      date: '2026-10-06',
      version: '1.1.0',
      title: 'Better at US documents',
      notes: "SSNs with or without dashes, ITINs, EINs and labelled routing numbers · labels matched to values across columns · a “Something wasn’t detected?” button",
    },
    {
      date: '2026-08-07',
      version: '1.0.0',
      title: 'First release on the App Store',
      notes: 'Two local detection engines · twelve categories · secure redaction · an encrypted vault',
    },
  ],
  badges: [
    'SwiftUI',
    'Swift 6 Concurrency',
    'On-device AI (MLX)',
    'Vision OCR',
    'CryptoKit',
    'Fully offline',
  ],
  platform: 'iOS 18+',
  shots: [
    {
      src: '/shots/veil/iphone-review.webp',
      width: 720,
      height: 1566,
      alt: 'Veil review on iPhone: a fictional letter with name, address, account numbers and contact details highlighted; 79 things detected, 8 selected to remove.',
      caption: 'Review · what Veil found, ready to change',
    },
    {
      src: '/shots/veil/iphone-result.webp',
      width: 720,
      height: 1566,
      alt: 'The redacted copy on iPhone: the same letter with 8 details removed as solid black bars, flattened to an image, ready to share or save to the vault.',
      caption: 'The copy you share · removed, not covered',
    },
    {
      src: '/shots/veil/mode.webp',
      alt: 'Redaction mode screen offering Secure, which flattens each page to an image, and Preserve formatting, with a warning that covered text may still be extractable.',
      caption: 'Two ways to redact, with the trade-off stated plainly',
    },
    {
      src: '/shots/veil/engine.webp',
      alt: 'Detection model screen offering an on-device AI model or a built-in Lite engine, noting both run only on the iPhone.',
      caption: 'Pick the engine; both run on your phone',
    },
    {
      src: '/shots/veil/categories.webp',
      alt: 'Detection categories screen listing twelve kinds of detail such as SSN, credit card, passport and bank account, each with a toggle.',
      caption: 'Twelve kinds of detail, each switchable',
    },
    {
      src: '/shots/veil/duo-outer-tap.webp',
      width: 720,
      height: 1048,
      alt: "The folded iPhone Duo's outer screen: the letter's text word by word, a missed surname tapped to add it, 9 selected.",
      caption: 'Missed one? Tap the word · Duo, folded',
    },
  ],
};

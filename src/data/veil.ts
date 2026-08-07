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
 */
export const veil: CaseStudy = {
  slug: 'veil',
  name: 'Veil',
  tagline: 'Share without revealing.',
  icon: '/icons/veil.png',
  status: 'live',
  appStoreUrl: 'https://apps.apple.com/us/app/veil-redact-hide-info/id6780531974',
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
      src: '/shots/veil/review.webp',
      alt: 'Veil review screen: a demo letter with detected personal details highlighted, and a sheet listing 278 things detected with 22 selected to remove.',
      caption: 'Every detection listed — and the rest of the text, too.',
    },
    {
      src: '/shots/veil/mode.webp',
      alt: 'Redaction mode screen offering Secure, which flattens each page to an image, and Preserve formatting, with a warning that covered text may still be extractable.',
      caption: 'Two ways to redact, with the trade-off stated plainly.',
    },
    {
      src: '/shots/veil/preview.webp',
      alt: 'Preview screen showing the same letter with 30 details removed as solid black bars, offering share or save to the encrypted vault.',
      caption: 'The redacted copy — details removed, not just covered.',
    },
    {
      src: '/shots/veil/engine.webp',
      alt: 'Detection model screen offering an on-device AI model or a built-in Lite engine, noting both run only on the iPhone.',
      caption: 'Pick the engine; both run on your phone.',
    },
    {
      src: '/shots/veil/categories.webp',
      alt: 'Detection categories screen listing twelve kinds of detail such as SSN, credit card, passport and bank account, each with a toggle.',
      caption: 'Twelve kinds of detail, each switchable.',
    },
  ],
};

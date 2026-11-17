/**
 * Shared case-study shape. Each app exports one of these; the static
 * /work/<slug> route and the React modal both render from it, so the two
 * surfaces can never drift (HANDOFF §7.3).
 *
 * Content rule (HANDOFF §6): everything here must be real — no invented
 * metrics. Facts are taken from the app's own source/docs, not inferred.
 */

export interface CaseStudyFeature {
  title: string;
  body: string;
}

/** A screenshot shown in the contact sheet. */
export interface CaseStudyShot {
  src: string;
  /** Describes what the screen shows — used as the image's alt text. */
  alt: string;
  /** Short caption under the shot in the gallery. */
  caption: string;
  /** Intrinsic pixel size, so the browser reserves the space (no CLS).
   *  Defaults to the original 720×1565 iPhone set. */
  width?: number;
  height?: number;
}

/** The one full-frame picture under the title block (website decision 0011).
 *  A real capture of the app, shown at the frame's width, loaded eagerly
 *  because it is the page's largest paint. */
export interface CaseStudyLead {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

/** One App Store release in the case study's `# releases` log, newest first.
 *  Every line must match what actually shipped (CHANGELOG + the store's
 *  release notes); `date` is the iTunes lookup's release date. */
export interface CaseStudyRelease {
  /** ISO date the version went live on the App Store. */
  date: string;
  version: string;
  /** The headline change — the row's bold name. */
  title: string;
  /** The rest of the release, `·`-separated, sentence case, no full stop. */
  notes: string;
}

export interface CaseStudy {
  /** URL slug — /work/<slug>. */
  slug: string;
  name: string;
  tagline: string;
  /** Path to the app icon in /public. */
  icon: string;
  /** Shipping state — drives the tag shown on the card. */
  status: 'live' | 'coming-soon';
  summary: string;
  features: CaseStudyFeature[];
  /** "Built with" — accurate tech only. */
  badges: string[];
  platform: string;
  /** Omitted while an app is unreleased. Storefront-agnostic form only —
   *  `https://apps.apple.com/app/id<appId>`, never a `/us/` or `/de/` path. */
  appStoreUrl?: string;
  /** ISO date the app first went live on the App Store (per iTunes lookup). */
  shipped?: string;
  /** The price and its shape, stated plainly beside the badge — e.g.
   *  "€9.99 one-time unlock · no subscription". Only when verified. */
  price?: string;
  /** The app's support page (its App Store Connect Support URL), e.g.
   *  `/work/veil/support/`. Rendered as one row on the case study. */
  supportPath?: string;
  /** The app's privacy policy (its App Store Connect Privacy Policy URL), e.g.
   *  `/work/veil/privacy/`. Rendered as a row under the support row. */
  privacyPath?: string;
  /** Full-frame figure under the title block. */
  lead?: CaseStudyLead;
  /** Releases, newest first — rendered as the `# releases` log. */
  releases?: CaseStudyRelease[];
  /** Real screen recording (HANDOFF §7.2). */
  video?: { src: string; poster?: string };
  /** Real screenshots. When present the device frame shows the first one. */
  shots?: CaseStudyShot[];
}

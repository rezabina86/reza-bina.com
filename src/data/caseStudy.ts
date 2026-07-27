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

/** A screenshot shown in the device frame / gallery. */
export interface CaseStudyShot {
  src: string;
  /** Describes what the screen shows — used as the image's alt text. */
  alt: string;
  /** Short caption under the shot in the gallery. */
  caption: string;
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
  /** Omitted while an app is unreleased. */
  appStoreUrl?: string;
  /** Real screen recording (HANDOFF §7.2). */
  video?: { src: string; poster?: string };
  /** Real screenshots. When present the device frame shows the first one. */
  shots?: CaseStudyShot[];
}

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Build-time Open Graph card renderer.
 *
 * Every page gets its own 1200×630 PNG so a shared link previews with the
 * page's actual title instead of a bare stub. Rendered at build time with
 * satori (layout → SVG) + resvg (SVG → PNG), so nothing runs at request time
 * and the static-hosting constraint holds.
 *
 * v3 changelog style: light palette only (social cards have no theme),
 * monospace throughout, one hairline rule, no gradient. Satori needs a real
 * font file and cannot read WOFF2, hence the static @fontsource/ibm-plex-mono
 * WOFFs — a devDependency used only here, never shipped to the client.
 */

const FONT_DIR = path.join(process.cwd(), 'node_modules/@fontsource/ibm-plex-mono/files');
const font = (weight: 400 | 600) =>
  fs.readFileSync(path.join(FONT_DIR, `ibm-plex-mono-latin-${weight}-normal.woff`));

export interface OgCard {
  /** Small label above the title, e.g. "Case study". */
  eyebrow: string;
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Optional trailing metadata, e.g. "27 Jul 2026 · 12 min read". */
  meta?: string;
}

// The v3 light palette (global.css :root).
const BG = '#f7f7f5';
const INK = '#191b1d';
const INK_2 = '#6a6e73';
const RULE = '#cfcfc9';

/** Satori takes a React-element-shaped object; built by hand to avoid JSX here. */
const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style, children },
});

export async function renderOgImage(card: OgCard): Promise<Buffer> {
  const svg = await satori(
    el(
      'div',
      {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: BG,
        padding: '72px 80px',
        fontFamily: 'IBM Plex Mono',
      },
      [
        el('div', { display: 'flex', flexDirection: 'column' }, [
          el(
            'div',
            {
              display: 'flex',
              fontSize: 26,
              color: INK_2,
            },
            `# ${card.eyebrow}`
          ),
          el(
            'div',
            {
              display: 'flex',
              marginTop: 28,
              fontSize: card.title.length > 52 ? 52 : 62,
              fontWeight: 600,
              lineHeight: 1.2,
              color: INK,
            },
            card.title
          ),
          ...(card.subtitle
            ? [
                el(
                  'div',
                  {
                    display: 'flex',
                    marginTop: 24,
                    fontSize: 27,
                    lineHeight: 1.5,
                    color: INK_2,
                  },
                  card.subtitle
                ),
              ]
            : []),
        ]),
        // The single hairline, then the meta line beneath it.
        el('div', { display: 'flex', flexDirection: 'column' }, [
          el('div', { display: 'flex', height: 1, background: RULE }),
          el(
            'div',
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            },
            [
              el('div', { display: 'flex', alignItems: 'center' }, [
                // Proper nouns keep their casing; the masthead is weight 400.
                el('div', { display: 'flex', fontSize: 26, fontWeight: 400, color: INK }, 'Reza Bina'),
                el('div', { display: 'flex', fontSize: 26, color: INK_2, marginLeft: 16 }, 'reza-bina.com'),
              ]),
              ...(card.meta
                ? [el('div', { display: 'flex', fontSize: 24, color: INK_2 }, card.meta)]
                : []),
            ]
          ),
        ]),
      ]
    ) as unknown as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'IBM Plex Mono', data: font(400), weight: 400, style: 'normal' },
        { name: 'IBM Plex Mono', data: font(600), weight: 600, style: 'normal' },
      ],
    }
  );

  return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}

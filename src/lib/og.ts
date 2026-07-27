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
 * Fonts must be TTF/OTF/WOFF — satori cannot read WOFF2, which is all the
 * variable Inter package ships, hence the static @fontsource/inter files.
 */

const FONT_DIR = path.join(process.cwd(), 'node_modules/@fontsource/inter/files');
const font = (weight: 400 | 600) =>
  fs.readFileSync(path.join(FONT_DIR, `inter-latin-${weight}-normal.woff`));

export interface OgCard {
  /** Small uppercase label above the title, e.g. "Case study". */
  eyebrow: string;
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Optional trailing metadata, e.g. "27 Jul 2026 · 12 min read". */
  meta?: string;
}

const BG = '#000000';
const LABEL = '#f5f5f7';
const LABEL_2 = 'rgba(235, 235, 245, 0.60)';
const LABEL_3 = 'rgba(235, 235, 245, 0.42)';
const ACCENT = '#0a84ff';

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
        // Mirrors the site's ambient systemBlue glow.
        backgroundImage:
          'radial-gradient(900px 500px at 12% -10%, rgba(10,132,255,0.28), transparent 60%)',
        padding: '72px 80px',
        fontFamily: 'Inter',
      },
      [
        el('div', { display: 'flex', flexDirection: 'column' }, [
          el(
            'div',
            {
              display: 'flex',
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: ACCENT,
            },
            card.eyebrow
          ),
          el(
            'div',
            {
              display: 'flex',
              marginTop: 28,
              fontSize: card.title.length > 52 ? 62 : 76,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              color: LABEL,
            },
            card.title
          ),
          ...(card.subtitle
            ? [
                el(
                  'div',
                  {
                    display: 'flex',
                    marginTop: 26,
                    fontSize: 30,
                    lineHeight: 1.4,
                    color: LABEL_2,
                  },
                  card.subtitle
                ),
              ]
            : []),
        ]),
        el(
          'div',
          { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
          [
            el(
              'div',
              { display: 'flex', alignItems: 'center' },
              [
                el('div', {
                  display: 'flex',
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: ACCENT,
                  marginRight: 16,
                }),
                el(
                  'div',
                  { display: 'flex', fontSize: 26, fontWeight: 600, color: LABEL },
                  'Reza Bina'
                ),
                el(
                  'div',
                  { display: 'flex', fontSize: 26, color: LABEL_3, marginLeft: 14 },
                  'reza-bina.com'
                ),
              ]
            ),
            ...(card.meta
              ? [el('div', { display: 'flex', fontSize: 24, color: LABEL_3 }, card.meta)]
              : []),
          ]
        ),
      ]
    ) as unknown as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: font(400), weight: 400, style: 'normal' },
        { name: 'Inter', data: font(600), weight: 600, style: 'normal' },
      ],
    }
  );

  return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}

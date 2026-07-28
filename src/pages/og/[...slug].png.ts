import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage, type OgCard } from '../../lib/og';
import { readingMinutes } from '../../lib/readingTime';
import { zumnum } from '../../data/zumnum';
import { veil } from '../../data/veil';

/**
 * One Open Graph card per page, generated at build time.
 *
 * `/og/home.png`, `/og/work-<slug>.png`, `/og/writing-<slug>.png`. Slugs are
 * flattened (no nested directories) so each page can build its own URL from
 * data it already has.
 */

const fmt = (d: Date) =>
  d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);

  const paths: { params: { slug: string }; props: OgCard }[] = [
    {
      params: { slug: 'home' },
      props: {
        eyebrow: 'Senior iOS Engineer',
        title: 'I build native iOS apps that run entirely on your device.',
        subtitle: 'Small, fast, and native — and quietly ambitious under the hood. Nothing leaves your phone.',
      },
    },
    {
      params: { slug: 'writing' },
      props: {
        eyebrow: 'Writing',
        title: 'Notes on private software.',
        subtitle: 'On-device engineering, privacy, and the craft of shipping alone.',
      },
    },
  ];

  for (const study of [zumnum, veil]) {
    paths.push({
      params: { slug: `work-${study.slug}` },
      props: {
        eyebrow: 'Case study',
        title: study.name,
        subtitle: study.tagline,
        meta: study.platform,
      },
    });
  }

  for (const post of posts) {
    paths.push({
      params: { slug: `writing-${post.id}` },
      props: {
        eyebrow: 'Writing',
        title: post.data.title,
        subtitle: post.data.description,
        meta: `${fmt(post.data.pubDate)} · ${readingMinutes(post.body)} min read`,
      },
    });
  }

  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as OgCard);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};

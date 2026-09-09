import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { zumnum } from '../data/zumnum';
import { veil } from '../data/veil';

/**
 * /llms.txt — the llmstxt.org discovery convention: a plain-text map of the
 * site for LLM tools that ingest it. Generated at build time from the same
 * blog collection and case-study data the pages use, so it can't drift from
 * what's published. Kept out of the XML sitemap (it isn't an indexable page)
 * but served at a stable URL.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site!.href; // has a trailing slash

  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const writing = posts
    .map((p) => `- [${p.data.title}](${base}writing/${p.id}/): ${p.data.description}`)
    .join('\n');

  const apps = [zumnum, veil]
    .map((a) => `- [${a.name}](${base}work/${a.slug}/): ${a.tagline}`)
    .join('\n');

  const body = `# Reza Bina — Senior iOS Engineer

> iPhone apps taken from nothing to shipped (ZumNum, Veil) and engineering
> writing on Swift concurrency, on-device ML, and app architecture. Building
> for iPhone since 2015, across ride-hailing, marketplaces and language
> learning.

## Writing
${writing}

## Apps
${apps}

## About
Reza Bina — iOS engineer in Berlin. Contact: rezabina.dev@gmail.com ·
https://github.com/rezabina86 · https://www.linkedin.com/in/reza-bina/
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

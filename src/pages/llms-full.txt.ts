import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * /llms-full.txt — the full Markdown body of every published post, for tools
 * that ingest whole text rather than a link map. Title, canonical URL, then the
 * raw post body, newest first, separated by a horizontal rule. Kept out of the
 * XML sitemap (not an indexable page) but served at a stable URL.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site!.href; // has a trailing slash

  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const body = posts
    .map((p) => `# ${p.data.title}\n${base}writing/${p.id}/\n\n${p.body}`)
    .join('\n\n---\n\n');

  return new Response(body + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

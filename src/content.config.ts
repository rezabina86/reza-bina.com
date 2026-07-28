import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Set when a post is materially revised, so search engines and the meta
    // line can show freshness. Optional: unset means "never updated".
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // Topic labels shown on post cards. Optional so older posts stay valid.
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };

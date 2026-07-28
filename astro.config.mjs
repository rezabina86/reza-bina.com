import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Served from the apex custom domain on GitHub Pages.
// Because it's a root domain (not a project subpath), no `base` is needed.
export default defineConfig({
  site: 'https://reza-bina.com',
  integrations: [
    // React island — used only for the interactive case-study modal + device frame.
    react(),
    // Blog: MDX with Shiki syntax highlighting.
    mdx(),
    // Generates sitemap-index.xml at build; robots.txt points crawlers at it.
    // Exclude the OG images and the llms.txt endpoints — neither is an
    // indexable HTML page, they're just build-time assets served at a URL.
    sitemap({
      filter: (page) =>
        !page.includes('/og/') &&
        !page.endsWith('/llms.txt') &&
        !page.endsWith('/llms-full.txt'),
    }),
  ],
  markdown: {
    // Apple-dark code blocks. Shiki is built in; theme applies to .md and .mdx.
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Served from the apex custom domain on GitHub Pages.
// Because it's a root domain (not a project subpath), no `base` is needed.
export default defineConfig({
  site: 'https://reza-bina.com',
  integrations: [
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
    // Dual-theme code blocks: Shiki inlines the light colours plus
    // --shiki-dark variables; Prose.astro flips them with the same
    // three-state logic as the palette.
    shikiConfig: {
      themes: {
        // The high-contrast variants, not plain github-light/dark: both
        // plain themes set comment grey #6a737d, which fails AA on the
        // light (3.69:1 on white) and dark (3.69:1 on #16181b) grounds.
        light: 'github-light-high-contrast',
        dark: 'github-dark-high-contrast',
      },
      wrap: true,
    },
  },
});

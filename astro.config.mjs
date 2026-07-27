import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// Served from the apex custom domain on GitHub Pages.
// Because it's a root domain (not a project subpath), no `base` is needed.
export default defineConfig({
  site: 'https://reza-bina.com',
  integrations: [
    // React island — used only for the interactive case-study modal + device frame.
    react(),
    // Blog: MDX with Shiki syntax highlighting.
    mdx(),
  ],
  markdown: {
    // Apple-dark code blocks. Shiki is built in; theme applies to .md and .mdx.
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});

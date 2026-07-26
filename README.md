# reza-bina.com

Personal site for Reza Bina — an independent iOS developer building private,
on-device apps. Built with [Astro](https://astro.build), served as a static
site on GitHub Pages from the apex domain `reza-bina.com`.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # preview the production build locally
```

## Add a post

Drop a Markdown file in `src/content/blog/`. Frontmatter:

```md
---
title: "Your title"
description: "One-line summary used for SEO and social cards."
pubDate: 2026-07-26
draft: false        # set true to hide from the site
---

Your post body…
```

The filename becomes the URL slug (`/writing/<filename>`). Newest posts
surface automatically on the home page and the `/writing` index.

## Deploy (GitHub Pages)

Deployment is automatic via GitHub Actions (`.github/workflows/deploy.yml`) on
every push to `main`.

One-time setup:

1. Push this repo to GitHub (e.g. a repo named `reza-bina.com` or
   `rezabina86.github.io`).
2. In the repo: **Settings → Pages → Build and deployment → Source → GitHub
   Actions**.
3. **Custom domain:** the `public/CNAME` file already contains `reza-bina.com`,
   so it's applied on deploy. In **Settings → Pages**, confirm the custom
   domain shows `reza-bina.com` and enable **Enforce HTTPS** once the
   certificate is issued.

### DNS (at your domain registrar)

For the apex domain, add four `A` records pointing to GitHub Pages:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

(Optional) add a `CNAME` record for `www` → `rezabina86.github.io` so
`www.reza-bina.com` redirects to the apex.

DNS can take up to a few hours to propagate; GitHub then issues the TLS
certificate automatically.

## Notes

- No backend, no database, no tracking scripts — by design.
- To add privacy-friendly analytics later, [GoatCounter](https://www.goatcounter.com)
  (free, cookieless) fits the brand; add its snippet in `src/layouts/Base.astro`.
- `site` in `astro.config.mjs` is set to `https://reza-bina.com` for correct
  canonical URLs and sitemap generation.

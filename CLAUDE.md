# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. Project Type

This is a personal blog/technical website built with Astro. The site contains technical tutorials, guides, and articles about software development, DevOps, IoT, and related technologies.

## 2. Tech Stack

- **Framework**: Astro v6.1.8
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS v4.2.2
- **Markdown Support**: MDX and GitHub Flavored Markdown
- **Image Processing**: Sharp
- **Syntax Highlighting**: Shiki (github-dark theme) + highlight.js
- **Features**: RSS feed, sitemap generation, SEO optimization

## 3. Key Configuration Files

### package.json
```json
{
  "name": "astro-temp",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/mdx": "^5.0.3",
    "@astrojs/rss": "^4.0.18",
    "@astrojs/sitemap": "^3.7.2",
    "@tailwindcss/vite": "^4.2.2",
    "astro": "^6.1.8",
    "highlight.js": "^11.11.1",
    "marked": "^18.0.2",
    "sharp": "^0.34.3",
    "tailwindcss": "^4.2.2"
  }
}
```

### astro.config.mjs
```javascript
// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wangjunjian.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
    gfm: true,
    smartypants: true,
    remarkRehype: {
      footnoteLabel: '备注',
      footnoteBackLabel: '返回正文',
    },
  },
  vite: {
    assetsInclude: ['**/*.xml', '**/*.txt'],
  },
});
```

## 4. Project Structure

```
.
├── src/
│   ├── assets/              # Static assets (images, fonts, etc.)
│   │   ├── fonts/           # Font files
│   │   └── *.jpg           # Blog placeholder images
│   ├── components/          # Astro components
│   │   ├── BaseHead.astro   # SEO and head metadata
│   │   ├── Footer.astro    # Site footer
│   │   ├── FormattedDate.astro # Date formatting component
│   │   ├── Header.astro     # Site header
│   │   └── HeaderLink.astro # Navigation link component
│   ├── content/             # Content collections
│   │   ├── posts/          # Blog posts (Markdown/MDX files)
│   │   └── content.config.ts # Content collection schema
│   ├── layouts/             # Page layouts
│   ├── pages/               # Site pages
│   │   ├── about.astro     # About page
│   │   ├── categories.astro # Categories page
│   │   ├── index.astro     # Homepage
│   │   ├── posts/          # Post listing page
│   │   └── tags.astro      # Tags page
│   └── consts.ts           # Global site constants
├── public/                 # Static files served directly
├── dist/                   # Build output (generated)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment config
├── astro.config.mjs        # Astro configuration
├── package.json            # Project dependencies and scripts
├── README.md              # Project documentation
├── CNAME                  # Custom domain configuration
└── .gitignore             # Git ignore rules
```

## 5. Development & Build Commands

All commands are run from the project root:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs project dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Builds production site to `./dist/`          |
| `npm run preview`         | Previews production build locally     |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 6. Deployment

The site uses GitHub Actions for automated deployment to GitHub Pages:

- Workflow file: `.github/workflows/deploy.yml`
- Trigger: Push to main branch or manual dispatch
- Build environment: Ubuntu latest with Node.js 22
- Deploys to: GitHub Pages
- Custom domain: wangjunjian.com (configured in CNAME file)

The deployment workflow:
1. Checks out the code
2. Sets up Node.js environment
3. Installs dependencies with `npm ci`
4. Builds the site with `npm run build`
5. Uploads the `./dist` artifact
6. Deploys to GitHub Pages

## 7. Content Structure

Blog posts are located in `src/content/posts/` and follow the naming format:
`YYYY-MM-DD-slug.md`

Each post uses frontmatter with these fields:
- `title`: Post title
- `date`: Publication date
- `categories`: Post categories (string or array)
- `tags`: Post tags (string or array)
- `excerpt`: Short description/excerpt
- `toc`: Enable table of contents (default: true)
- `toc_sticky`: Sticky table of contents (default: true)
- `toc_label`: Table of contents heading (default: '本文目录')
- `show_date`: Show publication date (default: true)
- `read_time`: Show estimated read time (default: true)

## 8. Site Configuration

- Site title: `Astro Blog` (from src/consts.ts)
- Site description: `Welcome to my website!` (from src/consts.ts)
- Canonical URL: https://wangjunjian.com
- Markdown options: GitHub Flavored Markdown enabled, smartypants enabled
- Syntax highlighting theme: github-dark

// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
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

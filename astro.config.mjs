// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
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
    syntaxHighlight: false,
    gfm: true,
    smartypants: true,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    remarkRehype: {
      footnoteLabel: '备注',
      footnoteBackLabel: '返回正文',
    },
  },
  vite: {
    plugins: [tsconfigPaths(), tailwindcss()],
    assetsInclude: ['**/*.xml', '**/*.txt'],
    server: {
      proxy: {
        '/api/chat': {
          target: 'https://api.longcat.chat/openai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/chat/, '/chat/completions'),
        },
      },
    },
  },
});

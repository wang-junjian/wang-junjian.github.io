// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'astro/config';
import toolsStatic from './src/integrations/toolsStatic.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://wangjunjian.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [mdx(), sitemap(), toolsStatic()],
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('fuse.js')) return 'search';
            if (id.includes('marked') || id.includes('highlight.js')) return 'chat-markdown';
          },
        },
      },
    },
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

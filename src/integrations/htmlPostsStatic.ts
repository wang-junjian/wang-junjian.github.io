import type { AstroIntegration } from 'astro';
import type { Plugin } from 'vite';
import { resolve, join, basename } from 'node:path';
import { existsSync, readFileSync, cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { walkHtmlPosts, findHtmlPostFile } from '../utils/htmlPosts';

const POSTS_DIR = 'posts';

/**
 * Vite 插件：dev 模式下把 /posts/<basename>.html 请求映射到
 * posts/YYYY/<basename>.html 实际文件（与 markdownDevMiddleware 对 .md 的处理一致）。
 * 生产模式下这些 URL 由 astro:build:done 钩子复制出的静态文件服务。
 */
function htmlPostsDevMiddleware(): Plugin {
  return {
    name: 'html-posts-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/posts/', (req, res, next) => {
        if (!req.url || req.method !== 'GET') {
          return next();
        }

        const match = req.url.split('?')[0].match(/^\/([^/]+)\.html$/);
        if (!match) {
          return next();
        }

        const id = decodeURIComponent(match[1]);
        // 目录穿越防护：id 不允许包含路径分隔符（正则已限制无 /，再防 ..）
        if (id.includes('..') || id.includes('\\')) {
          return next();
        }

        const postsDir = resolve(process.cwd(), POSTS_DIR);
        const filePath = findHtmlPostFile(postsDir, id);
        if (!filePath || !existsSync(filePath)) {
          return next();
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(filePath));
      });
    },
  };
}

/**
 * 将 posts/YYYY/*.html 作为独立静态页服务：
 * - dev：通过 vite 中间件实时读取 posts/ 目录；
 * - build：复制到 dist/posts/<basename>.html（剥掉年份目录，与扁平 URL 一致）。
 * basename 冲突时终止构建，避免静默覆盖。
 */
export default function htmlPostsStatic(): AstroIntegration {
  return {
    name: 'html-posts-static',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({ vite: { plugins: [htmlPostsDevMiddleware()] } });
      },
      'astro:build:done': ({ dir }) => {
        const src = resolve(POSTS_DIR);
        if (!existsSync(src)) return;

        const files = Array.from(walkHtmlPosts(src));
        if (files.length === 0) return;

        const byId = new Map<string, string>();
        for (const file of files) {
          const id = basename(file, '.html');
          const existing = byId.get(id);
          if (existing) {
            throw new Error(`[html-posts] HTML 文章 basename 冲突：${existing} 与 ${file}（id 均为 ${id}）`);
          }
          byId.set(id, file);
        }

        const outDir = join(fileURLToPath(dir), POSTS_DIR);
        mkdirSync(outDir, { recursive: true });
        for (const [id, file] of byId) {
          cpSync(file, join(outDir, `${id}.html`));
        }
      },
    },
  };
}

import type { AstroIntegration } from 'astro';
import type { Plugin } from 'vite';
import { resolve, join } from 'node:path';
import { existsSync, readFileSync, cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { walkHtmlPosts } from '../utils/htmlPosts';
import { findPostFile, assertUniqueBasenames } from '../utils/postFiles';

/** HTML 文章的源目录（独立于 Markdown 的 posts/）。 */
const SRC_DIR = 'posts-html';
/** build 输出目录，对应 URL /posts/<id>.html —— 契约不变，勿随 SRC_DIR 改动。 */
const OUT_DIR = 'posts';

/**
 * Vite 插件：dev 模式下把 /posts/<basename>.html 请求映射到
 * posts-html/YYYY/<basename>.html 实际文件（与 markdownDevMiddleware 对 .md 的处理一致）。
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

        const postsDir = resolve(process.cwd(), SRC_DIR);
        const filePath = findPostFile(postsDir, id, '.html');
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
 * 将 posts-html/YYYY/*.html 作为独立静态页服务：
 * - dev：通过 vite 中间件实时读取 posts-html/ 目录；
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
        const src = resolve(SRC_DIR);
        if (!existsSync(src)) return;

        const files = Array.from(walkHtmlPosts(src));
        if (files.length === 0) return;

        const byId = assertUniqueBasenames(files, '.html');

        const outDir = join(fileURLToPath(dir), OUT_DIR);
        mkdirSync(outDir, { recursive: true });
        for (const [id, file] of byId) {
          cpSync(file, join(outDir, `${id}.html`));
        }
      },
    },
  };
}

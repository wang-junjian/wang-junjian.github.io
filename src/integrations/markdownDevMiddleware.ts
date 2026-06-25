import fs from 'node:fs';
import path from 'node:path';
import type { ViteDevServer, Plugin } from 'vite';

/**
 * Vite plugin that resolves `/posts/<post-id>.md` requests in development
 * to the actual file located under `posts/YYYY/<post-id>.md`.
 *
 * In production, the same URLs are generated as static files by the
 * `src/pages/posts/[...slug].ts` API route. In dev mode, Vite serves `.md`
 * files as static assets, so we need this middleware to map the flat URL
 * to the year-based directory structure.
 */
export default function markdownDevMiddleware(): Plugin {
  return {
    name: 'markdown-dev-middleware',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/posts/', (req, res, next) => {
        if (!req.url || req.method !== 'GET') {
          return next();
        }

        const match = req.url.match(/^\/([^/]+)\.md$/);
        if (!match) {
          return next();
        }

        const postId = decodeURIComponent(match[1]);
        const postsDir = path.resolve(process.cwd(), 'posts');

        const filePath = findPostFile(postsDir, postId);
        if (!filePath || !fs.existsSync(filePath)) {
          return next();
        }

        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

function findPostFile(postsDir: string, postId: string): string | null {
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(postsDir, entry.name);
    if (entry.isDirectory()) {
      const found = findPostFile(fullPath, postId);
      if (found) return found;
    } else if (entry.isFile() && entry.name === `${postId}.md`) {
      return fullPath;
    }
  }
  return null;
}

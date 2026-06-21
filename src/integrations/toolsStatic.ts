import type { AstroIntegration } from 'astro';
import { resolve, extname, join, sep } from 'node:path';
import {
  existsSync,
  statSync,
  readFileSync,
  cpSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';

const TOOLS_DIR = 'tools';
const TOOLS_URL_PREFIX = '/tools/';

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

function getContentType(filePath: string) {
  return mimeTypes[extname(filePath)] || 'application/octet-stream';
}

function tryServeTool(req, res) {
  const reqUrl = req.url || '';
  if (!reqUrl.startsWith(TOOLS_URL_PREFIX)) {
    return false;
  }

  const pathname = decodeURIComponent(reqUrl.split('?')[0]);
  const relativePath = pathname.slice(TOOLS_URL_PREFIX.length);
  if (!relativePath || relativePath.endsWith('/')) {
    return false;
  }

  const toolsRoot = resolve(TOOLS_DIR);
  const filePath = resolve(toolsRoot, relativePath);

  // Directory traversal guard (sep-aware for Windows)
  if (!filePath.startsWith(toolsRoot + sep) && filePath !== toolsRoot) {
    return false;
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    return false;
  }

  const content = readFileSync(filePath);
  res.setHeader('Content-Type', getContentType(filePath));
  res.end(content);
  return true;
}

export default function toolsStatic(): AstroIntegration {
  return {
    name: 'tools-static',
    hooks: {
      'astro:server:setup': ({ server }) => {
        const listeners = server.httpServer.listeners('request').slice();
        server.httpServer.removeAllListeners('request');
        server.httpServer.on('request', (req, res) => {
          if (tryServeTool(req, res)) return;
          listeners.forEach(listener => listener(req, res));
        });
      },
      'astro:build:done': ({ dir }) => {
        const src = resolve(TOOLS_DIR);
        if (!existsSync(src)) return;

        const outDir = fileURLToPath(dir);
        const dest = join(outDir, TOOLS_DIR);
        cpSync(src, dest, { recursive: true, dereference: true });
      },
    },
  };
}

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: `${post.id}.md` },
  }));
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

export const GET: APIRoute = async ({ params, url }) => {
  console.log('[markdown endpoint] params:', params, 'url:', url);
  const rawSlug = params.slug;
  if (!rawSlug || Array.isArray(rawSlug)) {
    return new Response('Not found', { status: 404 });
  }
  const postId = rawSlug.replace(/\.md$/, '');
  const postsDir = path.resolve(process.cwd(), 'posts');
  const filePath = findPostFile(postsDir, postId);

  if (!filePath || !fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};

export const prerender = true;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { findPostFile } from '../../utils/postFiles';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: `${post.id}.md` },
  }));
}

export const GET: APIRoute = async ({ params, url }) => {
  console.log('[markdown endpoint] params:', params, 'url:', url);
  const rawSlug = params.slug;
  if (!rawSlug || Array.isArray(rawSlug)) {
    return new Response('Not found', { status: 404 });
  }
  const postId = rawSlug.replace(/\.md$/, '');
  const postsDir = path.resolve(process.cwd(), 'posts');
  const filePath = findPostFile(postsDir, postId, '.md');

  if (!filePath || !fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};

export const prerender = true;

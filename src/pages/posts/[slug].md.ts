import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;
  const relativePath = post.filePath ?? `src/content/posts/${post.id}.md`;
  const filePath = path.resolve(process.cwd(), relativePath);

  if (!fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};

export const prerender = true;

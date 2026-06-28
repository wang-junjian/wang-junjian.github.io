import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { normalizeTags, formatDate, getPostDisplayTitle, sortPostsByDate, cleanBodyForSearch } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sortedPosts = sortPostsByDate(posts);

  const items = sortedPosts.map((post) => ({
    id: post.id,
    title: getPostDisplayTitle(post),
    date: post.data.date ? new Date(post.data.date).toISOString() : '',
    formattedDate: formatDate(post.data.date),
    excerpt: post.data.excerpt || '',
    tags: normalizeTags(post.data.tags),
    type: post.data.type,
    body: cleanBodyForSearch(post.body || '').slice(0, 5000), // 限制单篇长度
    url: `/posts/${post.id}`,
  }));

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

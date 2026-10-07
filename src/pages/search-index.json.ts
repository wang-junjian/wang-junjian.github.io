import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { normalizeTags, formatDate, getPostDisplayTitle, sortPostsByDate, cleanBodyForSearch } from '../utils/posts';
import { getHtmlPosts, stripHtmlForSearch } from '../utils/htmlPosts';
import { readFileSync } from 'node:fs';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sortedPosts = sortPostsByDate(posts);

  const mdItems = sortedPosts.map((post) => ({
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

  // HTML 文章：正文剥离标签后入库，url 指向独立 .html 页面
  const htmlItems = getHtmlPosts().map((post) => ({
    id: post.id,
    title: post.title,
    date: post.date.toISOString(),
    formattedDate: formatDate(post.date),
    excerpt: post.excerpt || '',
    tags: post.tags,
    type: 'article',
    body: stripHtmlForSearch(readFileSync(post.filePath, 'utf-8')).slice(0, 5000),
    url: post.url,
  }));

  const items = [...mdItems, ...htmlItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

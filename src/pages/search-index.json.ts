import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { normalizeCategories, normalizeTags, formatDate } from '../utils/posts';

function cleanBodyForSearch(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, ' ')       // 代码块
    .replace(/`[^`]*`/g, ' ')               // 行内代码
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ') // 图片
    .replace(/\[[^\]]*\]\([^)]+\)/g, '$1') // 链接保留文字
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/m, '') // frontmatter
    .replace(/<\/?[^>]+(>|$)/g, ' ')        // HTML 标签
    .replace(/https?:\/\/\S+/g, ' ')        // URL
    .replace(/[#*~>_|=\-]/g, ' ')           // Markdown 语法字符
    .replace(/\s+/g, ' ')                   // 合并空白
    .trim();
}

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  const items = sortedPosts.map((post) => ({
    id: post.id,
    title: post.data.title || post.id,
    date: post.data.date ? new Date(post.data.date).toISOString() : '',
    formattedDate: formatDate(post.data.date),
    excerpt: post.data.excerpt || '',
    categories: normalizeCategories(post.data.categories),
    tags: normalizeTags(post.data.tags),
    body: cleanBodyForSearch(post.body || '').slice(0, 20000), // 限制单篇长度
    url: `/posts/${post.id}`,
  }));

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

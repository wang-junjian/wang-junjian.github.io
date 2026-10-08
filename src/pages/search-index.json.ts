import type { APIContext } from 'astro';
import { normalizeTags, formatDate, getPostDisplayTitle, cleanBodyForSearch } from '../utils/posts';
import { isHtmlEntry, stripHtmlForSearch, getEntryUrl } from '../utils/htmlPosts';
import { getMergedPosts } from '../utils/mergedPosts';
import { readFileSync } from 'node:fs';

export async function GET(context: APIContext) {
  // 已按日期降序（getMergedPosts 契约），无需再排序
  const posts = await getMergedPosts();

  const items = posts.map((post) => {
    // HTML 文章：正文剥离标签后入库，url 指向独立 .html 页面
    if (isHtmlEntry(post)) {
      return {
        id: post.id,
        title: post.data.title,
        date: post.data.date.toISOString(),
        formattedDate: formatDate(post.data.date),
        excerpt: post.data.excerpt || '',
        tags: post.data.tags,
        type: 'article',
        body: stripHtmlForSearch(readFileSync(post.filePath, 'utf-8')).slice(0, 5000), // 限制单篇长度
        url: getEntryUrl(post),
      };
    }
    return {
      id: post.id,
      title: getPostDisplayTitle(post),
      date: post.data.date ? new Date(post.data.date).toISOString() : '',
      formattedDate: formatDate(post.data.date),
      excerpt: post.data.excerpt || '',
      tags: normalizeTags(post.data.tags),
      type: post.data.type,
      body: cleanBodyForSearch(post.body || '').slice(0, 5000), // 限制单篇长度
      url: getEntryUrl(post),
    };
  });

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

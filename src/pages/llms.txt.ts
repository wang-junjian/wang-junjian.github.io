import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { normalizeTags, formatDate } from '../utils/posts';

const SITE_URL = 'https://wangjunjian.com';

function formatPostDate(date: Date | string | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getStaticPaths() {
  return [{ params: {} }];
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');

  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  const allTags = new Set<string>();

  for (const post of sortedPosts) {
    normalizeTags(post.data.tags).forEach(t => allTags.add(t));
  }

  let content = '';
  content += `# ${SITE_TITLE}\n\n`;
  content += `> ${SITE_DESCRIPTION}\n\n`;

  content += `## 导航\n\n`;
  content += `- [首页](${SITE_URL}/)\n`;
  content += `- [标签](${SITE_URL}/tags)\n`;
  content += `- [幻灯片](${SITE_URL}/slides)\n`;
  content += `- [关于](${SITE_URL}/about)\n\n`;

  content += `## 文章\n\n`;
  for (const post of sortedPosts) {
    const date = formatPostDate(post.data.date);
    const excerpt = post.data.excerpt ? ` — ${post.data.excerpt}` : '';
    content += `- [${post.data.title}](${SITE_URL}/posts/${post.id}.md) — ${date}${excerpt}\n`;
  }

  content += `\n`;
  content += `---\n\n`;
  content += `本文件由 ${SITE_TITLE} 自动生成，旨在帮助 LLM 理解本站内容。\n`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

export const prerender = true;

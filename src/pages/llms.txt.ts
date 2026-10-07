import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { normalizeTags, formatDate, getPostDisplayTitle, sortPostsByDate, getShanghaiDateComponents } from '../utils/posts';
import { getHtmlPosts } from '../utils/htmlPosts';

const SITE_URL = 'https://wangjunjian.com';

function formatPostDate(date: Date | string | undefined): string {
  if (!date) return '';
  const { year, month, day } = getShanghaiDateComponents(date);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export async function getStaticPaths() {
  return [{ params: {} }];
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');

  const sortedPosts = sortPostsByDate(posts);

  const allTags = new Set<string>();

  for (const post of sortedPosts) {
    normalizeTags(post.data.tags).forEach(t => allTags.add(t));
  }

  let content = '';
  content += `# ${SITE_TITLE}\n\n`;
  content += `> ${SITE_DESCRIPTION}\n\n`;

  content += `## 导航\n\n`;
  content += `- [首页](${SITE_URL}/)\n`;
  content += `- [标签](${SITE_URL}/tags/)\n`;
  content += `- [幻灯片](${SITE_URL}/slides/)\n`;
  content += `- [关于](${SITE_URL}/about/)\n\n`;

  content += `## 文章\n\n`;
  const mdEntries = sortedPosts.map((post) => ({
    date: post.data.date ? new Date(post.data.date) : new Date(0),
    line: `- [${getPostDisplayTitle(post)}](${SITE_URL}/posts/${post.id}.md) — ${formatPostDate(post.data.date)}${post.data.excerpt ? ` — ${post.data.excerpt}` : ''}\n`,
  }));
  // HTML 文章是独立页面，链接指向 .html（无 .md 源）
  const htmlEntries = getHtmlPosts().map((post) => ({
    date: post.date,
    line: `- [${post.title}](${SITE_URL}${post.url}) — ${formatPostDate(post.date)}${post.excerpt ? ` — ${post.excerpt}` : ''}\n`,
  }));
  const allEntries = [...mdEntries, ...htmlEntries].sort((a, b) => b.date.getTime() - a.date.getTime());
  for (const entry of allEntries) {
    content += entry.line;
  }

  content += `\n`;
  content += `---\n\n`;
  content += `本文件由 ${SITE_TITLE} 自动生成，旨在帮助 LLM 理解本站内容。\n`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

export const prerender = true;

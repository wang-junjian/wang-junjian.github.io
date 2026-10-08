import type { APIRoute } from 'astro';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getPostDisplayTitle, formatDayKey } from '../utils/posts';
import { isHtmlEntry, getEntryUrl } from '../utils/htmlPosts';
import { getMergedPosts } from '../utils/mergedPosts';
import { getPostSourceUrl } from '../utils/entryUrls';

const SITE_URL = 'https://wangjunjian.com';

export async function getStaticPaths() {
  return [{ params: {} }];
}

export const GET: APIRoute = async () => {
  // 已按日期降序（getMergedPosts 契约），无需再排序
  const posts = await getMergedPosts();

  let content = '';
  content += `# ${SITE_TITLE}\n\n`;
  content += `> ${SITE_DESCRIPTION}\n\n`;

  content += `## 导航\n\n`;
  content += `- [首页](${SITE_URL}/)\n`;
  content += `- [标签](${SITE_URL}/tags/)\n`;
  content += `- [幻灯片](${SITE_URL}/slides/)\n`;
  content += `- [关于](${SITE_URL}/about/)\n\n`;

  content += `## 文章\n\n`;
  for (const post of posts) {
    // Markdown 文章链接到 .md 源；HTML 文章是独立页面，链接到 .html（无 .md 源）
    const title = isHtmlEntry(post) ? post.data.title : getPostDisplayTitle(post);
    const url = isHtmlEntry(post) ? getEntryUrl(post) : getPostSourceUrl(post.id);
    const excerpt = post.data.excerpt;
    content += `- [${title}](${SITE_URL}${url}) — ${post.data.date ? formatDayKey(post.data.date) : ''}${excerpt ? ` — ${excerpt}` : ''}\n`;
  }

  content += `\n`;
  content += `---\n\n`;
  content += `本文件由 ${SITE_TITLE} 自动生成，旨在帮助 LLM 理解本站内容。\n`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

export const prerender = true;

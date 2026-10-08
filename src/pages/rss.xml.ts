import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getPostDisplayTitle, generateExcerpt } from '../utils/posts';
import { isHtmlEntry, getEntryUrl } from '../utils/htmlPosts';
import { getMergedPosts } from '../utils/mergedPosts';

export async function GET(context: APIContext) {
  // 已按日期降序（getMergedPosts 契约），无需再排序
  const posts = await getMergedPosts();

  const items = posts.map((post) => {
    // HTML 文章是独立页面，链接指向 /posts/<id>.html
    if (isHtmlEntry(post)) {
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.excerpt || '',
        link: getEntryUrl(post),
      };
    }
    const isShort =
      post.data.type === 'quote' ||
      post.data.type === 'note' ||
      post.data.type === 'link' ||
      post.data.type === 'release';
    const description = isShort
      ? (generateExcerpt(post.body || '', 200) || post.data.excerpt || '')
      : (post.data.excerpt || '');
    return {
      title: getPostDisplayTitle(post),
      pubDate: post.data.date,
      description,
      link: getEntryUrl(post),
    };
  });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site?.toString() || 'https://wangjunjian.com',
    items,
    customData: `<language>zh-CN</language>
<copyright>© ${new Date().getFullYear()} ${SITE_TITLE}</copyright>`,
  });
}

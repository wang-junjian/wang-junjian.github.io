import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getPostDisplayTitle, generateExcerpt, sortPostsByDate } from '../utils/posts';
import { getHtmlPosts } from '../utils/htmlPosts';
import { getPostUrl } from '../utils/entryUrls';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sortedPosts = sortPostsByDate(posts);

  const mdItems = sortedPosts.map((post) => {
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
      link: getPostUrl(post.id),
    };
  });

  // HTML 文章是独立页面，链接指向 /posts/<id>.html
  const htmlItems = getHtmlPosts().map((post) => ({
    title: post.title,
    pubDate: post.date,
    description: post.excerpt || '',
    link: post.url,
  }));

  const items = [...mdItems, ...htmlItems].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site?.toString() || 'https://wangjunjian.com',
    items,
    customData: `<language>zh-CN</language>
<copyright>© ${new Date().getFullYear()} ${SITE_TITLE}</copyright>`,
  });
}

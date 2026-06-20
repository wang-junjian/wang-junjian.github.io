import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site?.toString() || 'https://wangjunjian.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt || '',
      link: `/posts/${post.id}`,
    })),
    customData: `<language>zh-CN</language>
<copyright>© ${new Date().getFullYear()} ${SITE_TITLE}</copyright>`,
  });
}

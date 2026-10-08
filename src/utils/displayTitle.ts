import { marked } from 'marked';
import { stripHtmlTags } from './preview';

interface DisplayTitleSource {
  id: string;
  body?: string;
  data: { title?: string; type?: string; author?: string; linkUrl?: string };
}

export function getPostDisplayTitle(post: DisplayTitleSource): string {
  const { type, title, author, linkUrl } = post.data;
  if (title) return title;
  if (type === 'quote' && author) return `来自 ${author} 的引用`;
  if (type === 'note') {
    const body = post.body || '';
    const html = marked.parse(body, { async: false, gfm: true }) as string;
    const text = stripHtmlTags(html).replace(/\s+/g, ' ').trim();
    if (text) {
      return text.length > 30 ? text.slice(0, 30) + '…' : text;
    }
    return '笔记';
  }
  if (type === 'link' || type === 'release') {
    if (linkUrl) {
      try {
        const url = new URL(linkUrl);
        return url.hostname.replace(/^www\./, '');
      } catch {
        return linkUrl;
      }
    }
    return type === 'release' ? '发布' : '链接';
  }
  return post.id;
}

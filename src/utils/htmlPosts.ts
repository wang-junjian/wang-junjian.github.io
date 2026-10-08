import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import type { CollectionEntry } from 'astro:content';
import { metaContent, titleContent } from './htmlMeta';
import { getHtmlPostUrl, getPostUrl } from './entryUrls';

const POSTS_DIR = 'posts';

/** HTML 文章的元数据，从 posts/YYYY/*.html 的 <head> 中解析。 */
export interface HtmlPostMeta {
  /** basename 去扩展名，如 2026-09-22-ai-native-sdlc-workflow-guide */
  id: string;
  /** 文件的绝对路径 */
  filePath: string;
  title: string;
  date: Date;
  excerpt?: string;
  tags: string[];
  author?: string;
  /** 扁平 URL：/posts/<id>.html */
  url: string;
}

/**
 * 与 CollectionEntry<'posts'> 结构兼容的 HTML 文章条目，
 * 可混入列表页统一渲染；isHtml 作为类型判别字段。
 */
export interface HtmlPostEntry {
  id: string;
  collection: 'posts';
  body: string;
  isHtml: true;
  data: {
    title: string;
    date: Date;
    type: 'article';
    tags: string[];
    excerpt?: string;
    author?: string;
  };
}

export type StreamEntry = CollectionEntry<'posts'> | HtmlPostEntry;

export function isHtmlEntry(entry: StreamEntry): entry is HtmlPostEntry {
  return (entry as HtmlPostEntry).isHtml === true;
}

/** 条目的页面 URL：HTML 文章指向独立 .html 页，Markdown 文章指向 /posts/<id>/。 */
export function getEntryUrl(entry: StreamEntry): string {
  return isHtmlEntry(entry) ? getHtmlPostUrl(entry.id) : getPostUrl(entry.id);
}

/** 递归遍历 dir 下的 HTML 文章文件（跳过 `_` 前缀）。 */
export function* walkHtmlPosts(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkHtmlPosts(p);
    } else if (entry.isFile() && entry.name.endsWith('.html') && !entry.name.startsWith('_')) {
      yield p;
    }
  }
}

const FILENAME_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})/;

/** 解析单个 HTML 文章文件。 */
export function parseHtmlPost(filePath: string): HtmlPostMeta {
  const raw = readFileSync(filePath, 'utf-8');
  const id = basename(filePath, '.html');

  let date: Date | undefined;
  const dateMeta = metaContent(raw, 'date');
  if (dateMeta) {
    date = new Date(dateMeta);
  } else {
    const match = id.match(FILENAME_DATE_REGEX);
    if (match) {
      date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00+08:00`);
    }
  }
  if (!date || isNaN(date.getTime())) {
    // mtime 在 CI checkout 后不稳定，仅为兜底；请补 <meta name="date"> 或日期文件名前缀
    console.warn(`[html-posts] ${filePath} 缺少有效日期（meta date / 文件名前缀），使用文件修改时间兜底`);
    date = statSync(filePath).mtime;
  }

  const keywords = metaContent(raw, 'keywords');
  const tags = keywords
    ? keywords.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
    : [];

  return {
    id,
    filePath,
    title: titleContent(raw) ?? id,
    date,
    excerpt: metaContent(raw, 'description'),
    tags,
    author: metaContent(raw, 'author'),
    url: getHtmlPostUrl(id),
  };
}

/**
 * 扫描 posts/ 下全部 HTML 文章，按日期降序返回。
 * basename（年份目录剥掉后的 id）必须全库唯一，冲突直接抛错。
 */
export function getHtmlPosts(baseDir = process.cwd()): HtmlPostMeta[] {
  const postsDir = join(baseDir, POSTS_DIR);
  let files: string[];
  try {
    files = Array.from(walkHtmlPosts(postsDir));
  } catch {
    return [];
  }

  const seen = new Map<string, string>();
  for (const file of files) {
    const id = basename(file, '.html');
    const existing = seen.get(id);
    if (existing) {
      throw new Error(`[html-posts] HTML 文章 basename 冲突：${existing} 与 ${file}（id 均为 ${id}）`);
    }
    seen.set(id, file);
  }

  return files
    .map(parseHtmlPost)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function toStreamEntry(meta: HtmlPostMeta): HtmlPostEntry {
  return {
    id: meta.id,
    collection: 'posts',
    body: '',
    isHtml: true,
    data: {
      title: meta.title,
      date: meta.date,
      type: 'article',
      tags: meta.tags,
      excerpt: meta.excerpt,
      author: meta.author,
    },
  };
}

/**
 * Markdown 文章与 HTML 文章合并后的全量列表，按日期降序。
 * 注意：astro:content 不能在 Astro 配置上下文中加载，故此处动态导入。
 */
export async function getMergedPosts(): Promise<StreamEntry[]> {
  const { getCollection } = await import('astro:content');
  const mdPosts = await getCollection('posts');
  const htmlEntries = getHtmlPosts().map(toStreamEntry);
  return [...mdPosts, ...htmlEntries].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}

/** 在 postsDir 下递归查找 id 对应的 HTML 文件，供 dev 中间件使用。 */
export function findHtmlPostFile(postsDir: string, id: string): string | null {
  for (const entry of readdirSync(postsDir, { withFileTypes: true })) {
    const fullPath = join(postsDir, entry.name);
    if (entry.isDirectory()) {
      const found = findHtmlPostFile(fullPath, id);
      if (found) return found;
    } else if (entry.isFile() && entry.name === `${id}.html`) {
      return fullPath;
    }
  }
  return null;
}

/** 剥离 HTML 的 script/style/标签，生成纯文本供搜索索引使用。 */
export function stripHtmlForSearch(raw: string): string {
  return raw
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
